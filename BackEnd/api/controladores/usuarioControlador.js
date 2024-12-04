import cnx from "./conexion.js";
import jwt from "jsonwebtoken";
import env from "../../enviroment/enviroment.js";

const handleDatabaseError = (error, res, message) => {
  console.error(error);
  res.status(500).json({ error: message });
};

const executeQuery = async (conexion, query, params) => {
  try {
    const [result] = await conexion.execute(query, params);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (req, res) => {
  const { correo_institucional, password } = req.body;

  const queries = {
    userExists: `SELECT id_usuario AS id, nombre, apellido, rol, foto, fecha_nac FROM usuarios WHERE correo_institucional = ?`,
    passwordMatch: `SELECT id_usuario AS id, nombre, apellido, rol, foto, fecha_nac FROM usuarios WHERE correo_institucional = ? AND contraseña = ?`,
    alumnoData: `SELECT id_alumno, numero_control, especialidad, semestre, turno, curp, grupo FROM alumnos WHERE id_usuario = ?`,
    profesorData: `SELECT id_profesor FROM profesores WHERE id_usuario = ?`,
  };

  const conexion = await cnx();

  try {
    // Verifica si el usuario existe
    const user = await executeQuery(conexion, queries.userExists, [
      correo_institucional,
    ]);
    if (!user.length) {
      return res.status(404).json({ respuesta: "Correo no encontrado" });
    }

    // Verificar la contraseña
    const validUser = await executeQuery(conexion, queries.passwordMatch, [
      correo_institucional,
      password,
    ]);
    if (!validUser.length) {
      return res.status(401).json({ respuesta: "Contraseña incorrecta" });
    }

    const userData = validUser[0];
    if (userData.foto) {
      userData.foto = userData.foto.toString("utf8");
    }

    // Si el usuario es alumno, obtener datos adicionales
    const alumnoData = await executeQuery(conexion, queries.alumnoData, [
      userData.id,
    ]);
    if (alumnoData.length) {
      userData.alumno = alumnoData[0];
    }

    // Si el usuario es alumno, obtener datos adicionales
    const profesorData = await executeQuery(conexion, queries.profesorData, [
      userData.id,
    ]);
    if (profesorData.length) {
      userData.profesor = profesorData[0];
    }

    // Generar el token
    const token = jwt.sign(userData, env.key, { expiresIn: env.exp });

    return res.json({ token, foto: userData.foto || null });
  } catch (error) {
    handleDatabaseError(
      error,
      res,
      "Error al procesar la solicitud de inicio de sesión"
    );
  } finally {
    await conexion.end();
  }
};

const registrarUsuario = async (req, res) => {
  const {
    correo_institucional,
    nombre,
    apellido,
    rol,
    password,
    numero_control,
    especialidad,
    semestre,
    grupo,
    turno,
    curp,
    departamento,
    telefono,
    foto,
  } = req.body;

  // Validar campos obligatorios básicos
  if (!correo_institucional || !nombre || !apellido || !rol || !password) {
    return res
      .status(400)
      .json({
        error:
          "Los campos correo_institucional, nombre, apellido, rol y password son obligatorios.",
      });
  }

  // Queries dinámicas según el rol
  const queries = {
    checkUserExists: `SELECT id_usuario FROM usuarios WHERE correo_institucional = ?`,
    insertUser: `INSERT INTO usuarios (correo_institucional, nombre, apellido, rol, contraseña, foto) VALUES (?, ?, ?, ?, ?, ?)`,
    insertAlumno: `INSERT INTO alumnos (id_usuario, numero_control, especialidad, semestre, grupo, turno, curp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    insertProfesor: `INSERT INTO profesores (id_usuario, departamento, especialidad, telefono) VALUES (?, ?, ?, ?)`,
  };

  const conexion = await cnx();

  try {
    // Verificar si el usuario ya existe
    const userExists = await executeQuery(conexion, queries.checkUserExists, [
      correo_institucional,
    ]);
    if (userExists.length) {
      return res.status(409).json({ error: "El usuario ya existe." });
    }

    // Insertar en la tabla "usuarios"
    const [userResult] = await conexion.execute(queries.insertUser, [
      correo_institucional,
      nombre,
      apellido,
      rol,
      password,
      foto || null, // Si no se proporciona foto, guarda `null`
    ]);
    const userId = userResult.insertId;

    // Insertar en la tabla correspondiente según el rol
    if (rol === "Alumno") {
      if (
        !numero_control ||
        !especialidad ||
        !semestre ||
        !grupo ||
        !turno ||
        !curp
      ) {
        return res
          .status(400)
          .json({
            error: "Faltan datos específicos para registrar un alumno.",
          });
      }
      await conexion.execute(queries.insertAlumno, [
        userId,
        numero_control,
        especialidad,
        semestre,
        grupo,
        turno,
        curp,
      ]);
    } else if (rol === "Profesor") {
      if (!departamento || !especialidad || !telefono) {
        return res
          .status(400)
          .json({
            error: "Faltan datos específicos para registrar un profesor.",
          });
      }
      await conexion.execute(queries.insertProfesor, [
        userId,
        departamento,
        especialidad,
        telefono,
      ]);
    } else if (rol === "Administrador") {
      // No se requiere inserción adicional, ya que solo se registra en "usuarios"
    } else {
      return res.status(400).json({ error: "Rol no válido." });
    }

    res.status(201).json({ mensaje: `${rol} registrado exitosamente.` });
  } catch (error) {
    handleDatabaseError(error, res, "Error al registrar el usuario.");
  } finally {
    await conexion.end();
  }
};

const actualizarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { rol, foto, ...datos } = req.body; // Extraemos 'foto' del cuerpo de la solicitud

  if (!id_usuario || !rol) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Se requiere el ID del usuario y el rol para actualizar.",
      });
  }

  // Mapeo de campos permitidos según el rol
  const roleFields = {
    Alumno: [
      "semestre",
      "grupo",
      "especialidad",
      "numero_control",
      "turno",
      "curp",
    ],
    Profesor: ["departamento", "especialidad", "telefono"],
    // Agrega más roles si es necesario
  };

  if (!roleFields[rol]) {
    return res
      .status(400)
      .json({ success: false, error: `El rol "${rol}" no es válido.` });
  }

  // Inicializar variables para las consultas
  const paramsUsuarios = [];
  const updateFieldsUsuarios = [];
  const paramsRolEspecifico = [];
  const updateFieldsRolEspecifico = [];

  // Función para añadir campos dinámicamente
  const addField = (field, value, updateFields, params) => {
    if (value !== undefined && value !== null) {
      // Asegurarse de que el valor no sea undefined o null
      updateFields.push(`${field} = ?`);
      params.push(value);
    }
  };

  // Agregar campos para la tabla "usuarios"
  addField(
    "correo_institucional",
    datos.correo_institucional,
    updateFieldsUsuarios,
    paramsUsuarios
  );
  addField("nombre", datos.nombre, updateFieldsUsuarios, paramsUsuarios);
  addField("apellido", datos.apellido, updateFieldsUsuarios, paramsUsuarios);

  // Agregar la foto si está presente
  if (foto) {
    addField("foto", foto, updateFieldsUsuarios, paramsUsuarios);
  }

  // Agregar campos específicos para el rol
  roleFields[rol].forEach((field) =>
    addField(
      field,
      datos[field],
      updateFieldsRolEspecifico,
      paramsRolEspecifico
    )
  );

  // Validar si hay algo que actualizar
  if (
    updateFieldsUsuarios.length === 0 &&
    updateFieldsRolEspecifico.length === 0
  ) {
    return res
      .status(400)
      .json({
        success: false,
        error: "No se proporcionaron datos para actualizar.",
      });
  }

  // Preparar las consultas SQL
  let queryUser = "";
  let queryRolEspecifico = "";

  if (updateFieldsUsuarios.length > 0) {
    queryUser = `UPDATE usuarios SET ${updateFieldsUsuarios.join(
      ", "
    )} WHERE id_usuario = ?`;
  }

  if (updateFieldsRolEspecifico.length > 0) {
    queryRolEspecifico = `UPDATE ${rol.toLowerCase()}s SET ${updateFieldsRolEspecifico.join(
      ", "
    )} WHERE id_usuario = ?`;
  }

  const conexion = await cnx();

  try {
    await conexion.beginTransaction();

    // Actualizar tabla "usuarios" si hay datos
    if (updateFieldsUsuarios.length > 0) {
      paramsUsuarios.push(id_usuario); // Agregar el ID al final
      await conexion.execute(queryUser, paramsUsuarios);
    }

    // Actualizar tabla específica según el rol si hay datos
    if (updateFieldsRolEspecifico.length > 0) {
      paramsRolEspecifico.push(id_usuario); // Agregar el ID al final
      await conexion.execute(queryRolEspecifico, paramsRolEspecifico);
    }

    await conexion.commit();

    res.json({
      success: true,
      message: `Usuario y datos del rol "${rol}" actualizados correctamente.`,
      updatedFields: {
        usuarios: updateFieldsUsuarios.map((field) => field.split(" ")[0]),
        [rol.toLowerCase()]: updateFieldsRolEspecifico.map(
          (field) => field.split(" ")[0]
        ),
      },
    });
  } catch (error) {
    await conexion.rollback();
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        error: `Error al actualizar el usuario y los datos del rol "${rol}".`,
      });
  } finally {
    await conexion.end();
  }
};

const eliminarUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ error: "El ID del usuario es obligatorio." });
  }

  const conexion = await cnx();

  try {
    // Iniciar transacción
    await conexion.beginTransaction();

    // Verificar si el usuario existe
    const [usuarioExiste] = await conexion.execute(
      `SELECT id_usuario FROM usuarios WHERE id_usuario = ?`,
      [id_usuario]
    );
    if (!usuarioExiste.length) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Eliminar datos relacionados
    await conexion.execute(
      `DELETE FROM tareas_alumnos WHERE id_alumno IN (SELECT id_alumno FROM alumnos WHERE id_usuario = ?)`,
      [id_usuario]
    );
    await conexion.execute(
      `DELETE FROM asistencias WHERE id_alumno_clase IN (SELECT id_alumno_clase FROM alumnos_clases WHERE id_alumno IN (SELECT id_alumno FROM alumnos WHERE id_usuario = ?))`,
      [id_usuario]
    );
    await conexion.execute(
      `DELETE FROM alumnos_clases WHERE id_alumno IN (SELECT id_alumno FROM alumnos WHERE id_usuario = ?)`,
      [id_usuario]
    );
    await conexion.execute(`DELETE FROM alumnos WHERE id_usuario = ?`, [
      id_usuario,
    ]);
    await conexion.execute(
      `DELETE FROM tareas WHERE id_clase IN (SELECT id_clase FROM clases WHERE id_profesor IN (SELECT id_profesor FROM profesores WHERE id_usuario = ?))`,
      [id_usuario]
    );
    await conexion.execute(
      `DELETE FROM clases WHERE id_profesor IN (SELECT id_profesor FROM profesores WHERE id_usuario = ?)`,
      [id_usuario]
    );
    await conexion.execute(`DELETE FROM profesores WHERE id_usuario = ?`, [
      id_usuario,
    ]);

    // Finalmente, eliminar el usuario
    await conexion.execute(`DELETE FROM usuarios WHERE id_usuario = ?`, [
      id_usuario,
    ]);

    // Confirmar transacción
    await conexion.commit();

    res.status(200).json({ mensaje: "Usuario eliminado correctamente." });
  } catch (error) {
    // Revertir transacción en caso de error
    await conexion.rollback();
    handleDatabaseError(
      error,
      res,
      "Error al eliminar el usuario y sus datos relacionados."
    );
  } finally {
    await conexion.end();
  }
};

const listaUsuarios = async (req, res) => {
  const { rol } = req.query; // Opción para filtrar por rol si se proporciona en la solicitud

  // Construcción dinámica de la consulta
  const query = `
        SELECT 
            u.id_usuario AS id, u.nombre, u.apellido, u.rol, u.foto, u.correo_institucional,
            CASE 
                WHEN u.rol = 'Alumno' THEN JSON_OBJECT(
                    'id_alumno', a.id_alumno,
                    'numero_control', a.numero_control,
                    'especialidad', a.especialidad,
                    'semestre', a.semestre,
                    'grupo', a.grupo,
                    'turno', a.turno
                )
                WHEN u.rol = 'Profesor' THEN JSON_OBJECT(
                    'id_profesor', p.id_profesor,
                    'departamento', p.departamento,
                    'especialidad', p.especialidad,
                    'telefono', p.telefono
                )
                ELSE NULL
            END AS detalles
        FROM usuarios u
        LEFT JOIN alumnos a ON u.id_usuario = a.id_usuario
        LEFT JOIN profesores p ON u.id_usuario = p.id_usuario
        ${rol ? `WHERE u.rol = '${rol}'` : ""}
    `;

  const conexion = await cnx();

  try {
    const users = await executeQuery(conexion, query);
    if (!users.length) {
      return res.status(404).json({ error: "No hay registros" });
    }

    // Convertir las fotos (si existen) a formato de cadena
    users.forEach((user) => {
      if (user.foto) user.foto = user.foto.toString("utf8");
    });

    res.json(users); // se envia la respuesta en json
  } catch (error) {
    handleDatabaseError(error, res, "Error al obtener la lista de usuarios");
  } finally {
    await conexion.end();
  }
};

export default {
  login,
  listaUsuarios,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
};

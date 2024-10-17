import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';

const login = async (req, res) => {
    const { correo_institucional, password } = req.body;
    console.log('Correo institucional:', correo_institucional, 'Contraseña:', password);

    const sqlUserExists = `SELECT id_usuario AS id, nombre, apellido, rol, foto FROM usuarios WHERE correo_institucional = ?`; // Consulta para verificar si el usuario existe
    const sqlPasswordMatch = `SELECT id_usuario AS id, nombre, apellido, rol, foto FROM usuarios WHERE correo_institucional = ? AND contraseña = ?`; // Consulta para verificar la contraseña
    const sqlAlumnoData = `SELECT numero_control, especialidad, semestre, turno, curp FROM alumnos WHERE id_usuario = ?`; // Consulta para obtener datos del alumno
    const conexion = await cnx();
    let registro;
    let foto;
    let datosAlumno = null;

    try {
        // Primero, verifica si el usuario existe
        [registro] = await conexion.execute(sqlUserExists, [correo_institucional]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }

    // Si el usuario no existe, enviar un error 404
    if (!registro || registro.length === 0) {
        return res.status(404).json({ respuesta: 'Correo no encontrado' });
    }

    // Verificar la contraseña
    try {
        [registro] = await conexion.execute(sqlPasswordMatch, [correo_institucional, password]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }

    // Si la contraseña no coincide, enviar un error 401
    if (!registro || registro.length === 0) {
        return res.status(401).json({ respuesta: 'Contraseña incorrecta' });
    } else {
        if (registro[0].foto != null) {
            foto = registro[0].foto.toString('utf8');
            registro[0].foto = null;
        }
    }

    const user = registro[0];

    // Si el usuario es un alumno, obtener datos de la tabla "alumnos"
    try {
        [datosAlumno] = await conexion.execute(sqlAlumnoData, [user.id]);
        console.log('Datos del alumno:', datosAlumno?.[0] || 'No es un alumno o no tiene datos asociados');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener los datos del alumno' });
    }

    // Generar el token con los datos del usuario
    const token = jwt.sign(user, env.key, { expiresIn: env.exp });
    console.log('Datos del usuario antes de enviar respuesta:', user);

    // Enviar los datos del usuario, foto y datos del alumno si aplica
    res.json({ token: token, foto: foto, alumno: datosAlumno?.[0] || null });
};

const registrarAlumno = async (req, res) => {
    const { correo_institucional, nombre, rol, password, numero_de_control, especialidad, semestre } = req.body;

    // Valida que los datos requeridos estén presentes
    if (!correo_institucional || !nombre || !rol || !password) {
        return res.status(400).json({ error: 'Todos los campos de usuario son obligatorios' });
    }

    // Valida que los campos adicionales del alumno estén presentes
    if (!numero_de_control || !especialidad || !semestre) {
        return res.status(400).json({ error: 'Los campos de alumno son obligatorios' });
    }

    const sqlCheckUserExists = `SELECT id_usuario FROM usuarios WHERE correo_institucional = ?`;
    const sqlInsertUser = `INSERT INTO usuarios (correo_institucional, nombre, rol, contraseña) VALUES (?, ?, ?, ?)`;
    const sqlInsertAlumno = `INSERT INTO alumnos (id_usuario, numero_control, especialidad, semestre) VALUES (?, ?, ?, ?)`;

    const conexion = await cnx();
    let registro;

    try {
        // Verifica si el usuario ya existe
        [registro] = await conexion.execute(sqlCheckUserExists, [correo_institucional]);

        if (registro && registro.length > 0) {
            return res.status(409).json({ error: 'El usuario ya existe' }); // Conflicto
        }

        // Inserta el nuevo usuario en la tabla de usuarios
        const [resultadoUsuario] = await conexion.execute(sqlInsertUser, [correo_institucional, nombre, rol, password]);
        const id_usuario = resultadoUsuario.insertId; // Obtiene el ID del usuario insertado

        // Inserta los datos adicionales en la tabla de alumnos
        await conexion.execute(sqlInsertAlumno, [id_usuario, numero_de_control, especialidad, semestre]);

        res.status(201).json({ mensaje: 'Alumno registrado exitosamente' }); // Creado
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
}

const listaUsuario = async (req, res) => {
    const sql = `SELECT * FROM usuarios`;
    const conexion = await cnx();
    let registro;
    try {
        [registro] = await conexion.execute(sql);
        if (!registro || registro.length === 0) {
            return res.status(404).json({ error: 'No hay registros' });
        }
        else {
            for (var i = 0; i < registro.length; i++ ){
                if (registro[i].foto !=  null ){
                    registro[i].foto = registro[i].foto.toString('utf8');
                }
            }
            res.json(registro);
        }
    } catch (error) {
        console.log(error);
    }
}

export default { login, listaUsuario, registrarAlumno };


import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';

const login = async (req, res) => {
    const { correo_institucional, password } = req.body; // Cambia 'usuario' por 'correo_institucional'
    console.log(correo_institucional, password);

    const sqlUserExists = `SELECT id_usuario AS id, nombre, rol FROM usuarios WHERE correo_institucional = ?`; // Consulta para verificar si el usuario existe
    const sqlPasswordMatch = `SELECT id_usuario AS id, nombre, rol FROM usuarios WHERE correo_institucional = ? AND contraseña = ?`; // Consulta para verificar la contraseña
    const conexion = await cnx();
    let registro;

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
    }

    // Si el usuario existe y la contraseña es correcta, generar el token
    const user = registro[0];
    const token = jwt.sign(user, env.key, { expiresIn: env.exp });

    res.json({ token });
}

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
        res.json(registro);
    } catch (error) {
        console.log(error);
    }
}

export default { login, listaUsuario, registrarAlumno };


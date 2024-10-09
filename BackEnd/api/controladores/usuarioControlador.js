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

export default { login, listaUsuario };

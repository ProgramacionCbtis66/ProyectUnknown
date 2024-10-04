import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';


const login = async (req, res) => {
    const { usuario, password } = req.body;
    console.log(usuario, password);

    const sql = `SELECT nombre, usuario_id AS id, rol FROM usuarios WHERE usuario_id = ? AND password = ?`;
    const conexion = await cnx();
    let registro;

    try {
        // Consulta segura con placeholders
        [registro] = await conexion.execute(sql, [usuario, password]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }

    console.log(registro);

    // Verificar si hay registros
    if (registro && registro.length > 0) {
        const user = registro[0];
        const token = jwt.sign(user, env.key, { expiresIn: env.exp });

        res.json({ token });
    } else {
        res.status(401).json({ respuesta: 'Usuario y/o contraseña incorrectos' });
    }
}


const listaUsuario = async (req, res) => {
    const sql = `select * from usuarios`
    const conexion = await cnx();
    var registro;
    try {
        [registro] = await conexion.execute(sql);
        res.json(registro);
    } catch (error) {
        console.log(error);
    }

}

export default { login, listaUsuario };
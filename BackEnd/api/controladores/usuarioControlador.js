import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';


const login = async(req, res) => {
    const {usuario, password} = req.body;
    console.log(usuario, password);
    const sql = `select nombre,usuario_id id,rol from usuarios where usuario_id = '${usuario}' and password = '${password}'`;
    const conexion = await cnx();
    var registro;
    try {
        [registro] = await conexion.execute(sql);


    } catch (error) {
        console.log(error);
    }
console.log(registro);

    if (registro.length > 0) {
        var user = JSON.stringify(registro[0]);
        var usr = JSON.parse(user);
        const token = jwt.sign(usr, env.key, { expiresIn: env.exp });
        res.json({ token });
    } else {
        res.json({
            respuesta: 'usuario y contraseña incorrectos'
        })
    }
}

const listaUsuario = async(req,res)=>{
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

export default {login,listaUsuario};
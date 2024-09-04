import cnx from './conexion.js';

const login = async(req, res) => {
    const {usuario, password} = req.body;
    console.log(usuario, password);
    const sql = `select nombre from usuarios where usuario_id = '${usuario}' and password = '${password}'`;
    const conexion = await cnx();
    var registro;
    try {
        [registro] = await conexion.execute(sql);


    } catch (error) {
        console.log(error);
    }

    if (registro.length > 0) {
        res.json({
            respuesta: registro[0].nombre
        });
    } else {
        res.json({
            respuesta: 'usuario y contraseña incorrectos'
        })
    }
}

export default {login};
import { Router } from "express";
import vtoken from "./Authorization/Vtoken.js";
import file from 'fs';
import { forEach, index } from "mathjs";
import env from "../../enviroment/enviroment.js";

const prueba = Router();



prueba.post('/prueba', (req, res) => {
    // Crear la carpeta
    const directorio = env.dir+req.body.cb;
    console.log(directorio);
    const carpetas = ['/biblioteca','/controlEscolar','/planeacion','/subDireccion','/direccion','/vinculacion','/servicioDocente'];

    carpetas.forEach((carpeta,index) =>{
        file.mkdir(directorio+carpeta, { recursive: true }, (err) => {
            if (err) {
                return console.error('Error al crear la carpeta:', err);
            }
            console.log('Carpeta creada exitosamente!');
        });
    });

    res.json({
        "respuesta": "carpeta creada"
    });

});

prueba.post('/pruebaPDF',(req,res)=>{
    const pdf = req.body;
    file.createWriteStream('./api/assets/cb66'+pdf.pdf);
})
export default prueba;
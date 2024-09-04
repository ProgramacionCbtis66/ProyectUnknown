import { Router } from "express";
import usuario from "../controladores/usuarioControlador.js";

const usr = Router();

usr.get('/usr/prueba',(req,res) =>{
res.json({mensaje: "I'M on the folder api and file usuario.js"});
});

usr.post('/usr/prueba2', usuario.login)

export default usr;
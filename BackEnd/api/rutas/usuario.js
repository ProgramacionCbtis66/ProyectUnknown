import { Router } from "express";
import usuario from "../controladores/usuarioControlador.js";

const usr = Router();

usr.get('/usr/listUsr',Utoken,usuario.listaUsuario);

usr.post('/usr/prueba2', usuario.login)

export default usr;
import { Router } from "express";
import usuario from "../controladores/usuarioControlador.js";
import vtoken from "./Authorization/Vtoken.js";

const usr = Router();

usr.get('/usr/listUsr',vtoken,usuario.listaUsuario);

usr.post('/usr/login', usuario.login)

export default usr;
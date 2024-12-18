import { Router } from "express";
import usuario from "../controladores/usuarioControlador.js";
import vtoken from "./Authorization/Vtoken.js";

const usr = Router();

usr.get('/usr/listUsr',vtoken,usuario.listaUsuario);

usr.post('/usr/login', usuario.login)

usr.post('/usr/RegistrarAlumno', usuario.registrarAlumno);

usr.post('/usr/ActualizarAlumno',usuario.actualizarAlumno)

export default usr;
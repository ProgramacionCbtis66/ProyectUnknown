import { Router } from "express";
import usuario from "../controladores/usuarioControlador.js";
import vtoken from "./Authorization/Vtoken.js";

const usr = Router();

// Listar usuarios
usr.get("/usr/listUsr", usuario.listaUsuarios);

// Iniciar sesión
usr.post("/usr/login", usuario.login);

// Registrar un nuevo usuario (Alumno, Profesor, Administrativo)
usr.post("/usr/registrarUsr", usuario.registrarUsuario);

// Actualizar datos de un alumno (usando PUT y parámetro dinámico)
usr.put("/usr/actualizarUsr/:id_usuario", vtoken, usuario.actualizarUsuario);

usr.delete("/usr/eliminarUsr/:id_usuario", usuario.eliminarUsuario);


export default usr;

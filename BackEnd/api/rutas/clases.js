import { Router } from "express";
import clase from "../controladores/claseControlador.js";
import vtoken from "./Authorization/Vtoken.js";

const Clase = Router();

Clase.post('/class/crearClase', clase.crearClase);
Clase.post('/class/agregarTarea', clase.agregarTarea);
Clase.post('/class/asociarAlumnosAClase', clase.asociarAlumnosAClase);
Clase.get('/class/ListClases', clase.ListClases);
Clase.get('/class/obtenerTareasPendientes/:id_alumno', clase.obtenerTareasPendientes);
Clase.put('/class/actualizarEstadoYCalificacion', clase.actualizarEstadoYCalificacion);

export default Clase;
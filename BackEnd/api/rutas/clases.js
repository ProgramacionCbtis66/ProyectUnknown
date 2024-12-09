import { Router } from "express";
import clase from "../controladores/claseControlador.js";
import vtoken from "./Authorization/Vtoken.js";

const Clase = Router();

// Rutas para clases y tareas
Clase.post('/class/crearClase', clase.crearClase);

Clase.post('/class/agregarTarea', clase.agregarTarea);

Clase.post('/class/asociarAlumnosAClase', clase.asociarAlumnosAClase);

Clase.get('/class/ListClases', clase.ListClases); // Lista todas las clases

Clase.get('/class/ListClasesByAlumno/:id_alumno', clase.ListClasesByAlumno); // Lista las clases de un alumno específico

Clase.get('/class/ListClasesByProfesor/:id_profesor', clase.ListClasesByProfesor);

Clase.get('/class/obtenerTareasPendientes/:id_alumno', clase.obtenerTareasPendientes); // Obtiene tareas pendientes del alumno

Clase.put('/class/actualizarEstadoYCalificacion', clase.actualizarEstadoYCalificacion); // Actualiza estado y calificación

// Nueva ruta para eliminar una clase
Clase.delete('/class/eliminarClase/:id_clase', clase.DeleteClaseById);

// Nueva ruta para obtener los alumnos asociados a una clase
Clase.get('/class/obtenerAlumnosPorClase/:id_clase', clase.obtenerAlumnosPorClase);

Clase.post('/class/registrarAsistencia', clase.registrarAsistencia);

Clase.get('/class/porcentajeAsistencias/:id_alumno', clase.calcularPorcentajeAsistencias);

export default Clase;

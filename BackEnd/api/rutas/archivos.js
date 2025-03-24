import { Router } from 'express';
import { upload, uploadFile} from '../controladores/archivosControlador.js';

const file = Router();

// Ruta para subir archivos (tarea, alumno, horario, general)
file.post('/file/upload', upload.single('archivo'), uploadFile);

// Ruta para obtener archivos de tareas (sin cambios)

export default file;
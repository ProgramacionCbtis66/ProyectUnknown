import { Router } from 'express';
import { upload, entregarTarea, getTareaArchivo } from './../controladores/archivosControlador.js';

const file = Router();

file.post('/file/entregar-tarea', upload.single('archivo'), entregarTarea);
file.get('/file/tarea/:id_tarea/:id_alumno', getTareaArchivo);


export default file;

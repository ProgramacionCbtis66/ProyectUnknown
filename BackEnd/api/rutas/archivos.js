import { Router } from 'express';
import { upload, entregarTarea } from './../controladores/archivosControlador.js';

const file = Router();

file.post('/file/entregar-tarea', upload.single('archivo'), entregarTarea);

export default file;

import { Router } from 'express';
import {
  obtenerProfesores,
  obtenerProfesorPorId,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor
} from '../../controladores/profesorControlador.js';

const router = Router();

// GET: Obtener todos los profesores
router.get('/profesores', obtenerProfesores);

// GET: Obtener un profesor por id_profesor
router.get('/profesores/:id', obtenerProfesorPorId);

// POST: Crear un profesor
router.post('/profesores', crearProfesor);

// PUT: Actualizar un profesor
router.put('/profesores/:id', actualizarProfesor);

// DELETE: Eliminar un profesor
router.delete('/profesores/:id', eliminarProfesor);

export default router;

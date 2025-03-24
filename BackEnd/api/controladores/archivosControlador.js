import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = 'temp/';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Funciones de utilidad
const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const moveFile = (file, destinationPath) => {
  fs.renameSync(file.path, destinationPath);
};

const handleDatabaseError = (error, res, message) => {
  console.error(error);
  res.status(500).json({ error: message });
};

// Funciones para manejar la lógica de subida
const handleTareaUpload = async (req, res, conexion) => {
  const { id_tarea, id_alumno } = req.body;
  const archivo = req.file;

  if (!id_tarea || !id_alumno || !archivo) {
    return res.status(400).json({
      error: 'Los campos id_tarea, id_alumno y archivo son obligatorios.',
    });
  }

  const queries = {
    getClaseNombre: `
      SELECT c.nombre_clase
      FROM clases c
      JOIN tareas t ON t.id_clase = c.id_clase
      WHERE t.id_tarea = ?;
    `,
    checkTareaAlumnoExists: `
      SELECT id_tarea_alumno
      FROM tareas_alumnos
      WHERE id_tarea = ? AND id_alumno = ? AND estado = 'Pendiente';
    `,
    updateEstadoTarea: `
      UPDATE tareas_alumnos 
      SET estado = 'Entregado', fecha_entrega = NOW() 
      WHERE id_tarea = ? AND id_alumno = ?;
    `,
    insertArchivo: `
      INSERT INTO archivos_tareas (id_tarea_alumno, ruta_archivo, nombre_archivo) 
      VALUES (?, ?, ?);
    `,
  };

  try {
    const [claseResult] = await conexion.execute(queries.getClaseNombre, [id_tarea]);

    if (!claseResult.length) {
      return res.status(404).json({
        error: 'No se encontró la clase asociada a esta tarea.',
      });
    }

    const nombreClase = claseResult[0].nombre_clase;
    const [result] = await conexion.execute(queries.checkTareaAlumnoExists, [id_tarea, id_alumno]);

    if (!result.length) {
      return res.status(404).json({
        error: 'La tarea no existe, no está pendiente, o no pertenece al alumno especificado.',
      });
    }

    const id_tarea_alumno = result[0].id_tarea_alumno;
    const baseDir = path.join(env.dir, 'clases', nombreClase);
    ensureDirectoryExists(baseDir);

    const rutaArchivo = path.join(baseDir, archivo.filename);
    moveFile(archivo, rutaArchivo);

    await conexion.execute(queries.updateEstadoTarea, [id_tarea, id_alumno]);
    await conexion.execute(queries.insertArchivo, [id_tarea_alumno, rutaArchivo, archivo.filename]);

    res.status(201).json({
      mensaje: 'Tarea entregada exitosamente.',
      archivo: {
        ruta: rutaArchivo,
        nombre: archivo.filename,
      },
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error al entregar la tarea.');
  }
};

const handleAlumnoUpload = async (req, res) => {
  const { id_alumno } = req.body;
  const archivo = req.file;

  if (!id_alumno || !archivo) {
    return res.status(400).json({
      error: 'Los campos id_alumno y archivo son obligatorios.',
    });
  }

  try {
    const baseDir = path.join(env.dir, 'alumnos', id_alumno);
    ensureDirectoryExists(baseDir);

    const rutaArchivo = path.join(baseDir, archivo.filename);
    moveFile(archivo, rutaArchivo);

    res.status(201).json({
      mensaje: 'Archivo del alumno subido exitosamente.',
      archivo: {
        ruta: rutaArchivo,
        nombre: archivo.filename,
      },
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error al subir el archivo del alumno.');
  }
};

const handleHorarioUpload = async (req, res) => {
  const archivo = req.file;

  if (!archivo) {
    return res.status(400).json({
      error: 'El archivo es obligatorio.',
    });
  }

  try {
    const baseDir = path.join(env.dir, 'horarios');
    ensureDirectoryExists(baseDir);

    const rutaArchivo = path.join(baseDir, archivo.filename);
    moveFile(archivo, rutaArchivo);

    res.status(201).json({
      mensaje: 'Horario subido exitosamente.',
      archivo: {
        ruta: rutaArchivo,
        nombre: archivo.filename,
      },
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error al subir el horario.');
  }
};

const handleGeneralUpload = async (req, res) => {
  const { ruta } = req.body;
  const archivo = req.file;

  if (!ruta || !archivo) {
    return res.status(400).json({
      error: 'Los campos ruta y archivo son obligatorios.',
    });
  }

  try {
    ensureDirectoryExists(ruta);

    const rutaArchivo = path.join(ruta, archivo.filename);
    moveFile(archivo, rutaArchivo);

    res.status(201).json({
      mensaje: 'Archivo subido exitosamente.',
      archivo: {
        ruta: rutaArchivo,
        nombre: archivo.filename,
      },
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error al subir el archivo.');
  }
};

// Controlador principal
const uploadFile = async (req, res) => {
  const { tipo } = req.body;

  const conexion = await cnx();

  try {
    switch (tipo) {
      case 'tarea':
        await handleTareaUpload(req, res, conexion);
        break;
      case 'alumno':
        await handleAlumnoUpload(req, res);
        break;
      case 'horario':
        await handleHorarioUpload(req, res);
        break;
      case 'general':
        await handleGeneralUpload(req, res);
        break;
      default:
        res.status(400).json({ error: 'Tipo de subida no válido.' });
        break;
    }
  } finally {
    await conexion.end();
  }
};

// Exportar el middleware de carga y el controlador
export { upload, uploadFile };
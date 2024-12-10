import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configuración temporal de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = 'temp/';
    cb(null, tempDir); // Carpeta temporal para guardar los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const entregarTarea = async (req, res) => {
    const { id_tarea, id_alumno } = req.body;
    const archivo = req.file;

    // Validar campos obligatorios
    if (!id_tarea || !id_alumno || !archivo) {
        return res.status(400).json({
            error: 'Los campos id_tarea, id_alumno y archivo son obligatorios.',
        });
    }

    // Consultas SQL
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

    const conexion = await cnx();

    try {
        // Obtener el nombre de la clase usando id_tarea
        const [claseResult] = await conexion.execute(queries.getClaseNombre, [id_tarea]);

        if (!claseResult.length) {
            return res.status(404).json({
                error: 'No se encontró la clase asociada a esta tarea.',
            });
        }

        const nombreClase = claseResult[0].nombre_clase;

        // Verificar que la tarea existe y está pendiente
        const [result] = await conexion.execute(queries.checkTareaAlumnoExists, [id_tarea, id_alumno]);

        if (!result.length) {
            return res.status(404).json({
                error: 'La tarea no existe, no está pendiente, o no pertenece al alumno especificado.',
            });
        }

        const id_tarea_alumno = result[0].id_tarea_alumno;

        // Construir la ruta para almacenar el archivo
        const baseDir = path.join(env.dir, 'clases', nombreClase);
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        const rutaArchivo = path.join(baseDir, archivo.filename);
        console.log(rutaArchivo);

        // Mover el archivo a la ubicación final
        fs.renameSync(archivo.path, rutaArchivo);

        // Actualizar el estado de la tarea a "Entregado"
        await conexion.execute(queries.updateEstadoTarea, [id_tarea, id_alumno]);

        // Insertar la información del archivo en la base de datos
        const nombreArchivo = archivo.filename;

        await conexion.execute(queries.insertArchivo, [id_tarea_alumno, rutaArchivo, nombreArchivo]);

        res.status(201).json({
            mensaje: 'Tarea entregada exitosamente.',
            archivo: {
                ruta: rutaArchivo,
                nombre: nombreArchivo,
            },
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al entregar la tarea.');
    } finally {
        await conexion.end();
    }
};


// Exportar el middleware de carga y el controlador
export { upload, entregarTarea };

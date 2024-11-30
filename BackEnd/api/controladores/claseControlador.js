import cnx from './conexion.js';
import jwt from 'jsonwebtoken';
import env from '../../enviroment/enviroment.js';

const handleDatabaseError = (error, res, message) => {
    console.error(error);
    res.status(500).json({ error: message });
};

const executeQuery = async (conexion, query, params) => {
    try {
        const [result] = await conexion.execute(query, params);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const crearClase = async (req, res) => {
    const { nombre_clase, id_profesor } = req.body;

    // Validar campos obligatorios
    if (!nombre_clase || !id_profesor) {
        return res.status(400).json({ error: 'Los campos nombre_clase y id_profesor son obligatorios.' });
    }

    // Consultas SQL
    const queries = {
        checkProfesorExists: `SELECT id_profesor FROM profesores WHERE id_profesor = ?`,
        insertClase: `INSERT INTO clases (nombre_clase, id_profesor) VALUES (?, ?)`
    };

    const conexion = await cnx();

    try {
        // Verificar si el profesor existe
        const profesorExists = await executeQuery(conexion, queries.checkProfesorExists, [id_profesor]);
        if (!profesorExists.length) {
            return res.status(404).json({ error: 'El profesor especificado no existe.' });
        }

        // Insertar la clase
        const [classResult] = await conexion.execute(queries.insertClase, [nombre_clase, id_profesor]);
        const classId = classResult.insertId;

        res.status(201).json({
            mensaje: 'Clase creada exitosamente.',
            id_clase: classId
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al crear la clase.');
    } finally {
        await conexion.end();
    }
};

const agregarTarea = async (req, res) => {
    const { titulo, descripcion, fecha_entrega, id_clase } = req.body;

    // Validar campos obligatorios
    if (!titulo || !fecha_entrega || !id_clase) {
        return res.status(400).json({
            error: 'Los campos titulo, fecha_entrega e id_clase son obligatorios.',
        });
    }

    // Consultas SQL
    const queries = {
        checkClaseExists: `SELECT id_clase FROM clases WHERE id_clase = ?`,
        insertTarea: `INSERT INTO tareas (titulo, descripcion, fecha_entrega, fecha_asignacion, id_clase) VALUES (?, ?, ?, NOW(), ?)`,
        getAlumnosByClase: `SELECT ac.id_alumno FROM alumnos_clases ac WHERE ac.id_clase = ?`,
        insertTareaAlumno: `
            INSERT INTO tareas_alumnos (id_tarea, id_alumno, estado, calificacion, fecha_entrega, comentarios) 
            VALUES (?, ?, 'Pendiente', NULL, NULL, NULL)
        `,
    };

    const conexion = await cnx();

    try {
        // Verificar si la clase existe
        const claseExists = await executeQuery(conexion, queries.checkClaseExists, [id_clase]);
        if (!claseExists.length) {
            return res.status(404).json({
                error: 'La clase especificada no existe.',
            });
        }

        // Insertar la tarea
        const [tareaResult] = await conexion.execute(queries.insertTarea, [
            titulo,
            descripcion,
            fecha_entrega,
            id_clase,
        ]);
        const tareaId = tareaResult.insertId;

        // Obtener los alumnos de la clase
        const [alumnos] = await conexion.execute(queries.getAlumnosByClase, [id_clase]);
        if (!alumnos.length) {
            return res.status(404).json({
                error: 'No hay alumnos asociados a esta clase.',
            });
        }

        // Insertar datos en la tabla tareas_alumnos
        for (const alumno of alumnos) {
            await conexion.execute(queries.insertTareaAlumno, [tareaId, alumno.id_alumno]);
        }

        res.status(201).json({
            mensaje: 'Tarea añadida exitosamente y asignada a los alumnos.',
            id_tarea: tareaId,
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al añadir la tarea.');
    } finally {
        await conexion.end();
    }
};

const obtenerTareasPendientes = async (req, res) => {
    const { id_alumno } = req.params;

    // Validar el campo obligatorio
    if (!id_alumno) {
        return res.status(400).json({
            error: 'El campo id_alumno es obligatorio.',
        });
    }

    // Consultas SQL
    const queries = {
        checkAlumnoExists: `SELECT id_alumno FROM alumnos WHERE id_alumno = ?`,
        getTareasPendientes: `
            SELECT 
                t.id_tarea, 
                t.titulo, 
                t.descripcion, 
                t.fecha_asignacion, 
                t.fecha_entrega 
            FROM tareas t
            JOIN tareas_alumnos ta ON ta.id_tarea = t.id_tarea
            WHERE ta.id_alumno = ? AND ta.estado = 'Pendiente'
        `,
    };

    const conexion = await cnx();

    try {
        // Verificar si el alumno existe
        const alumnoExists = await executeQuery(conexion, queries.checkAlumnoExists, [id_alumno]);
        if (!alumnoExists.length) {
            return res.status(404).json({
                error: `El alumno con id ${id_alumno} no existe.`,
            });
        }

        // Obtener las tareas pendientes del alumno
        const [tareasPendientes] = await conexion.execute(queries.getTareasPendientes, [id_alumno]);

        if (!tareasPendientes.length) {
            return res.status(404).json({
                mensaje: 'No tienes tareas pendientes.',
            });
        }

        res.status(200).json({
            tareas: tareasPendientes.map((tarea) => ({
                id_tarea: tarea.id_tarea,
                titulo: tarea.titulo,
                descripcion: tarea.descripcion,
                fecha_asignacion: tarea.fecha_asignacion,
                fecha_entrega: tarea.fecha_entrega,
            })),
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al obtener las tareas pendientes del alumno.');
    } finally {
        await conexion.end();
    }
};

const actualizarEstadoYCalificacion = async (req, res) => {
    const { id_tarea, id_alumno, estado, calificacion } = req.body;

    // Validar campos obligatorios
    if (!id_tarea || !id_alumno || !estado) {
        return res.status(400).json({
            error: 'Los campos id_tarea, id_alumno y estado son obligatorios.',
        });
    }

    // Validar calificación si se proporciona
    if (calificacion && (typeof calificacion !== 'number' || calificacion < 0 || calificacion > 10)) {
        return res.status(400).json({
            error: 'La calificación debe ser un número entre 0 y 10.',
        });
    }

    // Consultas SQL
    const queries = {
        checkTareaAlumnoExists: `SELECT * FROM tareas_alumnos WHERE id_tarea = ? AND id_alumno = ?`,
        updateEstadoYCalificacion: `UPDATE tareas_alumnos SET estado = ?, calificacion = ? WHERE id_tarea = ? AND id_alumno = ?`,
    };

    const conexion = await cnx();

    try {
        // Verificar si la tarea del alumno existe
        const tareaAlumnoExists = await executeQuery(conexion, queries.checkTareaAlumnoExists, [id_tarea, id_alumno]);
        if (!tareaAlumnoExists.length) {
            return res.status(404).json({
                error: 'La tarea o el alumno especificado no existe.',
            });
        }

        // Actualizar estado y calificación de la tarea
        await conexion.execute(queries.updateEstadoYCalificacion, [
            estado,
            calificacion || null,  // Si no se pasa calificación, se mantiene como NULL
            id_tarea,
            id_alumno,
        ]);

        res.status(200).json({
            mensaje: 'Estado y calificación actualizados exitosamente.',
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al actualizar el estado y la calificación.');
    } finally {
        await conexion.end();
    }
};


const asociarAlumnosAClase = async (req, res) => {
    const { id_clase, alumnos } = req.body;

    // Validar campos obligatorios
    if (!id_clase || !alumnos || !Array.isArray(alumnos) || alumnos.length === 0) {
        return res.status(400).json({
            error: 'El campo id_clase y una lista de alumnos son obligatorios.',
        });
    }

    // Consultas SQL
    const queries = {
        checkClaseExists: `SELECT id_clase FROM clases WHERE id_clase = ?`,
        checkAlumnoExists: `SELECT id_alumno FROM alumnos WHERE id_alumno = ?`,
        insertAlumnoClase: `INSERT INTO alumnos_clases (id_alumno, id_clase) VALUES (?, ?)`,
    };

    const conexion = await cnx();

    try {
        // Verificar si la clase existe
        const claseExists = await executeQuery(conexion, queries.checkClaseExists, [id_clase]);
        if (!claseExists.length) {
            return res.status(404).json({
                error: 'La clase especificada no existe.',
            });
        }

        // Verificar y asociar cada alumno
        for (const id_alumno of alumnos) {
            // Verificar si el alumno existe
            const alumnoExists = await executeQuery(conexion, queries.checkAlumnoExists, [id_alumno]);
            if (!alumnoExists.length) {
                return res.status(404).json({
                    error: `El alumno con id ${id_alumno} no existe.`,
                });
            }

            // Asociar el alumno a la clase
            await conexion.execute(queries.insertAlumnoClase, [id_alumno, id_clase]);
        }

        res.status(201).json({
            mensaje: 'Alumnos asociados a la clase exitosamente.',
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al asociar alumnos a la clase.');
    } finally {
        await conexion.end();
    }
};

const ListClases = async (req, res) => {
    // Consultas SQL
    const queries = {
        // Obtener todas las clases junto con el nombre del profesor
        getClases: `
            SELECT 
                c.id_clase, 
                c.nombre_clase, 
                p.id_profesor, 
                CONCAT(u.nombre, ' ', u.apellido) AS profesor_nombre
            FROM clases c
            JOIN profesores p ON c.id_profesor = p.id_profesor
            JOIN usuarios u ON p.id_usuario = u.id_usuario
        `,
        // Obtener todas las tareas asignadas a una clase
        getTareasByClase: `
            SELECT 
                t.id_tarea, 
                t.titulo, 
                t.descripcion, 
                t.fecha_asignacion, 
                t.fecha_entrega 
            FROM tareas t
            WHERE t.id_clase = ?
        `,
    };

    const conexion = await cnx();

    try {
        // Obtener todas las clases
        const [clases] = await conexion.execute(queries.getClases);

        if (!clases.length) {
            return res.status(404).json({
                mensaje: 'No se encontraron clases.',
            });
        }

        // Iterar sobre las clases y obtener sus tareas
        const resultado = [];
        for (const clase of clases) {
            const [tareas] = await conexion.execute(queries.getTareasByClase, [clase.id_clase]);

            resultado.push({
                id_clase: clase.id_clase,
                nombre_clase: clase.nombre_clase,
                id_profesor: clase.id_profesor,
                profesor_nombre: clase.profesor_nombre,
                tareas: tareas.map((tarea) => ({
                    id_tarea: tarea.id_tarea,
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    fecha_asignacion: tarea.fecha_asignacion,
                    fecha_entrega: tarea.fecha_entrega,
                })),
            });
        }

        res.status(200).json(resultado);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las clases con sus tareas.');
    } finally {
        await conexion.end();
    }
};

const ListClasesByAlumno = async (req, res) => {
    const { id_alumno } = req.params;

    if (!id_alumno) {
        return res.status(400).json({ mensaje: 'Se requiere el ID del alumno.' });
    }

    const queries = {
        // Obtener las clases del alumno
        getClasesByAlumno: `
            SELECT 
                c.id_clase, 
                c.nombre_clase, 
                p.id_profesor, 
                CONCAT(u.nombre, ' ', u.apellido) AS profesor_nombre
            FROM alumnos_clases ac
            JOIN clases c ON ac.id_clase = c.id_clase
            JOIN profesores p ON c.id_profesor = p.id_profesor
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE ac.id_alumno = ?
        `,
        // Obtener las tareas de una clase
        getTareasByClase: `
            SELECT 
                t.id_tarea, 
                t.titulo, 
                t.descripcion, 
                t.fecha_asignacion, 
                t.fecha_entrega 
            FROM tareas t
            WHERE t.id_clase = ?
        `,
    };

    const conexion = await cnx();

    try {
        // Obtener las clases del alumno
        const [clases] = await conexion.execute(queries.getClasesByAlumno, [id_alumno]);

        if (!clases.length) {
            return res.status(404).json({ mensaje: 'El alumno no está inscrito en ninguna clase.' });
        }

        // Iterar sobre las clases y obtener sus tareas
        const resultado = [];
        for (const clase of clases) {
            const [tareas] = await conexion.execute(queries.getTareasByClase, [clase.id_clase]);

            resultado.push({
                id_clase: clase.id_clase,
                nombre_clase: clase.nombre_clase,
                id_profesor: clase.id_profesor,
                profesor_nombre: clase.profesor_nombre,
                tareas: tareas.map((tarea) => ({
                    id_tarea: tarea.id_tarea,
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    fecha_asignacion: tarea.fecha_asignacion,
                    fecha_entrega: tarea.fecha_entrega,
                })),
            });
        }

        res.status(200).json(resultado);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las clases del alumno.');
    } finally {
        await conexion.end();
    }
};

const ListClasesByProfesor = async (req, res) => {
    const { id_profesor } = req.params;

    if (!id_profesor) {
        return res.status(400).json({ mensaje: 'Se requiere el ID del profesor.' });
    }

    const queries = {
        // Obtener las clases asignadas al profesor
        getClasesByProfesor: `
            SELECT 
                c.id_clase, 
                c.nombre_clase, 
                CONCAT(u.nombre, ' ', u.apellido) AS profesor_nombre
            FROM clases c
            JOIN profesores p ON c.id_profesor = p.id_profesor
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.id_profesor = ?
        `,
        // Obtener tareas asignadas a una clase
        getTareasByClase: `
            SELECT 
                t.id_tarea, 
                t.titulo, 
                t.descripcion, 
                t.fecha_asignacion, 
                t.fecha_entrega 
            FROM tareas t
            WHERE t.id_clase = ?
        `,
    };

    const conexion = await cnx();

    try {
        // Obtener las clases asignadas al profesor
        const [clases] = await conexion.execute(queries.getClasesByProfesor, [id_profesor]);

        if (!clases.length) {
            return res.status(404).json({ mensaje: 'No se encontraron clases para este profesor.' });
        }

        // Iterar sobre las clases y obtener sus tareas
        const resultado = [];
        for (const clase of clases) {
            const [tareas] = await conexion.execute(queries.getTareasByClase, [clase.id_clase]);

            resultado.push({
                id_clase: clase.id_clase,
                nombre_clase: clase.nombre_clase,
                profesor_nombre: clase.profesor_nombre,
                tareas: tareas.map((tarea) => ({
                    id_tarea: tarea.id_tarea,
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    fecha_asignacion: tarea.fecha_asignacion,
                    fecha_entrega: tarea.fecha_entrega,
                })),
            });
        }

        res.status(200).json(resultado);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las clases del profesor.');
    } finally {
        await conexion.end();
    }
};

const DeleteClaseById = async (req, res) => {
    const { id_clase } = req.params;

    if (!id_clase) {
        return res.status(400).json({ mensaje: 'Se requiere el ID de la clase.' });
    }

    const queries = {
        deleteAsistenciasByClase: `
            DELETE asistencias
            FROM asistencias
            JOIN alumnos_clases ON asistencias.id_alumno_clase = alumnos_clases.id_alumno_clase
            WHERE alumnos_clases.id_clase = ?
        `,
        deleteTareasAlumnosByClase: `
            DELETE tareas_alumnos
            FROM tareas_alumnos
            JOIN tareas ON tareas_alumnos.id_tarea = tareas.id_tarea
            WHERE tareas.id_clase = ?
        `,
        deleteTareasByClase: `
            DELETE FROM tareas
            WHERE id_clase = ?
        `,
        deleteAlumnosClasesByClase: `
            DELETE FROM alumnos_clases
            WHERE id_clase = ?
        `,
        deleteClase: `
            DELETE FROM clases
            WHERE id_clase = ?
        `,
    };

    const conexion = await cnx();

    try {
        await conexion.beginTransaction();

        // Eliminar asistencias relacionadas con la clase
        await conexion.execute(queries.deleteAsistenciasByClase, [id_clase]);

        // Eliminar tareas de alumnos relacionadas con la clase
        await conexion.execute(queries.deleteTareasAlumnosByClase, [id_clase]);

        // Eliminar tareas relacionadas con la clase
        await conexion.execute(queries.deleteTareasByClase, [id_clase]);

        // Eliminar relaciones de alumnos con la clase
        await conexion.execute(queries.deleteAlumnosClasesByClase, [id_clase]);

        // Eliminar la clase
        const [result] = await conexion.execute(queries.deleteClase, [id_clase]);

        if (result.affectedRows === 0) {
            await conexion.rollback();
            return res.status(404).json({ mensaje: 'Clase no encontrada.' });
        }

        await conexion.commit();
        res.status(200).json({ mensaje: 'Clase eliminada correctamente.' });
    } catch (error) {
        await conexion.rollback();
        handleDatabaseError(error, res, 'Error al eliminar la clase.');
    } finally {
        await conexion.end();
    }
};


export default {crearClase, agregarTarea, asociarAlumnosAClase, ListClases, obtenerTareasPendientes, actualizarEstadoYCalificacion, ListClasesByAlumno, ListClasesByProfesor, DeleteClaseById };
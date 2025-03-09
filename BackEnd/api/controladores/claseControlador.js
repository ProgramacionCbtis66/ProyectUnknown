import cnx from './conexion.js';
import fs from 'fs';
import path from 'path';
import env from '../../enviroment/enviroment.js';

// Función para manejar errores de la base de datos
const handleDatabaseError = (error, res, message) => {
    console.error(error);
    res.status(500).json({ error: message });
};

// Función para ejecutar consultas SQL
const executeQuery = async (conexion, query, params) => {
    try {
        const [result] = await conexion.execute(query, params);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// Función para verificar si un registro existe en la base de datos
const checkRecordExists = async (conexion, table, field, value) => {
    const query = `SELECT ${field} FROM ${table} WHERE ${field} = ?`;
    const result = await executeQuery(conexion, query, [value]);
    return result.length > 0;
};

// Función para crear directorios si no existen
const createDirectoryIfNotExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// Crear una nueva clase
const crearClase = async (req, res) => {
    const { nombre_clase, id_profesor } = req.body;

    if (!nombre_clase || !id_profesor) {
        return res.status(400).json({ error: 'Los campos nombre_clase y id_profesor son obligatorios.' });
    }

    const queries = {
        checkProfesorExists: `SELECT id_profesor FROM profesores WHERE id_profesor = ?`,
        insertClase: `INSERT INTO clases (nombre_clase, id_profesor) VALUES (?, ?)`
    };

    const conexion = await cnx();

    try {
        const profesorExists = await checkRecordExists(conexion, 'profesores', 'id_profesor', id_profesor);
        if (!profesorExists) {
            return res.status(404).json({ error: 'El profesor especificado no existe.' });
        }

        const [classResult] = await conexion.execute(queries.insertClase, [nombre_clase, id_profesor]);
        const classId = classResult.insertId;

        const baseDirectory = path.join(env.dir, 'clases');
        const classDirectory = path.join(baseDirectory, nombre_clase);

        createDirectoryIfNotExists(baseDirectory);
        createDirectoryIfNotExists(classDirectory);

        res.status(201).json({
            mensaje: 'Clase creada exitosamente.',
            id_clase: classId,
            directorio: classDirectory
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al crear la clase.');
    } finally {
        await conexion.end();
    }
};

// Agregar una nueva tarea
const agregarTarea = async (req, res) => {
    const { titulo, descripcion, fecha_entrega, id_clase } = req.body;

    if (!titulo || !fecha_entrega || !id_clase) {
        return res.status(400).json({ error: 'Los campos titulo, fecha_entrega e id_clase son obligatorios.' });
    }

    const queries = {
        checkClaseExists: `SELECT id_clase FROM clases WHERE id_clase = ?`,
        insertTarea: `INSERT INTO tareas (titulo, descripcion, fecha_entrega, fecha_asignacion, id_clase) VALUES (?, ?, ?, NOW(), ?)`,
        getAlumnosByClase: `SELECT id_alumno FROM alumnos_clases WHERE id_clase = ?`,
        insertTareaAlumno: `INSERT INTO tareas_alumnos (id_tarea, id_alumno, estado, calificacion, fecha_entrega, comentarios) VALUES (?, ?, 'Pendiente', NULL, NULL, NULL)`
    };

    const conexion = await cnx();

    try {
        const claseExists = await checkRecordExists(conexion, 'clases', 'id_clase', id_clase);
        if (!claseExists) {
            return res.status(404).json({ error: 'La clase especificada no existe.' });
        }

        const [tareaResult] = await conexion.execute(queries.insertTarea, [titulo, descripcion, fecha_entrega, id_clase]);
        const tareaId = tareaResult.insertId;

        const [alumnos] = await conexion.execute(queries.getAlumnosByClase, [id_clase]);
        if (!alumnos.length) {
            return res.status(404).json({ error: 'No hay alumnos asociados a esta clase.' });
        }

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

// Obtener tareas pendientes de un alumno
const obtenerTareasPendientes = async (req, res) => {
    const { id_alumno } = req.params;

    if (!id_alumno) {
        return res.status(400).json({ error: 'El campo id_alumno es obligatorio.' });
    }

    const query = `
        SELECT 
            t.id_tarea, 
            t.titulo, 
            t.descripcion, 
            t.fecha_asignacion, 
            t.fecha_entrega 
        FROM tareas t
        JOIN tareas_alumnos ta ON ta.id_tarea = t.id_tarea
        WHERE ta.id_alumno = ? AND ta.estado = 'Pendiente'
    `;

    const conexion = await cnx();

    try {
        const alumnoExists = await checkRecordExists(conexion, 'alumnos', 'id_alumno', id_alumno);
        if (!alumnoExists) {
            return res.status(404).json({ error: `El alumno con id ${id_alumno} no existe.` });
        }

        const [tareasPendientes] = await conexion.execute(query, [id_alumno]);

        if (!tareasPendientes.length) {
            return res.status(404).json({ mensaje: 'No tienes tareas pendientes.' });
        }

        res.status(200).json({ tareas: tareasPendientes });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al obtener las tareas pendientes del alumno.');
    } finally {
        await conexion.end();
    }
};

// Actualizar estado y calificación de una tarea
const actualizarEstadoYCalificacion = async (req, res) => {
    const { id_tarea, id_alumno, estado, calificacion } = req.body;

    if (!id_tarea || !id_alumno || !estado) {
        return res.status(400).json({ error: 'Los campos id_tarea, id_alumno y estado son obligatorios.' });
    }

    if (calificacion && (typeof calificacion !== 'number' || calificacion < 0 || calificacion > 10)) {
        return res.status(400).json({ error: 'La calificación debe ser un número entre 0 y 10.' });
    }

    const query = `
        UPDATE tareas_alumnos 
        SET estado = ?, calificacion = ? 
        WHERE id_tarea = ? AND id_alumno = ?
    `;

    const conexion = await cnx();

    try {
        const tareaAlumnoExists = await checkRecordExists(conexion, 'tareas_alumnos', 'id_tarea', id_tarea);
        if (!tareaAlumnoExists) {
            return res.status(404).json({ error: 'La tarea o el alumno especificado no existe.' });
        }

        await conexion.execute(query, [estado, calificacion || null, id_tarea, id_alumno]);

        res.status(200).json({ mensaje: 'Estado y calificación actualizados exitosamente.' });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al actualizar el estado y la calificación.');
    } finally {
        await conexion.end();
    }
};

// Asociar alumnos a una clase
const asociarAlumnosAClase = async (req, res) => {
    const { id_clase, alumnos } = req.body;

    if (!id_clase || !alumnos || !Array.isArray(alumnos) || alumnos.length === 0) {
        return res.status(400).json({ error: 'El campo id_clase y una lista de alumnos son obligatorios.' });
    }

    const query = `INSERT INTO alumnos_clases (id_alumno, id_clase) VALUES (?, ?)`;

    const conexion = await cnx();

    try {
        const claseExists = await checkRecordExists(conexion, 'clases', 'id_clase', id_clase);
        if (!claseExists) {
            return res.status(404).json({ error: 'La clase especificada no existe.' });
        }

        for (const id_alumno of alumnos) {
            const alumnoExists = await checkRecordExists(conexion, 'alumnos', 'id_alumno', id_alumno);
            if (!alumnoExists) {
                return res.status(404).json({ error: `El alumno con id ${id_alumno} no existe.` });
            }

            await conexion.execute(query, [id_alumno, id_clase]);
        }

        res.status(201).json({ mensaje: 'Alumnos asociados a la clase exitosamente.' });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al asociar alumnos a la clase.');
    } finally {
        await conexion.end();
    }
};

// Listar todas las clases
const ListClases = async (req, res) => {
    const query = `
        SELECT 
            c.id_clase, 
            c.nombre_clase, 
            p.id_profesor, 
            CONCAT(u.nombre, ' ', u.apellido) AS profesor_nombre
        FROM clases c
        JOIN profesores p ON c.id_profesor = p.id_profesor
        JOIN usuarios u ON p.id_usuario = u.id_usuario
    `;

    const conexion = await cnx();

    try {
        const [clases] = await conexion.execute(query);

        if (!clases.length) {
            return res.status(404).json({ mensaje: 'No se encontraron clases.' });
        }

        res.status(200).json(clases);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las clases.');
    } finally {
        await conexion.end();
    }
};

// Listar clases por alumno
const ListClasesByAlumno = async (req, res) => {
    const { id_alumno } = req.params;

    if (!id_alumno) {
        return res.status(400).json({ mensaje: 'Se requiere el ID del alumno.' });
    }

    const query = `
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
    `;

    const conexion = await cnx();

    try {
        const [clases] = await conexion.execute(query, [id_alumno]);

        if (!clases.length) {
            return res.status(404).json({ mensaje: 'El alumno no está inscrito en ninguna clase.' });
        }

        res.status(200).json(clases);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las clases del alumno.');
    } finally {
        await conexion.end();
    }
};

// Listar clases por profesor
const ListClasesByProfesor = async (req, res) => {
    const { id_profesor } = req.params;

    if (!id_profesor) {
        return res.status(400).json({ mensaje: 'Se requiere el ID del profesor.' });
    }

    const query = `
        SELECT 
            c.id_clase, 
            c.nombre_clase, 
            CONCAT(u.nombre, ' ', u.apellido) AS profesor_nombre
        FROM clases c
        JOIN profesores p ON c.id_profesor = p.id_profesor
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        WHERE p.id_profesor = ?
    `;

    const conexion = await cnx();

    try {
        const [clases] = await conexion.execute(query, [id_profesor]);

        if (!clases.length) {
            return res.status(404).json({ mensaje: 'No se encontraron clases para este profesor.' });
        }

        res.status(200).json(clases);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las clases del profesor.');
    } finally {
        await conexion.end();
    }
};

// Eliminar una clase por ID
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

        await conexion.execute(queries.deleteAsistenciasByClase, [id_clase]);
        await conexion.execute(queries.deleteTareasAlumnosByClase, [id_clase]);
        await conexion.execute(queries.deleteTareasByClase, [id_clase]);
        await conexion.execute(queries.deleteAlumnosClasesByClase, [id_clase]);

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

// Obtener alumnos por clase
const obtenerAlumnosPorClase = async (req, res) => {
    const { id_clase } = req.params;

    if (!id_clase) {
        return res.status(400).json({ error: 'El campo id_clase es obligatorio.' });
    }

    const query = `
        SELECT 
            a.id_alumno, 
            a.numero_control, 
            a.grupo, 
            a.especialidad, 
            a.turno, 
            a.curp, 
            u.nombre, 
            u.apellido
        FROM alumnos_clases ac
        JOIN alumnos a ON ac.id_alumno = a.id_alumno
        JOIN usuarios u ON a.id_usuario = u.id_usuario
        WHERE ac.id_clase = ?;
    `;

    const conexion = await cnx();

    try {
        const [result] = await conexion.execute(query, [id_clase]);

        if (!result.length) {
            return res.status(404).json({ mensaje: 'No hay alumnos asociados a esta clase.' });
        }

        res.status(200).json({ alumnos: result });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al obtener los alumnos de la clase.');
    } finally {
        await conexion.end();
    }
};

// Registrar asistencia
const registrarAsistencia = async (req, res) => {
    const { id_clase, id_alumno, fecha, estado_asistencia } = req.body;

    if (!id_clase || !id_alumno || !fecha || !estado_asistencia) {
        return res.status(400).json({ error: 'Los campos id_clase, id_alumno, fecha y estado_asistencia son obligatorios.' });
    }

    const query = `
        INSERT INTO asistencias (id_alumno_clase, fecha, estado_asistencia) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE estado_asistencia = VALUES(estado_asistencia);
    `;

    const conexion = await cnx();

    try {
        const [result] = await conexion.execute('SELECT id_alumno_clase FROM alumnos_clases WHERE id_clase = ? AND id_alumno = ?', [id_clase, id_alumno]);

        if (!result.length) {
            return res.status(404).json({ error: 'El alumno no está asociado a la clase especificada.' });
        }

        const idAlumnoClase = result[0].id_alumno_clase;
        await conexion.execute(query, [idAlumnoClase, fecha, estado_asistencia]);

        res.status(201).json({ mensaje: 'Asistencia registrada correctamente.' });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al registrar la asistencia.');
    } finally {
        await conexion.end();
    }
};

// Calcular porcentaje de asistencias
const calcularPorcentajeAsistencias = async (req, res) => {
    const { id_alumno } = req.params;

    if (!id_alumno) {
        return res.status(400).json({ error: 'El campo id_alumno es obligatorio.' });
    }

    const queries = {
        getTotalAsistencias: `
            SELECT COUNT(*) AS total_dias
            FROM asistencias a
            JOIN alumnos_clases ac ON a.id_alumno_clase = ac.id_alumno_clase
            WHERE ac.id_alumno = ?;
        `,
        getAsistenciasAfirmativas: `
            SELECT COUNT(*) AS asistencias_afirmativas
            FROM asistencias a
            JOIN alumnos_clases ac ON a.id_alumno_clase = ac.id_alumno_clase
            WHERE ac.id_alumno = ? AND a.estado_asistencia = 'Asistió';
        `
    };

    const conexion = await cnx();

    try {
        const [totalResult] = await conexion.execute(queries.getTotalAsistencias, [id_alumno]);
        const totalDias = totalResult[0].total_dias;

        if (totalDias === 0) {
            return res.status(404).json({ mensaje: 'No hay registros de asistencias para este alumno.' });
        }

        const [afirmativasResult] = await conexion.execute(queries.getAsistenciasAfirmativas, [id_alumno]);
        const asistenciasAfirmativas = afirmativasResult[0].asistencias_afirmativas;

        const porcentajeAsistencias = ((asistenciasAfirmativas / totalDias) * 100).toFixed(2);

        res.status(200).json({
            total_dias: totalDias,
            asistencias_afirmativas: asistenciasAfirmativas,
            porcentaje_asistencias: porcentajeAsistencias
        });
    } catch (error) {
        handleDatabaseError(error, res, 'Error al calcular el porcentaje de asistencias.');
    } finally {
        await conexion.end();
    }
};

// Actualizar una clase
const editarClase = async (req, res) => {
    // 1. Tomar el id_clase de los parámetros de la ruta
    const { id_clase } = req.params;
  
    // 2. Tomar los datos de la clase del cuerpo (body) de la petición
    const { nombre_clase, id_profesor, modulo, componente } = req.body;
  
    // 3. Validar campos requeridos
    if (!nombre_clase || !id_profesor) {
      return res.status(400).json({ error: 'Los campos nombre_clase e id_profesor son obligatorios.' });
    }
  
    // 4. Preparar la consulta de actualización
    const query = `
      UPDATE clases
      SET nombre_clase = ?, 
          id_profesor = ?, 
          modulo = ?, 
          componente = ?
      WHERE id_clase = ?
    `;
  
    const conexion = await cnx();
  
    try {
      // 5. Ejecutar la consulta
      const [result] = await conexion.execute(query, [
        nombre_clase,
        id_profesor,
        modulo || null,
        componente || null,
        id_clase
      ]);
  
      // 6. Verificar si se actualizó alguna fila
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró la clase con ese ID.' });
      }
  
      res.status(200).json({ mensaje: 'Clase actualizada correctamente.' });
    } catch (error) {
      handleDatabaseError(error, res, 'Error al actualizar la clase.');
    } finally {
      await conexion.end();
    }
  };

  
// Listar tareas por clase para alumno
const ListTareasByClaseParaAlumno = async (req, res) => {
    const { id_clase, id_alumno } = req.params;

    if (!id_clase || !id_alumno) {
        return res.status(400).json({ mensaje: 'Se requieren el ID de la clase y el ID del alumno.' });
    }

    const query = `
        SELECT DISTINCT 
            t.id_tarea, 
            t.titulo, 
            t.descripcion, 
            t.fecha_asignacion, 
            t.fecha_entrega,
            COALESCE(ta.estado, 'Pendiente') AS estado
        FROM tareas t
        LEFT JOIN tareas_alumnos ta ON t.id_tarea = ta.id_tarea AND ta.id_alumno = ?
        WHERE t.id_clase = ?
    `;

    const conexion = await cnx();

    try {
        const [tareas] = await conexion.execute(query, [id_alumno, id_clase]);

        if (!tareas.length) {
            return res.status(404).json({ mensaje: 'No se encontraron tareas para la clase o el alumno proporcionados.' });
        }

        const resultado = tareas.map((tarea) => ({
            title: tarea.titulo,
            description: tarea.descripcion,
            deadline: formatDeadline(tarea.fecha_entrega),
            iconColor: determineIconColor(tarea.estado, tarea.fecha_entrega),
            isExpanded: false,
            estado: tarea.estado,
        }));

        res.status(200).json(resultado);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las tareas de la clase para el alumno.');
    } finally {
        await conexion.end();
    }
};

// Listar tareas por clase para profesor
const ListTareasByClaseParaProfesor = async (req, res) => {
    const { id_clase } = req.params;

    if (!id_clase) {
        return res.status(400).json({ mensaje: 'Se requiere el ID de la clase.' });
    }

    const query = `
        SELECT DISTINCT 
            t.id_tarea, 
            t.titulo, 
            t.descripcion, 
            t.fecha_asignacion, 
            t.fecha_entrega
        FROM tareas t
        WHERE t.id_clase = ?
    `;

    const conexion = await cnx();

    try {
        const [tareas] = await conexion.execute(query, [id_clase]);

        if (!tareas.length) {
            return res.status(404).json({ mensaje: 'No se encontraron tareas para la clase proporcionada.' });
        }

        const resultado = tareas.map((tarea) => ({
            id_task: tarea.id_tarea,
            title: tarea.titulo,
            description: tarea.descripcion,
            deadline: formatDeadline(tarea.fecha_entrega),
            iconColor: '#FFFFFF',
            isExpanded: false,
        }));

        res.status(200).json(resultado);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al cargar las tareas de la clase para el profesor.');
    } finally {
        await conexion.end();
    }
};

// Función para formatear la fecha límite
const formatDeadline = (fecha_entrega) => {
    const fechaActual = new Date();
    const fechaEntrega = new Date(fecha_entrega);
    const diferenciaTiempo = fechaActual - fechaEntrega;
    const dias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (dias === 0) {
        return 'Hoy';
    } else if (dias > 0) {
        return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    } else {
        return `En ${Math.abs(dias)} día${Math.abs(dias) > 1 ? 's' : ''}`;
    }
};

// Función para determinar el color del ícono
const determineIconColor = (estado, fecha_entrega) => {
    const fechaActual = new Date();
    const fechaEntrega = new Date(fecha_entrega);

    if (estado === 'Pendiente' && fechaActual > fechaEntrega) {
        return '#C1272D';
    }

    switch (estado) {
        case 'Pendiente':
            return '#FFFFFF';
        case 'Entregado':
            return '#0071BC';
        case 'Calificado':
            return '#0071BC';
        default:
            return '#FFFFFF';
    }
};

const obtenerDatosClase = async (req, res) => {
    const { id_clase } = req.params;

    if (!id_clase) {
        return res.status(400).json({ error: 'El campo id_clase es obligatorio.' });
    }

    const query = `
        SELECT 
            c.nombre_clase, 
            CONCAT(u.nombre, ' ', u.apellido) AS profesor_nombre
        FROM clases c
        JOIN profesores p ON c.id_profesor = p.id_profesor
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        WHERE c.id_clase = ?;
    `;

    const conexion = await cnx();

    try {
        // Obtener información de la clase y el profesor
        const [claseInfo] = await conexion.execute(query, [id_clase]);

        if (!claseInfo.length) {
            return res.status(404).json({ error: 'La clase especificada no existe.' });
        }

        // Construir el JSON con la estructura solicitada
        const resultado = {
            nombre_clase: claseInfo[0].nombre_clase,
            profesor: claseInfo[0].profesor_nombre
        };

        res.status(200).json(resultado);
    } catch (error) {
        handleDatabaseError(error, res, 'Error al obtener los datos de la clase.');
    } finally {
        await conexion.end();
    }
};

export default {
    crearClase,
    agregarTarea,
    asociarAlumnosAClase,
    ListClases,
    obtenerTareasPendientes,
    actualizarEstadoYCalificacion,
    ListClasesByAlumno,
    ListClasesByProfesor,
    DeleteClaseById,
    obtenerAlumnosPorClase,
    registrarAsistencia,
    calcularPorcentajeAsistencias,
    ListTareasByClaseParaProfesor,
    ListTareasByClaseParaAlumno,
    obtenerDatosClase,
    editarClase,
};
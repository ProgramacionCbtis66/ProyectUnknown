import db from '../../config/db.js'; // Ajusta la ruta a tu archivo de conexión a MySQL

/**
 * Obtener todos los profesores
 * Realiza un JOIN con usuarios para obtener datos completos.
 */
export const obtenerProfesores = (req, res) => {
  const query = `
    SELECT p.id_profesor,
           p.id_usuario,
           p.departamento,
           p.especialidad,
           p.telefono,
           u.correo_institucional,
           u.nombre,
           u.apellido,
           u.rol,
           u.foto
    FROM profesores p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.rol = 'Profesor';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener profesores:', err);
      return res.status(500).json({ error: 'Error al obtener profesores' });
    }
    return res.json(results);
  });
};

/**
 * Obtener un profesor por su ID (id_profesor)
 */
export const obtenerProfesorPorId = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.id_profesor,
           p.id_usuario,
           p.departamento,
           p.especialidad,
           p.telefono,
           u.correo_institucional,
           u.nombre,
           u.apellido,
           u.rol,
           u.foto
    FROM profesores p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    WHERE p.id_profesor = ?;
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el profesor:', err);
      return res.status(500).json({ error: 'Error al obtener el profesor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    return res.json(results[0]);
  });
};

/**
 * Crear un nuevo profesor
 * Asume que el usuario ya está creado en la tabla usuarios con rol = 'Profesor'
 * y pasas el id_usuario en el body. Si no es así, deberías crear el usuario primero.
 */
export const crearProfesor = (req, res) => {
  const { id_usuario, departamento, especialidad, telefono } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: 'id_usuario es requerido' });
  }

  const query = `
    INSERT INTO profesores (id_usuario, departamento, especialidad, telefono)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [id_usuario, departamento, especialidad, telefono], (err, result) => {
    if (err) {
      console.error('Error al crear el profesor:', err);
      return res.status(500).json({ error: 'Error al crear el profesor' });
    }
    return res.json({
      message: 'Profesor creado correctamente',
      id_profesor: result.insertId
    });
  });
};

/**
 * Actualizar un profesor por id_profesor
 */
export const actualizarProfesor = (req, res) => {
  const { id } = req.params;
  const { departamento, especialidad, telefono } = req.body;

  const query = `
    UPDATE profesores
    SET departamento = ?, especialidad = ?, telefono = ?
    WHERE id_profesor = ?
  `;
  db.query(query, [departamento, especialidad, telefono, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el profesor:', err);
      return res.status(500).json({ error: 'Error al actualizar el profesor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    return res.json({ message: 'Profesor actualizado correctamente' });
  });
};

/**
 * Eliminar un profesor por id_profesor
 */
export const eliminarProfesor = (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM profesores
    WHERE id_profesor = ?
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el profesor:', err);
      return res.status(500).json({ error: 'Error al eliminar el profesor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    return res.json({ message: 'Profesor eliminado correctamente' });
  });
};

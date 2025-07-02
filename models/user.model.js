const pool = require('../db/connection');


const create = async ({ nombre, correo, contraseña, rol }) => {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
    [nombre, correo, contraseña, rol]
  );
  return result;
};

const findByEmail = async (correo) => {
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE correo = ?',
    [correo]
  );
  return rows[0]; // solo uno
};

module.exports = {
  create,
  findByEmail
};

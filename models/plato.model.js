const pool = require('../db/connection');

const createPlato = async ({ nombre, descripcion, precio }) => {
  const [result] = await pool.execute(
    'INSERT INTO platos (nombre, descripcion, precio) VALUES (?, ?, ?)',
    [nombre, descripcion, precio]
  );
  return result;
};

const getAllPlatos = async () => {
  const [rows] = await pool.execute('SELECT * FROM platos');
  return rows;
};

const getPlatoById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM platos WHERE id = ?', [id]);
  return rows[0];
};

const updatePlato = async (id, { nombre, descripcion, precio }) => {
  const [result] = await pool.execute(
    'UPDATE platos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?',
    [nombre, descripcion, precio, id]
  );
  return result;
};

const deletePlato = async (id) => {
  const [result] = await pool.execute('DELETE FROM platos WHERE id = ?', [id]);
  return result;
};

module.exports = {
  createPlato,
  getAllPlatos,
  getPlatoById,
  updatePlato,
  deletePlato
};

const { executeQuery } = require('../db/connection');

const createPlato = async ({ nombre, descripcion, precio }) => {
  const query = `
    INSERT INTO platos (nombre, descripcion, precio) 
    OUTPUT INSERTED.id
    VALUES (@param0, @param1, @param2)
  `;
  
  const result = await executeQuery(query, [nombre, descripcion, precio]);
  return { insertId: result.recordset[0].id };
};

const getAllPlatos = async () => {
  const query = 'SELECT * FROM platos ORDER BY id DESC';
  const result = await executeQuery(query);
  return result.recordset;
};

const getPlatoById = async (id) => {
  const query = 'SELECT * FROM platos WHERE id = @param0';
  const result = await executeQuery(query, [id]);
  return result.recordset[0];
};

const updatePlato = async (id, { nombre, descripcion, precio }) => {
  const query = `
    UPDATE platos 
    SET nombre = @param0, descripcion = @param1, precio = @param2 
    WHERE id = @param3
  `;
  
  const result = await executeQuery(query, [nombre, descripcion, precio, id]);
  return result;
};

const deletePlato = async (id) => {
  const query = 'DELETE FROM platos WHERE id = @param0';
  const result = await executeQuery(query, [id]);
  return result;
};

module.exports = {
  createPlato,
  getAllPlatos,
  getPlatoById,
  updatePlato,
  deletePlato
};

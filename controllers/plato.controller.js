const Plato = require('../models/plato.model');

const create = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    // Validar campos obligatorios
    if (!nombre || !descripcion || precio === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const result = await Plato.createPlato({ nombre, descripcion, precio });
    res.status(201).json({ message: 'Plato creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plato', details: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const platos = await Plato.getAllPlatos();
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platos', details: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const plato = await Plato.getPlatoById(req.params.id);
    if (!plato) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }
    res.json(plato);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el plato', details: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !descripcion || precio === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const result = await Plato.updatePlato(req.params.id, { nombre, descripcion, precio });
    res.json({ message: 'Plato actualizado', result });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plato', details: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await Plato.deletePlato(req.params.id);
    res.json({ message: 'Plato eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el plato', details: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};

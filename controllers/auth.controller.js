const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


const register = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  try {
    const existingUser = await User.findByEmail(correo);
    if (existingUser) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await User.create({ nombre, correo, contraseña: hashedPassword, rol });

    res.status(201).json({ message: 'Usuario registrado correctamente', id: result.insertId });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findByEmail(correo);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
  );

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { register, login };

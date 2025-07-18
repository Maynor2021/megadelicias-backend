const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res) => {
  console.log('Body recibido:', req.body);
  const { nombreCompleto, usuario, correo, contraseña, rolID } = req.body;

  // Validación básica
  if (!nombreCompleto || !usuario || !correo || !contraseña || !rolID) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si el correo ya existe
    const existingUserByEmail = await User.findByEmail(correo);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    // Verificar si el nombre de usuario ya existe
    const existingUserByUsername = await User.findByUsername(usuario);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Nombre de usuario ya existe' });
    }

    console.log('Password recibido:', contraseña);
    if (!contraseña) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const result = await User.create({
      nombreCompleto,
      usuario,
      correo,
      passwordHash,
      rolID
    });

    res.status(201).json({ 
      message: 'Usuario registrado correctamente', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
const login = async (req, res) => {
  console.log('Body recibido:', req.body);
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findByEmail(correo);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.EmpleadoID, rol: user.RolID, nombre: user.NombreCompleto },
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

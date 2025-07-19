const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res) => {
  console.log('Body recibido:', req.body);
  
  const { nombreCompleto, usuario, correo, contraseña, rolID } = req.body;

  // Validación básica
  if (!nombreCompleto || !usuario || !correo || !contraseña || !rolID) {
    console.log('Validación falló. Valores:', { nombreCompleto, usuario, correo, contraseña, rolID });
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si el correo ya existe
    const existingUserByEmail = await User.findByEmail(correo);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    // Verificar si el nombre de usuario ya existe
    const existingUserByUsername = await User.findByUsuario(usuario);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Nombre de usuario ya existe' });
    }

    console.log('Password recibido:', contraseña);
    
    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(contraseña, 10);

    // Crear objeto para el usuario
    const userData = {
      nombreCompleto,
      usuario,
      correo,
      passwordHash,
      rolID
    };

    console.log('Objeto userData a enviar:', userData);

    // Crear usuario
    const result = await User.create(userData);

    res.status(201).json({ 
      message: 'Usuario registrado correctamente', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
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

    // Actualizar último acceso
    await User.updateLastAccess(user.EmpleadoID);

    const token = jwt.sign(
      { 
        id: user.EmpleadoID, 
        rol: user.RolID, 
        nombre: user.NombreCompleto,
        usuario: user.Usuario 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      message: 'Login exitoso', 
      token,
      user: {
        id: user.EmpleadoID,
        nombreCompleto: user.NombreCompleto,
        usuario: user.Usuario,
        correo: user.Correo,
        rol: user.NombreRol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await User.getRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};// Crear asiento contable manual
const crearAsiento = async (req, res) => {
  try {
    const { tipoAsiento, descripcion, detalles } = req.body;
    const empleadoID = req.user.id;
    
    // Validaciones
    if (!tipoAsiento || !descripcion || !detalles || detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }
    
    // Validar que el asiento esté balanceado
    const balanceado = contabilidadModel.validarBalanceAsiento(detalles);
    if (!balanceado) {
      return res.status(400).json({
        success: false,
        message: 'El asiento no está balanceado (Debe ≠ Haber)'
      });
    }
    
    const resultado = await contabilidadModel.crearAsientoContable({
      tipoAsiento,
      descripcion,
      empleadoID,
      detalles
    });
    
    res.status(201).json({
      success: true,
      message: 'Asiento contable creado exitosamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error al crear asiento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear asiento contable'
    });
  }
};

// Obtener asiento por ID
const getAsiento = async (req, res) => {
  try {
    const { id } = req.params;
    const asiento = await contabilidadModel.getAsientoById(parseInt(id));
    
    if (!asiento) {
      return res.status(404).json({
        success: false,
        message: 'Asiento no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: asiento
    });
  } catch (error) {
    console.error('Error al obtener asiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener asiento contable'
    });
  }
};

// Actualizar asiento
const actualizarAsiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, detalles } = req.body;
    
    // Validar balance si se actualizan detalles
    if (detalles && detalles.length > 0) {
      const balanceado = contabilidadModel.validarBalanceAsiento(detalles);
      if (!balanceado) {
        return res.status(400).json({
          success: false,
          message: 'El asiento no está balanceado (Debe ≠ Haber)'
        });
      }
    }
    
    await contabilidadModel.actualizarAsientoContable(parseInt(id), {
      descripcion,
      detalles
    });
    
    res.json({
      success: true,
      message: 'Asiento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar asiento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar asiento contable'
    });
  }
};

// Anular asiento
const anularAsiento = async (req, res) => {
  try {
    const { id } = req.params;
    
    await contabilidadModel.anularAsientoContable(parseInt(id));
    
    res.json({
      success: true,
      message: 'Asiento anulado exitosamente'
    });
  } catch (error) {
    console.error('Error al anular asiento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al anular asiento contable'
    });
  }
};

module.exports = { register, login, getRoles,crearAsiento,
  getAsiento,
  actualizarAsiento,
  anularAsiento };

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { login, register, getRoles } = require('../controllers/auth.controller');

// Ruta de login
router.post('/login', login);

// Ruta de registro
router.post('/register', register);

// Ruta para obtener roles
router.get('/roles', getRoles);

// Ruta de verificación de token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ valid: false });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.json({ valid: false });
  }
});

module.exports = router;

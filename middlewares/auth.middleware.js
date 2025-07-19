const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    // El token viene en formato "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      nombre: decoded.nombre,
      usuario: decoded.usuario
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = authMiddleware;

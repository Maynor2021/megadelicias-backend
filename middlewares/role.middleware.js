// Middleware para verificar roles específicos
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // El middleware de auth debe haberse ejecutado antes
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      // Si se pasan roles específicos, verificar que el usuario tenga uno de ellos
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(req.user.rol)) {
          return res.status(403).json({ 
            message: 'No tienes permisos para acceder a este recurso' 
          });
        }
      }

      next();
    } catch (error) {
      console.error('Error en middleware de roles:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
};

// Middleware específico para administradores
const adminOnly = checkRole([1]); // Asumiendo que RolID 1 es administrador

// Middleware para usuarios y administradores
const userOrAdmin = checkRole([1, 2]); // RolID 1=admin, 2=usuario

module.exports = {
  checkRole,
  adminOnly,
  userOrAdmin
};

const { executeQuery } = require('../db/connection');

const create = async ({ nombreCompleto, usuario, correo, passwordHash, rolID }) => {
  const query = `
    INSERT INTO Empleados (NombreCompleto, Usuario, Correo, PasswordHash, RolID) 
    OUTPUT INSERTED.EmpleadoID
    VALUES (@param0, @param1, @param2, @param3, @param4)
  `;
  
  const result = await executeQuery(query, [nombreCompleto, usuario, correo, passwordHash, rolID]);
  return { insertId: result.recordset[0].EmpleadoID };
};

const findByEmail = async (correo) => {
  const query = `
    SELECT 
      e.EmpleadoID,
      e.NombreCompleto,
      e.Usuario,
      e.Correo,
      e.PasswordHash,
      e.RolID,
      e.Activo,
      r.NombreRol
    FROM Empleados e
    INNER JOIN Roles r ON e.RolID = r.RolID
    WHERE e.Correo = @param0 AND e.Activo = 1
  `;
  
  const result = await executeQuery(query, [correo]);
  return result.recordset[0];
};

const findByUsuario = async (usuario) => {
  const query = `
    SELECT 
      e.EmpleadoID,
      e.NombreCompleto,
      e.Usuario,
      e.Correo,
      e.PasswordHash,
      e.RolID,
      e.Activo,
      r.NombreRol
    FROM Empleados e
    INNER JOIN Roles r ON e.RolID = r.RolID
    WHERE e.Usuario = @param0 AND e.Activo = 1
  `;
  
  const result = await executeQuery(query, [usuario]);
  return result.recordset[0];
};

const findById = async (id) => {
  const query = `
    SELECT 
      e.EmpleadoID,
      e.NombreCompleto,
      e.Usuario,
      e.Correo,
      e.PasswordHash,
      e.RolID,
      e.Activo,
      r.NombreRol
    FROM Empleados e
    INNER JOIN Roles r ON e.RolID = r.RolID
    WHERE e.EmpleadoID = @param0
  `;
  
  const result = await executeQuery(query, [id]);
  return result.recordset[0];
};

const updateLastAccess = async (empleadoID) => {
  const query = `
    UPDATE Empleados 
    SET FechaUltimoAcceso = GETDATE()
    WHERE EmpleadoID = @param0
  `;
  
  await executeQuery(query, [empleadoID]);
};

const getRoles = async () => {
  const query = `
    SELECT RolID, NombreRol, Descripcion 
    FROM Roles 
    WHERE Activo = 1
  `;
  
  const result = await executeQuery(query, []);
  return result.recordset;
};

module.exports = {
  create,
  findByEmail,
  findByUsuario,
  findById,
  updateLastAccess,
  getRoles
};
// config/database.js
const sql = require('mssql');

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'admin',
    server: process.env.DB_HOST || 'DESKTOP-G4U7372',
    database: process.env.DB_NAME || 'MegadeliciasDB',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true' || false,
        trustServerCertificate: process.env.DB_TRUST_CERT !== 'false'
    }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server exitosamente');
    return pool;
  })
  .catch(err => console.error('❌ Error en conexión SQL Server:', err));

const executeQuery = async (query, params = []) => {
  const pool = await poolPromise;
  const request = pool.request();

  // Agrega parámetros como @param0, @param1, etc.
  params.forEach((value, index) => {
    request.input(`param${index}`, value);
  });

  const result = await request.query(query);
  return result;
};

module.exports = {
  executeQuery
};

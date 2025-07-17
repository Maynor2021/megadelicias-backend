// config/database.js
const sql = require('mssql');

/*const config = {
    user:'mr',
    password: 'admin',
    server: 'DESKTOP-G4U7372',
    database: 'MegadeliciasDB',  // Importante: agregar la base de datos
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};*/
const config = {
    user: 'sa',
     password: 'admin',
      server: 'DESKTOP-G4U7372',
        database: 'MegadeliciasDB', 
      options: {
       encrypt: false,
        trustServerCertificate: true
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
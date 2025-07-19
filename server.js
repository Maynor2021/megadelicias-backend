const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar conexión a base de datos - AGREGAR ESTA LÍNEA
require('./db/connection');

// Inicializar app
const app = express();
console.log('Iniciando servidor...');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
const platoRoutes = require('./routes/plato.routes');
const contabilidadRoutes = require('./routes/contabilidad.routes');
//usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/platos', platoRoutes);
app.use('/api/contabilidad', contabilidadRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
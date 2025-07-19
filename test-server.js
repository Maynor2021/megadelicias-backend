// test-server.js
console.log('🚀 Iniciando prueba del servidor...');

// Simulamos la carga de los módulos para detectar errores
try {
  console.log('📁 Probando importación del middleware de auth...');
  const authMiddleware = require('./middlewares/auth.middleware');
  console.log('✅ Middleware de auth cargado correctamente');

  console.log('📁 Probando importación de rutas de contabilidad...');
  const contabilidadRoutes = require('./routes/contabilidad.routes');
  console.log('✅ Rutas de contabilidad cargadas correctamente');

  console.log('📁 Probando importación del controlador de contabilidad...');
  const contabilidadController = require('./controllers/contabilidad.controller');
  console.log('✅ Controlador de contabilidad cargado correctamente');

  console.log('📁 Probando importación del modelo de contabilidad...');
  const contabilidadModel = require('./models/contabilidad.model');
  console.log('✅ Modelo de contabilidad cargado correctamente');

  console.log('\n🎉 Todas las importaciones son exitosas. El servidor debería arrancar sin problemas.');

} catch (error) {
  console.error('❌ Error encontrado:', error.message);
  console.error('📍 Stack:', error.stack);
}

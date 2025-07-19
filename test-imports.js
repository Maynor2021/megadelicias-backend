// test-imports.js
console.log('🧪 Probando todas las importaciones...\n');

try {
  console.log('📦 1. Middleware de autenticación...');
  const authMiddleware = require('./middlewares/auth.middleware');
  console.log('✅ Auth middleware OK');

  console.log('📦 2. Modelo de contabilidad...');
  const contabilidadModel = require('./models/contabilidad.model');
  console.log('✅ Contabilidad model OK');

  console.log('📦 3. Controlador de contabilidad...');
  const contabilidadController = require('./controllers/contabilidad.controller');
  console.log('✅ Contabilidad controller OK');

  console.log('📦 4. Rutas de contabilidad...');
  const contabilidadRoutes = require('./routes/contabilidad.routes');
  console.log('✅ Contabilidad routes OK');

  console.log('📦 5. Rutas de auth...');
  const authRoutes = require('./routes/auth.routes');
  console.log('✅ Auth routes OK');

  console.log('\n🎉 ¡Todas las importaciones exitosas!');
  console.log('✅ El servidor debería arrancar sin problemas');

} catch (error) {
  console.error('❌ Error encontrado:', error.message);
  console.error('📍 Stack completo:', error.stack);
}

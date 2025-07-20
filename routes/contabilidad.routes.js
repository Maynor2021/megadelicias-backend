const express = require('express');
const router = express.Router();
const contabilidadController = require('../controllers/contabilidad.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
//router.use(authMiddleware);

// Períodos contables
router.get('/periodos', contabilidadController.getPeriodos);
router.get('/periodo-actual', contabilidadController.getPeriodoActual);

// Reportes contables
router.get('/libro-diario', contabilidadController.getLibroDiario);
router.get('/balance-sumas-saldos', contabilidadController.getBalanceSumasSaldos);
router.get('/estado-resultados', contabilidadController.getEstadoResultados);
router.get('/flujo-caja', contabilidadController.getFlujoCaja);
router.get('/analisis-rentabilidad', contabilidadController.getAnalisisRentabilidad);
// CRUD de asientos contables
router.post('/asientos', contabilidadController.crearAsiento);
router.get('/asientos/:id', contabilidadController.getAsiento);
router.put('/asientos/:id', contabilidadController.actualizarAsiento);
router.delete('/asientos/:id', contabilidadController.anularAsiento);

// Procesos contables
router.post('/cierre-mensual', contabilidadController.ejecutarCierreMensual);
router.get('/balance-general', contabilidadController.generarBalanceGeneral);
router.get('/libro-ventas', contabilidadController.generarLibroVentas);

// Catálogos
router.get('/cuentas', contabilidadController.getCuentasContables);

module.exports = router;
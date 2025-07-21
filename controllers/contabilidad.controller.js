const contabilidadModel = require('../models/contabilidad.model');

// Obtener períodos contables
const getPeriodos = async (req, res) => {
  try {
    const { estado } = req.query;
    const periodos = await contabilidadModel.getPeriodos(estado);
    
    res.json({
      success: true,
      data: periodos
    });
  } catch (error) {
    console.error('Error al obtener períodos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener períodos contables'
    });
  }
};

// Obtener período actual
const getPeriodoActual = async (req, res) => {
  try {
    const periodo = await contabilidadModel.getPeriodoActual();
    
    if (!periodo) {
      return res.status(404).json({
        success: false,
        message: 'No hay período contable abierto'
      });
    }
    
    res.json({
      success: true,
      data: periodo
    });
  } catch (error) {
    console.error('Error al obtener período actual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener período actual'
    });
  }
};

// Obtener libro diario
const getLibroDiario = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fechaInicio y fechaFin'
      });
    }
    
    const libroDiario = await contabilidadModel.getLibroDiario(fechaInicio, fechaFin);
    
    res.json({
      success: true,
      data: libroDiario
    });
  } catch (error) {
    console.error('Error al obtener libro diario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener libro diario'
    });
  }
};

// Obtener balance de sumas y saldos
const getBalanceSumasSaldos = async (req, res) => {
  try {
    const balance = await contabilidadModel.getBalanceSumasSaldos();
    
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    console.error('Error al obtener balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener balance de sumas y saldos'
    });
  }
};

// Obtener estado de resultados
const getEstadoResultados = async (req, res) => {
  try {
    const { año, mes } = req.query;
    
    if (!año || !mes) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren año y mes'
      });
    }
    
    const estadoResultados = await contabilidadModel.getEstadoResultados(
      parseInt(año), 
      parseInt(mes)
    );
    
    res.json({
      success: true,
      data: estadoResultados
    });
  } catch (error) {
    console.error('Error al obtener estado de resultados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado de resultados'
    });
  }
};

// Obtener flujo de caja
const getFlujoCaja = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fechaInicio y fechaFin'
      });
    }
    
    const flujoCaja = await contabilidadModel.getFlujoCaja(fechaInicio, fechaFin);
    
    res.json({
      success: true,
      data: flujoCaja
    });
  } catch (error) {
    console.error('Error al obtener flujo de caja:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener flujo de caja'
    });
  }
};

// Obtener análisis de rentabilidad
const getAnalisisRentabilidad = async (req, res) => {
  try {
    const { año } = req.query;
    const analisis = await contabilidadModel.getAnalisisRentabilidad(año ? parseInt(año) : null);
    
    res.json({
      success: true,
      data: analisis
    });
  } catch (error) {
    console.error('Error al obtener análisis:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener análisis de rentabilidad'
    });
  }
};

// ======== FUNCIONES FALTANTES PARA ASIENTOS CONTABLES ========

// Crear asiento contable
/*const crearAsiento = async (req, res) => {
  try {
    const asientoData = req.body;
     const empleadoID = req.user?.id || 1; // Del token JWT .e agrega usuario 1 como pruebas
    
    // Validación básica
    if (!asientoData.concepto || !asientoData.detalles || !Array.isArray(asientoData.detalles)) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren concepto y detalles del asiento'
      });
    }
    
    const asiento = await contabilidadModel.crearAsiento(asientoData, empleadoID);
    
    res.status(201).json({
      success: true,
      message: 'Asiento contable creado exitosamente',
      data: asiento
    });
  } catch (error) {
    console.error('Error al crear asiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear asiento contable'
    });
  }
};*/

const crearAsiento = async (req, res) => {
 
  try {
    const asientoData = req.body;
    const empleadoID = req.user?.id || 1; // Usuario desde token JWT, o 1 por defecto (pruebas)

    // Validación básica
    if (
      !asientoData.concepto ||
      !asientoData.detalles ||
      !Array.isArray(asientoData.detalles) ||
      asientoData.detalles.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren concepto y detalles válidos del asiento',
      });
    }

    // Si no se proporciona fecha, se usará dentro de la función como fecha actual
    const asiento = await contabilidadModel.crearAsiento(asientoData, empleadoID);

    res.status(201).json({
      success: true,
      message: 'Asiento contable creado exitosamente',
      data: asiento,
    });
  } catch (error) {
    console.error('Error al crear asiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear asiento contable',
    });
  }
};

// Obtener asiento por ID
const getAsiento = async (req, res) => {
  try {
    const { id } = req.params;
    const asiento = await contabilidadModel.getAsientoById(id);
    
    if (!asiento) {
      return res.status(404).json({
        success: false,
        message: 'Asiento no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: asiento
    });
  } catch (error) {
    console.error('Error al obtener asiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener asiento contable'
    });
  }
};

// Actualizar asiento contable
const actualizarAsiento = async (req, res) => {
  try {
    const { id } = req.params;
    const asientoData = req.body;
    const empleadoID = req.user.id;
    
    const asiento = await contabilidadModel.actualizarAsiento(id, asientoData, empleadoID);
    
    if (!asiento) {
      return res.status(404).json({
        success: false,
        message: 'Asiento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Asiento actualizado exitosamente',
      data: asiento
    });
  } catch (error) {
    console.error('Error al actualizar asiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar asiento contable'
    });
  }
};

// Anular asiento contable
const anularAsiento = async (req, res) => {
  try {
    const { id } = req.params;
    const empleadoID = req.user.id;
    
    const resultado = await contabilidadModel.anularAsiento(id, empleadoID);
    
    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: 'Asiento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Asiento anulado exitosamente'
    });
  } catch (error) {
    console.error('Error al anular asiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al anular asiento contable'
    });
  }
};

// ======== FIN FUNCIONES FALTANTES ========

// Ejecutar cierre mensual
const ejecutarCierreMensual = async (req, res) => {
  try {
    const { año, mes } = req.body;
    const empleadoID = req.user.id; // Del token JWT
    
    if (!año || !mes) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren año y mes'
      });
    }
    
    const resultado = await contabilidadModel.ejecutarCierreMensual(
      parseInt(año), 
      parseInt(mes), 
      empleadoID
    );
    
    res.json({
      success: true,
      message: 'Cierre mensual ejecutado exitosamente',
      data: resultado
    });
  } catch (error) {
    console.error('Error al ejecutar cierre:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al ejecutar cierre mensual'
    });
  }
};

// Generar balance general
const generarBalanceGeneral = async (req, res) => {
  try {
    const { fechaCorte } = req.query;
    const balance = await contabilidadModel.generarBalanceGeneral(fechaCorte || new Date());
    
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    console.error('Error al generar balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar balance general'
    });
  }
};

// Generar libro de ventas
const generarLibroVentas = async (req, res) => {
  try {
    const { año, mes } = req.query;
    
    if (!año || !mes) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren año y mes'
      });
    }
    
    const libroVentas = await contabilidadModel.generarLibroVentas(
      parseInt(año), 
      parseInt(mes)
    );
    
    res.json({
      success: true,
      data: libroVentas
    });
  } catch (error) {
    console.error('Error al generar libro de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar libro de ventas'
    });
  }
};

// Obtener cuentas contables
const getCuentasContables = async (req, res) => {
  try {
    const { tipo } = req.query;
    const cuentas = await contabilidadModel.getCuentasContables(tipo);
    
    res.json({
      success: true,
      data: cuentas
    });
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cuentas contables'
    });
  }
};

module.exports = {
  getPeriodos,
  getPeriodoActual,
  getLibroDiario,
  getBalanceSumasSaldos,
  getEstadoResultados,
  getFlujoCaja,
  getAnalisisRentabilidad,
  crearAsiento,        // ✅ AGREGADA
  getAsiento,          // ✅ AGREGADA
  actualizarAsiento,   // ✅ AGREGADA
  anularAsiento,       // ✅ AGREGADA
  ejecutarCierreMensual,
  generarBalanceGeneral,
  generarLibroVentas,
  getCuentasContables
};

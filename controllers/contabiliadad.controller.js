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
  ejecutarCierreMensual,
  generarBalanceGeneral,
  generarLibroVentas,
  getCuentasContables
};
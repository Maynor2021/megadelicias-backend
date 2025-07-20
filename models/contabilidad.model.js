const { executeQuery } = require('../db/connection');

// Obtener períodos contables
const getPeriodos = async (estado = null) => {
  let query = `
    SELECT 
      PeriodoID,
      Año,
      Mes,
      FechaInicio,
      FechaFin,
      Estado,
      FechaCierre,
      EmpleadoCierreID
    FROM PeriodosContables
  `;
  
  const params = [];
  if (estado) {
    query += ' WHERE Estado = @param0';
    params.push(estado);
  }
  
  query += ' ORDER BY Año DESC, Mes DESC';
  
  const result = await executeQuery(query, params);
  return result.recordset;
};

// Obtener período actual
const getPeriodoActual = async () => {
  const query = `
    SELECT TOP 1 * 
    FROM PeriodosContables 
    WHERE Estado = 'Abierto' 
    ORDER BY Año DESC, Mes DESC
  `;
  
  const result = await executeQuery(query, []);
  return result.recordset[0];
};

// Obtener libro diario
const getLibroDiario = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT * FROM V_LibroDiario
    WHERE FechaAsiento BETWEEN @param0 AND @param1
    ORDER BY FechaAsiento, NumeroAsiento
  `;
  
  const result = await executeQuery(query, [fechaInicio, fechaFin]);
  return result.recordset;
};

// Obtener balance de sumas y saldos
const getBalanceSumasSaldos = async () => {
  const query = `SELECT * FROM V_BalanceSumasSaldos`;
  const result = await executeQuery(query, []);
  return result.recordset;
};

// Obtener estado de resultados
const getEstadoResultados = async (año, mes) => {
  const query = `
    SELECT 
      ER.*,
      PC.FechaInicio,
      PC.FechaFin
    FROM V_EstadoResultados ER
    CROSS JOIN PeriodosContables PC
    WHERE PC.Año = @param0 AND PC.Mes = @param1
  `;
  
  const result = await executeQuery(query, [año, mes]);
  return result.recordset;
};

// Obtener flujo de caja
const getFlujoCaja = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT * FROM V_FlujoCajaDiario
    WHERE Fecha BETWEEN @param0 AND @param1
    ORDER BY Fecha
  `;
  
  const result = await executeQuery(query, [fechaInicio, fechaFin]);
  return result.recordset;
};

// Obtener análisis de rentabilidad
const getAnalisisRentabilidad = async (año = null) => {
  let query = `SELECT * FROM V_AnalisisRentabilidad`;
  const params = [];
  
  if (año) {
    query += ' WHERE Año = @param0';
    params.push(año);
  }
  
  query += ' ORDER BY Año DESC, Mes DESC';
  
  const result = await executeQuery(query, params);
  return result.recordset;
};

// Ejecutar cierre mensual
const ejecutarCierreMensual = async (año, mes, empleadoID) => {
  const query = `EXEC SP_CierreMensualContable @param0, @param1, @param2`;
  const result = await executeQuery(query, [año, mes, empleadoID]);
  return result.recordset[0];
};

// Generar balance general
const generarBalanceGeneral = async (fechaCorte) => {
  const query = `EXEC SP_GenerarBalanceGeneral @param0`;
  const result = await executeQuery(query, [fechaCorte]);
  return result.recordset;
};

// Generar libro de ventas
const generarLibroVentas = async (año, mes) => {
  const query = `EXEC SP_GenerarLibroVentas @param0, @param1`;
  const result = await executeQuery(query, [año, mes]);
  return {
    detalle: result.recordsets[0],
    resumen: result.recordsets[1][0]
  };
};

// Obtener cuentas contables
const getCuentasContables = async (tipo = null) => {
  let query = `
    SELECT 
      CuentaID,
      CodigoCuenta,
      NombreCuenta,
      TipoCuenta,
      Naturaleza,
      Nivel,
      PermiteMovimientos,
      Activo
    FROM CuentasContables
    WHERE Activo = 1
  `;
  
  const params = [];
  if (tipo) {
    query += ' AND TipoCuenta = @param0';
    params.push(tipo);
  }
  
  query += ' ORDER BY CodigoCuenta';
  
  const result = await executeQuery(query, params);
  return result.recordset;
};

// ===== FUNCIONES PARA ASIENTOS CONTABLES =====

// Crear asiento contable
const crearAsiento = async (asientoData, empleadoID) => {
  const { concepto, detalles } = asientoData;
  
  // Validar que el asiento esté balanceado
  if (!validarBalanceAsiento(detalles)) {
    throw new Error('El asiento no está balanceado (Debe ≠ Haber)');
  }
  
  // Obtener período actual
  const periodoQuery = `
    SELECT TOP 1 PeriodoID 
    FROM PeriodosContables 
    WHERE GETDATE() BETWEEN FechaInicio AND FechaFin 
    AND Estado = 'Abierto'
  `;
  const periodoResult = await executeQuery(periodoQuery, []);
  
  if (!periodoResult.recordset[0]) {
    throw new Error('No hay período contable abierto');
  }
  
  const periodoID = periodoResult.recordset[0].PeriodoID;
  
  // Generar número de asiento
  const numeroAsiento = `MANUAL-${new Date().getTime()}`;
  
  // Insertar asiento
  const asientoQuery = `
    INSERT INTO AsientosContables 
    (NumeroAsiento, FechaAsiento, TipoAsiento, Descripcion, EmpleadoID, PeriodoID)
    OUTPUT INSERTED.AsientoID
    VALUES (@param0, GETDATE(), @param1, @param2, @param3, @param4)
  `;
  
  const asientoResult = await executeQuery(asientoQuery, [
    numeroAsiento, 'Manual', concepto, empleadoID, periodoID
  ]);
  
  const asientoID = asientoResult.recordset[0].AsientoID;
  
  // Insertar detalles
  for (const detalle of detalles) {
    const detalleQuery = `
      INSERT INTO DetalleAsientosContables 
      (AsientoID, CuentaID, Debe, Haber, Descripcion)
      VALUES (@param0, @param1, @param2, @param3, @param4)
    `;
    
    await executeQuery(detalleQuery, [
      asientoID,
      detalle.cuentaID,
      detalle.debe || 0,
      detalle.haber || 0,
      detalle.descripcion || ''
    ]);
  }
  
  return { asientoID, numeroAsiento };
};

// Obtener asiento contable por ID
const getAsientoById = async (asientoID) => {
  // Cabecera del asiento
  const asientoQuery = `
    SELECT 
      A.*,
      E.NombreCompleto as EmpleadoNombre,
      P.Año,
      P.Mes
    FROM AsientosContables A
    INNER JOIN Empleados E ON A.EmpleadoID = E.EmpleadoID
    INNER JOIN PeriodosContables P ON A.PeriodoID = P.PeriodoID
    WHERE A.AsientoID = @param0
  `;
  
  const asientoResult = await executeQuery(asientoQuery, [asientoID]);
  
  if (!asientoResult.recordset[0]) {
    return null;
  }
  
  // Detalles del asiento
  const detalleQuery = `
    SELECT 
      D.*,
      C.CodigoCuenta,
      C.NombreCuenta
    FROM DetalleAsientosContables D
    INNER JOIN CuentasContables C ON D.CuentaID = C.CuentaID
    WHERE D.AsientoID = @param0
  `;
  
  const detalleResult = await executeQuery(detalleQuery, [asientoID]);
  
  return {
    ...asientoResult.recordset[0],
    detalles: detalleResult.recordset
  };
};

// Actualizar asiento contable
const actualizarAsiento = async (asientoID, datos, empleadoID) => {
  const { concepto, detalles } = datos;
  
  // Verificar que el asiento existe y no está en un período cerrado
  const verificarQuery = `
    SELECT A.*, P.Estado 
    FROM AsientosContables A
    INNER JOIN PeriodosContables P ON A.PeriodoID = P.PeriodoID
    WHERE A.AsientoID = @param0
  `;
  
  const verificarResult = await executeQuery(verificarQuery, [asientoID]);
  
  if (!verificarResult.recordset[0]) {
    return null;
  }
  
  if (verificarResult.recordset[0].Estado === 'Cerrado') {
    throw new Error('No se puede modificar un asiento de un período cerrado');
  }
  
  // Actualizar descripción si se proporciona
  if (concepto) {
    const updateQuery = `
      UPDATE AsientosContables 
      SET Descripcion = @param0 
      WHERE AsientoID = @param1
    `;
    await executeQuery(updateQuery, [concepto, asientoID]);
  }
  
  // Si se proporcionan nuevos detalles, validar balanceo y actualizar
  if (detalles && detalles.length > 0) {
    if (!validarBalanceAsiento(detalles)) {
      throw new Error('El asiento no está balanceado (Debe ≠ Haber)');
    }
    
    // Eliminar detalles anteriores
    await executeQuery('DELETE FROM DetalleAsientosContables WHERE AsientoID = @param0', [asientoID]);
    
    // Insertar nuevos detalles
    for (const detalle of detalles) {
      const detalleQuery = `
        INSERT INTO DetalleAsientosContables 
        (AsientoID, CuentaID, Debe, Haber, Descripcion)
        VALUES (@param0, @param1, @param2, @param3, @param4)
      `;
      
      await executeQuery(detalleQuery, [
        asientoID,
        detalle.cuentaID,
        detalle.debe || 0,
        detalle.haber || 0,
        detalle.descripcion || ''
      ]);
    }
  }
  
  return { success: true };
};

// Anular asiento contable
const anularAsiento = async (asientoID, empleadoID) => {
  // Verificar que el asiento existe y no está en un período cerrado
  const verificarQuery = `
    SELECT A.*, P.Estado 
    FROM AsientosContables A
    INNER JOIN PeriodosContables P ON A.PeriodoID = P.PeriodoID
    WHERE A.AsientoID = @param0
  `;
  
  const verificarResult = await executeQuery(verificarQuery, [asientoID]);
  
  if (!verificarResult.recordset[0]) {
    return null;
  }
  
  if (verificarResult.recordset[0].Estado === 'Cerrado') {
    throw new Error('No se puede anular un asiento de un período cerrado');
  }
  
  // Anular el asiento
  const anularQuery = `
    UPDATE AsientosContables 
    SET Estado = 'Anulado' 
    WHERE AsientoID = @param0
  `;
  
  await executeQuery(anularQuery, [asientoID]);
  
  return { success: true };
};

// Validar que un asiento esté balanceado
const validarBalanceAsiento = (detalles) => {
  const totalDebe = detalles.reduce((sum, d) => sum + (parseFloat(d.debe) || 0), 0);
  const totalHaber = detalles.reduce((sum, d) => sum + (parseFloat(d.haber) || 0), 0);
  
  return Math.abs(totalDebe - totalHaber) < 0.01; // Permitir diferencia de centavos
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
  getCuentasContables,
  crearAsiento,              //  Renombrado de crearAsientoContable
  getAsientoById,
  actualizarAsiento,         //  Renombrado de actualizarAsientoContable  
  anularAsiento,             // Renombrado de anularAsientoContable
  validarBalanceAsiento
};

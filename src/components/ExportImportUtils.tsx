
interface ExportData {
  recibos?: any[];
  cuentasPorCobrar?: any[];
  cuentasPorPagar?: any[];
  tareas?: any[];
  tasaCambio?: any;
}

export const exportToWord = (data: ExportData, filename: string) => {
  const content = `
JH CONTROL - REPORTE DE DATOS
==============================

Fecha de generación: ${new Date().toLocaleDateString('es-ES')}

RESUMEN:
--------
- Recibos: ${data.recibos?.length || 0}
- Cuentas por Cobrar: ${data.cuentasPorCobrar?.length || 0}
- Cuentas por Pagar: ${data.cuentasPorPagar?.length || 0}
- Tareas: ${data.tareas?.length || 0}

DATOS DETALLADOS:
================

${data.recibos ? `
RECIBOS:
${data.recibos.map(r => `
- N° ${r.numeroPedido}
  Cliente: ${r.cliente?.nombre}
  Monto: ${r.monto} ${r.tipoMoneda}
  Estado: ${r.estado}
  Fecha: ${r.fechaEmision}
`).join('')}
` : ''}

${data.cuentasPorCobrar ? `
CUENTAS POR COBRAR:
${data.cuentasPorCobrar.map(c => `
- Cliente: ${c.cliente}
  Concepto: ${c.concepto}
  Monto: ${c.monto} ${c.tipoMoneda}
  Vencimiento: ${c.fechaVencimiento}
  Estado: ${c.estado}
`).join('')}
` : ''}

${data.cuentasPorPagar ? `
CUENTAS POR PAGAR:
${data.cuentasPorPagar.map(c => `
- Proveedor: ${c.proveedor}
  Concepto: ${c.concepto}
  Monto: ${c.monto} ${c.tipoMoneda}
  Fecha: ${c.fechaCreacion}
  Estado: ${c.estado}
`).join('')}
` : ''}

${data.tareas ? `
TAREAS:
${data.tareas.map(t => `
- Título: ${t.titulo}
  Descripción: ${t.descripcion}
  Estado: ${t.estado}
  Prioridad: ${t.prioridad}
  Fecha: ${t.fechaCreacion}
`).join('')}
` : ''}

---
Generado por JH Control - Sistema de Gestión Empresarial
  `;

  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (data: ExportData, filename: string) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Header
  csvContent += "JH CONTROL - REPORTE DE DATOS\n";
  csvContent += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n\n`;

  // Recibos
  if (data.recibos && data.recibos.length > 0) {
    csvContent += "RECIBOS\n";
    csvContent += "Numero,Cliente,Monto,Moneda,Estado,Fecha\n";
    data.recibos.forEach(r => {
      csvContent += `${r.numeroPedido},${r.cliente?.nombre},${r.monto},${r.tipoMoneda},${r.estado},${r.fechaEmision}\n`;
    });
    csvContent += "\n";
  }

  // Cuentas por Cobrar
  if (data.cuentasPorCobrar && data.cuentasPorCobrar.length > 0) {
    csvContent += "CUENTAS POR COBRAR\n";
    csvContent += "Cliente,Concepto,Monto,Moneda,Vencimiento,Estado\n";
    data.cuentasPorCobrar.forEach(c => {
      csvContent += `${c.cliente},${c.concepto},${c.monto},${c.tipoMoneda},${c.fechaVencimiento},${c.estado}\n`;
    });
    csvContent += "\n";
  }

  // Cuentas por Pagar
  if (data.cuentasPorPagar && data.cuentasPorPagar.length > 0) {
    csvContent += "CUENTAS POR PAGAR\n";
    csvContent += "Proveedor,Concepto,Monto,Moneda,Fecha,Estado\n";
    data.cuentasPorPagar.forEach(c => {
      csvContent += `${c.proveedor},${c.concepto},${c.monto},${c.tipoMoneda},${c.fechaCreacion},${c.estado}\n`;
    });
    csvContent += "\n";
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  link.click();
};

export const exportToTxt = (data: ExportData, filename: string) => {
  const content = `
JH CONTROL - REPORTE DE DATOS
==============================

Fecha de generación: ${new Date().toLocaleDateString('es-ES')}

RESUMEN:
--------
- Recibos: ${data.recibos?.length || 0}
- Cuentas por Cobrar: ${data.cuentasPorCobrar?.length || 0}
- Cuentas por Pagar: ${data.cuentasPorPagar?.length || 0}
- Tareas: ${data.tareas?.length || 0}

DATOS DETALLADOS:
================

${data.recibos ? `
RECIBOS:
${data.recibos.map(r => `
- N° ${r.numeroPedido}
  Cliente: ${r.cliente?.nombre}
  Monto: ${r.monto} ${r.tipoMoneda}
  Estado: ${r.estado}
  Fecha: ${r.fechaEmision}
`).join('')}
` : ''}

${data.cuentasPorCobrar ? `
CUENTAS POR COBRAR:
${data.cuentasPorCobrar.map(c => `
- Cliente: ${c.cliente}
  Concepto: ${c.concepto}
  Monto: ${c.monto} ${c.tipoMoneda}
  Vencimiento: ${c.fechaVencimiento}
  Estado: ${c.estado}
`).join('')}
` : ''}

${data.cuentasPorPagar ? `
CUENTAS POR PAGAR:
${data.cuentasPorPagar.map(c => `
- Proveedor: ${c.proveedor}
  Concepto: ${c.concepto}
  Monto: ${c.monto} ${c.tipoMoneda}
  Fecha: ${c.fechaCreacion}
  Estado: ${c.estado}
`).join('')}
` : ''}

${data.tareas ? `
TAREAS:
${data.tareas.map(t => `
- Título: ${t.titulo}
  Descripción: ${t.descripcion}
  Estado: ${t.estado}
  Prioridad: ${t.prioridad}
  Fecha: ${t.fechaCreacion}
`).join('')}
` : ''}

---
Generado por JH Control - Sistema de Gestión Empresarial
  `;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          resolve(data);
        } else if (file.name.endsWith('.csv')) {
          // Procesar CSV básico
          const lines = content.split('\n');
          const result = {
            message: `Archivo CSV procesado con ${lines.length} líneas`,
            data: lines
          };
          resolve(result);
        } else {
          // Archivo de texto
          const result = {
            message: `Archivo de texto procesado`,
            content: content
          };
          resolve(result);
        }
      } catch (error) {
        reject(new Error('Error al procesar el archivo'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
};

import React, { useState } from 'react';
import type { SolicitudPermiso } from '../types';

interface Props {
  permisos: SolicitudPermiso[];
}

export const ResumenMensual: React.FC<Props> = ({ permisos }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(
    new Date().toISOString().slice(0, 7) // Formato "YYYY-MM"
  );
  const [busquedaFuncionario, setBusquedaFuncionario] = useState<string>('');

  // Función matemática inteligente mejorada para leer cantidadHoras y calcular 8.5h por día
  const calcularHorasPermiso = (p: any): number => {
    // 1. Revisar si viene en el campo principal 'cantidadHoras' (ej. "2 hrs", "1 día(s)")
    const textoCantidad = (p.cantidadHoras || p.totalHoras || p.horas || '').toString().toLowerCase();

    if (textoCantidad) {
      if (textoCantidad.includes('días') || textoCantidad.includes('dia') || textoCantidad.includes('día')) {
        const diasNum = parseFloat(textoCantidad.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        return diasNum * 8.5;
      } else if (textoCantidad.includes('hrs') || texto.includes('hr')) {
        const horasNum = parseFloat(textoCantidad.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        return horasNum;
      } else {
        // Si es un número plano guardado como string o número
        const numPlano = parseFloat(textoCantidad.replace(',', '.')) || 0;
        if (numPlano > 0) return numPlano;
      }
    }

    // 2. Compatibilidad con estructuras basadas en días numéricos directos
    if (p.tipoTiempo === 'Dias' && p.dias) {
      return Number(p.dias) * 8.5;
    }

    // 3. Compatibilidad con horas de salida y llegada si aplica
    if (p.horaSalida && p.horaLlegada) {
      try {
        const [hSalida, mSalida] = p.horaSalida.split(':').map(Number);
        const [hLlegada, mLlegada] = p.horaLlegada.split(':').map(Number);
        
        const minutosSalida = hSalida * 60 + mSalida;
        const minutosLlegada = hLlegada * 60 + mLlegada;
        
        const diferenciaMinutos = minutosLlegada - minutosSalida;
        if (diferenciaMinutos > 0) {
          return Number((diferenciaMinutos / 60).toFixed(1));
        }
      } catch (e) {
        // Ignorar error de formato
      }
    }

    if (p.dias) {
      return Number(p.dias) * 8.5;
    }

    return 0;
  };

  // 1. Filtrar solicitudes según el mes
  const permisosDelMes = permisos.filter((p: any) => {
    const fecha = p.fechaSolicitud || p.fechaInicio || p.fecha || '';
    return fecha.toString().includes(mesSeleccionado);
  });

  // 2. Filtrar por texto de búsqueda en el nombre
  const permisosFiltrados = permisosDelMes.filter((p: any) => {
    const nombre = p.nombreTrabajador || p.nombreFuncionario || p.nombre || '';
    return nombre.toLowerCase().includes(busquedaFuncionario.toLowerCase());
  });

  // 3. Agrupar y sumar horas por funcionario
  const resumenPorPersona = permisosFiltrados.reduce((acc, permiso: any) => {
    const nombre = permiso.nombreTrabajador || permiso.nombreFuncionario || permiso.nombre || 'Sin nombre';
    const rut = permiso.rut || 'N/A';
    const horas = calcularHorasPermiso(permiso);

    if (!acc[nombre]) {
      acc[nombre] = {
        nombre,
        rut,
        cantidadPermisos: 0,
        totalHoras: 0,
      };
    }
    acc[nombre].cantidadPermisos += 1;
    acc[nombre].totalHoras += horas;
    return acc;
  }, {} as Record<string, { nombre: string; rut: string; cantidadPermisos: number; totalHoras: number }>);

  const datosResumen = Object.values(resumenPorPersona);

  // 4. KPIs del mes
  const totalPermisosMes = permisosDelMes.length;
  const sumaGlobalHoras = permisosDelMes.reduce((sum, p: any) => sum + calcularHorasPermiso(p), 0);
  const funcionarioConMasHoras = datosResumen.reduce((max, curr) => 
    curr.totalHoras > (max?.totalHoras || 0) ? curr : max, datosResumen[0]
  );

  // 5. Exportar a Excel (CSV)
  const exportarAExcel = () => {
    if (datosResumen.length === 0) {
      alert('No hay datos para exportar en este mes.');
      return;
    }

    const headers = ['Funcionario', 'RUT', 'Total Permisos', 'Total Horas (hrs)'];
    const rows = datosResumen.map(d => [
      `"${d.nombre}"`,
      `"${d.rut}"`,
      d.cantidadPermisos,
      d.totalHoras
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `resumen_permisos_${mesSeleccionado}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas / KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E6E0D5]">
          <p className="text-sm font-medium text-[#795548]">Total Permisos del Mes</p>
          <p className="text-2xl font-bold text-[#8B5A2B] mt-1">{totalPermisosMes}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E6E0D5]">
          <p className="text-sm font-medium text-[#795548]">Suma Global de Horas</p>
          <p className="text-2xl font-bold text-[#2C241D] mt-1">{sumaGlobalHoras.toFixed(1)} hrs</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E6E0D5]">
          <p className="text-sm font-medium text-[#795548]">Funcionario con más horas</p>
          {/* Se cambió text-lg por text-sm (o text-xs si el nombre es extremadamente largo) para que calce perfecto */}
          <p className="text-sm font-bold text-[#2C241D] mt-1 break-words leading-tight" title={funcionarioConMasHoras ? funcionarioConMasHoras.nombre : 'Ninguno'}>
            {funcionarioConMasHoras ? `${funcionarioConMasHoras.nombre} (${funcionarioConMasHoras.totalHoras.toFixed(1)}h)` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Controles de Filtro y Exportación */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-[#E6E0D5] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div>
            <label className="block text-xs font-semibold text-[#795548] uppercase mb-1">Seleccionar Mes</label>
            <input 
              type="month" 
              value={mesSeleccionado} 
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] bg-[#FDFBF7]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#795548] uppercase mb-1">Filtrar Funcionario</label>
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              value={busquedaFuncionario}
              onChange={(e) => setBusquedaFuncionario(e.target.value)}
              className="border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] w-full sm:w-60 bg-[#FDFBF7]"
            />
          </div>
        </div>

        <button
          onClick={exportarAExcel}
          className="w-full md:w-auto bg-[#6B8E23] hover:bg-[#556B2F] text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
        >
          📊 Exportar a Excel (CSV)
        </button>
      </div>

      {/* Tabla Dinámica Agrupada con Encabezado Fijo */}
      <div className="bg-white rounded-xl shadow-md border border-[#E6E0D5] overflow-hidden">
        <div className="p-4 bg-[#F5F2EB] border-b border-[#E6E0D5]">
          <h3 className="font-bold text-[#5C4033]">Acumulado por Trabajador - Periodo {mesSeleccionado} (1 día = 8.5 hrs)</h3>
        </div>
        <div className="max-h-[450px] overflow-y-auto">
          <table className="min-w-full divide-y divide-[#E6E0D5]">
            <thead className="bg-[#EBE5D8] sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-[#5C4033] uppercase">Funcionario</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-[#5C4033] uppercase">RUT</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-[#5C4033] uppercase">Total Permisos</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-[#5C4033] uppercase">Suma Total (Hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D5] text-sm text-[#2C241D]">
              {datosResumen.length > 0 ? (
                datosResumen.map((item, index) => (
                  <tr key={index} className="hover:bg-[#FDFBF7]">
                    <td className="py-3 px-4 font-medium">{item.nombre}</td>
                    <td className="py-3 px-4 text-[#795548]">{item.rut}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-[#EBE5D8] text-[#5C4033] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {item.cantidadPermisos}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#8B5A2B]">{item.totalHoras.toFixed(1)} hrs</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#795548]">
                    No se encontraron registros para este mes ({mesSeleccionado}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
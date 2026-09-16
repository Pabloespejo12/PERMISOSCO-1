import React, { useState } from 'react';
import type { SolicitudPermiso, EstadoPermiso } from '../types';

interface Props {
  solicitudes: SolicitudPermiso[];
  onCambiarEstado: (id: string, nuevoEstado: EstadoPermiso) => void;
  onEliminar: (id: string) => void;
  onVerComprobante: (solicitud: SolicitudPermiso) => void;
}

export const HistorialPermisos: React.FC<Props> = ({ 
  solicitudes, 
  onCambiarEstado, 
  onEliminar, 
  onVerComprobante 
}) => {
  const [busqueda, setBusqueda] = useState('');

  const solicitudesFiltradas = solicitudes.filter(
    (sol) =>
      sol.nombreTrabajador.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalDiasAcumulados = solicitudes
    .filter((sol) => sol.estado === 'Aprobado')
    .reduce((acc, curr) => acc + (Number(curr.dias) || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">Historial e Informes de Permisos</h2>
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por Folio, Nombre o RUT..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Solicitudes Registradas</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{solicitudes.length}</p>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Días Acumulados (Aprobados)</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{totalDiasAcumulados}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Folio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Período</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trabajador / Aprobador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Motivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duración</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Estado / Gestión</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {solicitudesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  No hay solicitudes registradas aún.
                </td>
              </tr>
            ) : (
              solicitudesFiltradas.map((sol) => (
                <tr key={sol.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    #{sol.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="font-medium text-slate-800">{sol.fechaDesde || 'N/A'} al</div>
                    <div className="text-xs text-slate-500">{sol.fechaHasta || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{sol.nombreTrabajador}</div>
                    <div className="text-xs text-slate-500">RUT: {sol.rut}</div>
                    <div className="text-xs font-medium text-indigo-600 mt-0.5">
                      Jefe Sección: {sol.jefeSeccion || 'No asignado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                    {sol.motivo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {sol.dias} {sol.tipoTiempo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-y-2 md:space-y-0 md:space-x-2">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mr-2 ${
                      sol.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                      sol.estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sol.estado}
                    </span>

                    <div className="inline-flex items-center gap-1 mt-1 md:mt-0">
                      <button
                        onClick={() => onVerComprobante(sol)}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-medium transition"
                        title="Ver Comprobante PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => onCambiarEstado(sol.id, 'Aprobado')}
                        className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-medium transition"
                        title="Aprobar"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => onCambiarEstado(sol.id, 'Rechazado')}
                        className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-medium transition"
                        title="Rechazar"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => onEliminar(sol.id)}
                        className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium transition"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
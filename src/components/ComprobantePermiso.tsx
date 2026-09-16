import React from 'react';
import type { SolicitudPermiso } from '../types';

interface Props {
  solicitud: SolicitudPermiso;
  onCerrar: () => void;
}

export const ComprobantePermiso: React.FC<Props> = ({ solicitud, onCerrar }) => {
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative space-y-6 max-h-[90vh] overflow-y-auto print:shadow-none print:p-0 print:m-0 print:w-full print:max-h-none print:overflow-visible">
        
        {/* Botones de acción (No se imprimen) - Asegurados con z-index y posición fija relativa al contenedor */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center print:hidden border-b pb-4 pt-1">
          <h3 className="text-lg font-bold text-slate-800">Comprobante Oficial - Centro Odontológico</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow cursor-pointer"
            >
              🖨️ Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Estructura Oficial del Comprobante */}
        <div className="space-y-6 border border-slate-200 p-6 rounded-xl bg-slate-50/50 print:border-none print:p-0">
          
          {/* Cabecera institucional */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
            <div>
              <h1 className="text-base font-bold text-slate-900 uppercase">Centro Odontológico Sindicato Nº 1</h1>
              <p className="text-xs text-slate-600">Codelco Chile - Calama</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p><strong>Fecha Emisión:</strong> {solicitud.fechaSolicitud}</p>
              <p><strong>Folio ID:</strong> #{solicitud.id}</p>
            </div>
          </div>

          <h2 className="text-center text-xl font-extrabold text-blue-900 uppercase tracking-wide">
            Solicitud de Permiso
          </h2>

          {/* Datos del Trabajador */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Nombre Trabajador</span>
              <span className="font-medium text-slate-800">{solicitud.nombreTrabajador}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">RUT</span>
              <span className="font-medium text-slate-800">{solicitud.rut}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Jefe de Sección (Aprobador)</span>
              <span className="font-medium text-indigo-700">{solicitud.jefeSeccion || 'No especificado'}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Motivo</span>
              <span className="font-medium text-slate-800">{solicitud.motivo}</span>
            </div>
          </div>

          {/* Fechas y Duración */}
          <div className="grid grid-cols-3 gap-4 text-sm bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Tipo Tiempo</span>
              <span className="font-medium text-slate-800">{solicitud.tipoTiempo}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Desde</span>
              <span className="font-medium text-slate-800">{solicitud.fechaDesde || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Hasta</span>
              <span className="font-medium text-slate-800">{solicitud.fechaHasta || 'N/A'}</span>
            </div>
          </div>

          {/* Bloque exclusivo para Horas de Salida y Llegada (Si aplica) */}
          {solicitud.tipoTiempo === 'Horas' && (
            <div className="grid grid-cols-3 gap-4 text-sm bg-blue-50/70 p-4 rounded-lg border border-blue-200 shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-blue-800 uppercase">Cantidad Horas</span>
                <span className="font-bold text-blue-900">{solicitud.dias} hrs</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-blue-800 uppercase">Hora Salida</span>
                <span className="font-bold text-slate-900">{solicitud.horaSalida || 'N/A'} hrs</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-blue-800 uppercase">Hora Llegada</span>
                <span className="font-bold text-slate-900">{solicitud.horaLlegada || 'N/A'} hrs</span>
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-sm">
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Observaciones</span>
            <p className="text-slate-700 min-h-[40px]">{solicitud.observaciones || 'Sin observaciones registradas.'}</p>
          </div>

          {/* Estado actual */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Estado Actual:</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              solicitud.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
              solicitud.estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {solicitud.estado}
            </span>
          </div>

          {/* Firmas Oficiales */}
          <div className="grid grid-cols-3 gap-6 pt-14 text-center text-xs text-slate-600">
            <div className="border-t border-slate-400 pt-2">
              Firma Solicitante
            </div>
            <div className="border-t border-slate-400 pt-2">
              Jefe Sección / V°B°
            </div>
            <div className="border-t border-slate-400 pt-2">
              Control Tiempo / Empleos
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-4 border-t">
            Original blanco: Control Sindicato | Copia color: Trabajador
          </div>

        </div>
      </div>
    </div>
  );
};
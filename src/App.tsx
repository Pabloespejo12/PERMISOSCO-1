import React, { useState } from 'react';
import type { SolicitudPermiso, EstadoPermiso } from './types';
import { FormularioPermiso } from './components/FormularioPermiso';
import { HistorialPermisos } from './components/HistorialPermisos';
import { ComprobantePermiso } from './components/ComprobantePermiso';

export function App() {
  const [solicitudes, setSolicitudes] = useState<SolicitudPermiso[]>([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudPermiso | null>(null);

  const agregarSolicitud = (nueva: Omit<SolicitudPermiso, 'id'>) => {
    // Generar folio correlativo automático (001, 002, 003...)
    const siguienteFolio = String(solicitudes.length + 1).padStart(3, '0');
    const solicitudConFolio: SolicitudPermiso = {
      ...nueva,
      id: siguienteFolio,
    };
    setSolicitudes([solicitudConFolio, ...solicitudes]);
  };

  const cambiarEstado = (id: string, nuevoEstado: EstadoPermiso) => {
    setSolicitudes(
      solicitudes.map((sol) => (sol.id === id ? { ...sol, estado: nuevoEstado } : sol))
    );
  };

  const eliminarSolicitud = (id: string) => {
    setSolicitudes(solicitudes.filter((sol) => sol.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera institucional */}
        <header className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-600">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Centro Odontológico Sindicato N° 1 Codelco Chile
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Sistema de Gestión y Registro Formal de Permisos de Trabajadores
          </p>
        </header>

        {/* Formulario de registro */}
        <main>
          <FormularioPermiso onAgregarSolicitud={agregarSolicitud} />

          {/* Historial y gestión */}
          <HistorialPermisos
            solicitudes={solicitudes}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminarSolicitud}
            onVerComprobante={(sol) => setSolicitudSeleccionada(sol)}
          />
        </main>

        {/* Modal de Vista Previa / Comprobante PDF */}
        {solicitudSeleccionada && (
          <ComprobantePermiso
            solicitud={solicitudSeleccionada}
            onCerrar={() => setSolicitudSeleccionada(null)}
          />
        )}

      </div>
    </div>
  );
}

export default App;
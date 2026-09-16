import React, { useState, useEffect } from 'react';
import type { SolicitudPermiso, EstadoPermiso } from './types';
import type { TrabajadorNomina } from './types';
import { FormularioPermiso } from './components/FormularioPermiso';
import { HistorialPermisos } from './components/HistorialPermisos';
import { ComprobantePermiso } from './components/ComprobantePermiso';
import { ResumenMensual } from './components/ResumenMensual';
import { GestionNomina } from './components/GestionNomina';

export function App() {
  // Inicialización con persistencia en localStorage para las solicitudes
  const [solicitudes, setSolicitudes] = useState<SolicitudPermiso[]>(() => {
    const saved = localStorage.getItem('sindicato_solicitudes');
    return saved ? JSON.parse(saved) : [];
  });

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudPermiso | null>(null);
  
  // Inicialización con persistencia en localStorage para la nómina de personal
  const [nomina, setNomina] = useState<TrabajadorNomina[]>(() => {
    const saved = localStorage.getItem('sindicato_nomina');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', nombre: 'IVAN SOTO', rut: '1245789-9', cargo: '' },
      { id: '2', nombre: 'PAMELA DIAZ', rut: '44545412-2', cargo: '' },
      { id: '3', nombre: 'PABLO ESPEJO C', rut: '12575300-0', cargo: '' },
    ];
  });
  
  // Estado para controlar la pestaña activa
  const [vistaActiva, setVistaActiva] = useState<'gestion' | 'resumen' | 'nomina'>('gestion');

  // Guardar automáticamente en el navegador
  useEffect(() => {
    localStorage.setItem('sindicato_solicitudes', JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem('sindicato_nomina', JSON.stringify(nomina));
  }, [nomina]);

  const agregarSolicitud = (nueva: Omit<SolicitudPermiso, 'id'>) => {
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

  // Control de duplicados al agregar un trabajador de forma individual
  const agregarTrabajadorNomina = (nuevo: Omit<TrabajadorNomina, 'id'>) => {
    const rutLimpio = nuevo.rut.trim().toUpperCase();
    const existe = nomina.some(t => t.rut.trim().toUpperCase() === rutLimpio);

    if (existe) {
      alert(`⚠️ El trabajador con RUT ${nuevo.rut} ya se encuentra registrado en la nómina.`);
      return;
    }

    const nuevoTrabajador: TrabajadorNomina = {
      ...nuevo,
      id: Date.now().toString(),
    };
    setNomina([...nomina, nuevoTrabajador]);
    alert('¡Trabajador agregado a la nómina con éxito!');
  };

  const eliminarTrabajadorNomina = (id: string) => {
    setNomina(nomina.filter((t) => t.id !== id));
  };

  // Control de duplicados masivos al importar desde Excel
  const agregarNominaMasiva = (nuevosTrabajadores: Omit<TrabajadorNomina, 'id'>[]) => {
    let duplicadosCount = 0;
    const listaActualizada = [...nomina];

    nuevosTrabajadores.forEach((nuevo, index) => {
      const rutLimpio = nuevo.rut.trim().toUpperCase();
      const yaExiste = listaActualizada.some(t => t.rut.trim().toUpperCase() === rutLimpio);

      if (!yaExiste) {
        listaActualizada.push({
          ...nuevo,
          id: `${Date.now()}-${index}`
        });
      } else {
        duplicadosCount++;
      }
    });

    setNomina(listaActualizada);

    if (duplicadosCount > 0) {
      alert(`📊 Carga masiva completada. Se omitieron ${duplicadosCount} trabajadores porque sus RUT ya existían en la nómina.`);
    } else {
      alert(`¡Se importaron todos los trabajadores exitosamente sin duplicados!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C241D]">
      
      <div className="sticky top-0 z-50 bg-[#FDFBF7] pt-6 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-4">
          
          <header className="bg-[#5C4033] text-[#FDFBF7] p-6 rounded-xl shadow-md border-b-4 border-[#A0522D]">
            <h1 className="text-2xl font-extrabold tracking-wide">
              Centro Odontológico Sindicato N° 1 Codelco Chile
            </h1>
            <p className="text-sm text-[#D7CCC8] mt-1">
              Sistema de Gestión y Registro Formal de Permisos de Trabajadores
            </p>
          </header>

          <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-[#F5F2EB] p-3 rounded-xl shadow-sm border border-[#E6E0D5]">
            <button
              onClick={() => setVistaActiva('gestion')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${
                vistaActiva === 'gestion'
                  ? 'bg-[#8B5A2B] text-white shadow'
                  : 'text-[#5C4033] hover:bg-[#EBE5D8]'
              }`}
            >
              📝 Gestión y Permisos
            </button>
            <button
              onClick={() => setVistaActiva('resumen')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${
                vistaActiva === 'resumen'
                  ? 'bg-[#8B5A2B] text-white shadow'
                  : 'text-[#5C4033] hover:bg-[#EBE5D8]'
              }`}
            >
              📊 Resumen Mensual por Horas
            </button>
            <button
              onClick={() => setVistaActiva('nomina')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${
                vistaActiva === 'nomina'
                  ? 'bg-[#8B5A2B] text-white shadow'
                  : 'text-[#5C4033] hover:bg-[#EBE5D8]'
              }`}
            >
              👥 Gestión de Nómina
            </button>
          </nav>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <main>
          {vistaActiva === 'gestion' ? (
            <div className="space-y-8">
              <FormularioPermiso 
                onAgregarSolicitud={agregarSolicitud} 
                nominaPersonal={nomina} 
              />

              <HistorialPermisos
                solicitudes={solicitudes}
                onCambiarEstado={cambiarEstado}
                onEliminar={eliminarSolicitud}
                onVerComprobante={(sol) => setSolicitudSeleccionada(sol)}
              />
            </div>
          ) : vistaActiva === 'resumen' ? (
            <ResumenMensual permisos={solicitudes} />
          ) : (
            <GestionNomina
              nomina={nomina}
              onAgregarTrabajador={agregarTrabajadorNomina}
              onEliminarTrabajador={eliminarTrabajadorNomina}
              onCargaMasiva={agregarNominaMasiva}
            />
          )}
        </main>

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
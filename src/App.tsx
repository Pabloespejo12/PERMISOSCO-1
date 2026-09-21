import React, { useState, useEffect } from 'react';
import type { SolicitudPermiso, EstadoPermiso, TrabajadorNomina, Usuario, RolUsuario } from './types';
import { FormularioPermiso } from './components/FormularioPermiso';
import { HistorialPermisos } from './components/HistorialPermisos';
import { ComprobantePermiso } from './components/ComprobantePermiso';
import { ResumenMensual } from './components/ResumenMensual';
import { GestionNomina } from './components/GestionNomina';
import { GestionUsuarios } from './components/GestionUsuarios';
import { Login } from './components/Login';

export function App() {
  // Estado para el usuario autenticado actual (null significa que no ha iniciado sesión)
  const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('sindicato_sesion_activa');
    return saved ? JSON.parse(saved) : null;
  });

  // Inicialización con persistencia en localStorage para usuarios del sistema (con contraseña)
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('sindicato_usuarios');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', nombre: 'Super Administrador', email: 'super@sindicato.cl', password: '1234', rol: 'superadmin' },
      { id: '2', nombre: 'Administrador General', email: 'admin@sindicato.cl', password: '1234', rol: 'admin' },
      { id: '3', nombre: 'Digitador Turno', email: 'digitador@sindicato.cl', password: '1234', rol: 'digitador' },
      { id: '4', nombre: 'Visualizador Consulta', email: 'visor@sindicato.cl', password: '1234', rol: 'visualizador' },
    ];
  });

  // Solicitudes y Nómina
  const [solicitudes, setSolicitudes] = useState<SolicitudPermiso[]>(() => {
    const saved = localStorage.getItem('sindicato_solicitudes');
    return saved ? JSON.parse(saved) : [];
  });

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudPermiso | null>(null);
  
  const [nomina, setNomina] = useState<TrabajadorNomina[]>(() => {
    const saved = localStorage.getItem('sindicato_nomina');
    return saved ? JSON.parse(saved) : [
      { id: '1', nombre: 'IVAN SOTO', rut: '1245789-9', cargo: '' },
      { id: '2', nombre: 'PAMELA DIAZ', rut: '44545412-2', cargo: '' },
      { id: '3', nombre: 'PABLO ESPEJO C', rut: '12575300-0', cargo: '' },
    ];
  });
  
  const [vistaActiva, setVistaActiva] = useState<'gestion' | 'resumen' | 'nomina' | 'usuarios'>('gestion');

  // Guardar sesión y datos en localStorage
  useEffect(() => {
    if (usuarioLogueado) {
      localStorage.setItem('sindicato_sesion_activa', JSON.stringify(usuarioLogueado));
    } else {
      localStorage.removeItem('sindicato_sesion_activa');
    }
  }, [usuarioLogueado]);

  useEffect(() => {
    localStorage.setItem('sindicato_solicitudes', JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem('sindicato_nomina', JSON.stringify(nomina));
  }, [nomina]);

  useEffect(() => {
    localStorage.setItem('sindicato_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  // Si NO hay usuario logueado, mostramos exclusivamente la pantalla de Login con contraseña
  if (!usuarioLogueado) {
    return <Login usuarios={usuarios} onIniciarSesion={setUsuarioLogueado} />;
  }

  // Obtener el rol actual del usuario logueado para las restricciones
  const rolUsuario = usuarioLogueado.rol;

  const cerrarSesion = () => {
    setUsuarioLogueado(null);
  };

  // Funciones de negocio (validación basada en el rolUsuario)
  const agregarSolicitud = (nueva: Omit<SolicitudPermiso, 'id'>) => {
    if (rolUsuario === 'visualizador') {
      alert('⚠️ Los visualizadores no tienen permisos para crear solicitudes.');
      return;
    }
    const siguienteFolio = String(solicitudes.length + 1).padStart(3, '0');
    setSolicitudes([{ ...nueva, id: siguienteFolio }, ...solicitudes]);
  };

  const cambiarEstado = (id: string, nuevoEstado: EstadoPermiso) => {
    if (rolUsuario === 'visualizador' || rolUsuario === 'digitador') {
      alert('⚠️ Tu rol actual no tiene permisos para cambiar el estado de las solicitudes.');
      return;
    }
    setSolicitudes(solicitudes.map((sol) => (sol.id === id ? { ...sol, estado: nuevoEstado } : sol)));
  };

  const eliminarSolicitud = (id: string) => {
    if (rolUsuario !== 'admin' && rolUsuario !== 'superadmin') {
      alert('⚠️ Solo los administradores pueden eliminar registros.');
      return;
    }
    setSolicitudes(solicitudes.filter((sol) => sol.id !== id));
  };

  const agregarTrabajadorNomina = (nuevo: Omit<TrabajadorNomina, 'id'>) => {
    if (rolUsuario === 'visualizador') {
      alert('⚠️ Los visualizadores no pueden modificar la nómina.');
      return;
    }
    const rutLimpio = nuevo.rut.trim().toUpperCase();
    if (nomina.some(t => t.rut.trim().toUpperCase() === rutLimpio)) {
      alert(`⚠️ El trabajador con RUT ${nuevo.rut} ya se encuentra registrado.`);
      return;
    }
    setNomina([...nomina, { ...nuevo, id: Date.now().toString() }]);
    alert('¡Trabajador agregado con éxito!');
  };

  const eliminarTrabajadorNomina = (id: string) => {
    if (rolUsuario !== 'admin' && rolUsuario !== 'superadmin') {
      alert('⚠️ Solo los administradores pueden eliminar trabajadores.');
      return;
    }
    setNomina(nomina.filter((t) => t.id !== id));
  };

  const agregarNominaMasiva = (nuevosTrabajadores: Omit<TrabajadorNomina, 'id'>[]) => {
    if (rolUsuario === 'visualizador') return;
    let duplicadosCount = 0;
    const listaActualizada = [...nomina];

    nuevosTrabajadores.forEach((nuevo, index) => {
      const rutLimpio = nuevo.rut.trim().toUpperCase();
      if (!listaActualizada.some(t => t.rut.trim().toUpperCase() === rutLimpio)) {
        listaActualizada.push({ ...nuevo, id: `${Date.now()}-${index}` });
      } else {
        duplicadosCount++;
      }
    });
    setNomina(listaActualizada);
    alert(`Carga masiva completada. Se omitieron ${duplicadosCount} duplicados.`);
  };

  const agregarUsuario = (nuevo: Omit<Usuario, 'id'>) => {
    if (rolUsuario !== 'superadmin' && rolUsuario !== 'admin') return;
    
    // Validar si el correo ya existe
    if (usuarios.some(u => u.email.trim().toLowerCase() === nuevo.email.trim().toLowerCase())) {
      alert('⚠️ Ya existe un usuario registrado con ese correo electrónico.');
      return;
    }

    setUsuarios([...usuarios, { ...nuevo, id: Date.now().toString() }]);
    alert('¡Usuario creado con éxito!');
  };

  const cambiarRolUsuario = (id: string, nuevoRol: RolUsuario) => {
    if (rolUsuario !== 'superadmin') {
      alert('⚠️ Solo el SuperAdmin puede modificar los roles.');
      return;
    }
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
  };

  // Nueva función para cambiar la contraseña de un usuario
  const cambiarPasswordUsuario = (id: string, nuevaPassword: string) => {
    if (rolUsuario !== 'superadmin' && rolUsuario !== 'admin') {
      alert('⚠️ No tienes permisos para cambiar contraseñas.');
      return;
    }
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, password: nuevaPassword } : u));
    alert('¡Contraseña actualizada con éxito!');
  };

  const eliminarUsuario = (id: string) => {
    if (rolUsuario !== 'superadmin') {
      alert('⚠️ Solo el SuperAdmin puede eliminar usuarios.');
      return;
    }
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C241D]">
      <div className="sticky top-0 z-50 bg-[#FDFBF7] pt-6 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* Barra de Sesión Activa */}
          <div className="bg-white p-3 rounded-xl shadow-md border border-[#E6E0D5] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-[#5C4033]">Sesión Iniciada:</span>
              <span className="text-[#8B5A2B] font-bold">{usuarioLogueado.nombre}</span>
              <span className="bg-[#EBE5D8] text-[#5C4033] text-xs px-2 py-0.5 rounded-full uppercase font-semibold">
                {usuarioLogueado.rol}
              </span>
            </div>
            <button
              onClick={cerrarSesion}
              className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 transition cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
          
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
                vistaActiva === 'gestion' ? 'bg-[#8B5A2B] text-white shadow' : 'text-[#5C4033] hover:bg-[#EBE5D8]'
              }`}
            >
              📝 Gestión y Permisos
            </button>
            <button
              onClick={() => setVistaActiva('resumen')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${
                vistaActiva === 'resumen' ? 'bg-[#8B5A2B] text-white shadow' : 'text-[#5C4033] hover:bg-[#EBE5D8]'
              }`}
            >
              📊 Resumen Mensual por Horas
            </button>
            {rolUsuario !== 'visualizador' && (
              <button
                onClick={() => setVistaActiva('nomina')}
                className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${
                  vistaActiva === 'nomina' ? 'bg-[#8B5A2B] text-white shadow' : 'text-[#5C4033] hover:bg-[#EBE5D8]'
                }`}
              >
                👥 Gestión de Nómina
              </button>
            )}
            {(rolUsuario === 'admin' || rolUsuario === 'superadmin') && (
              <button
                onClick={() => setVistaActiva('usuarios')}
                className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${
                  vistaActiva === 'usuarios' ? 'bg-[#8B5A2B] text-white shadow' : 'text-[#5C4033] hover:bg-[#EBE5D8]'
                }`}
              >
                🔑 Control de Usuarios
              </button>
            )}
          </nav>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <main>
          {vistaActiva === 'gestion' ? (
            <div className="space-y-8">
              {rolUsuario !== 'visualizador' && (
                <FormularioPermiso onAgregarSolicitud={agregarSolicitud} nominaPersonal={nomina} />
              )}
              <HistorialPermisos
                solicitudes={solicitudes}
                onCambiarEstado={cambiarEstado}
                onEliminar={eliminarSolicitud}
                onVerComprobante={(sol) => setSolicitudSeleccionada(sol)}
              />
            </div>
          ) : vistaActiva === 'resumen' ? (
            <ResumenMensual permisos={solicitudes} />
          ) : vistaActiva === 'nomina' ? (
            <GestionNomina
              nomina={nomina}
              onAgregarTrabajador={agregarTrabajadorNomina}
              onEliminarTrabajador={eliminarTrabajadorNomina}
              onCargaMasiva={agregarNominaMasiva}
            />
          ) : (
            <GestionUsuarios
              usuarios={usuarios}
              onAgregarUsuario={agregarUsuario}
              onCambiarRolUsuario={cambiarRolUsuario}
              onCambiarPasswordUsuario={cambiarPasswordUsuario}
              onEliminarUsuario={eliminarUsuario}
            />
          )}
        </main>

        {solicitudSeleccionada && (
          <ComprobantePermiso solicitud={solicitudSeleccionada} onCerrar={() => setSolicitudSeleccionada(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
import React from 'react';

export type RolUsuario = 'superadmin' | 'admin' | 'digitador' | 'visualizador';

interface Props {
  rolActual: RolUsuario;
  onCambiarRol: (nuevoRol: RolUsuario) => void;
}

export const ControlRoles: React.FC<Props> = ({ rolActual, onCambiarRol }) => {
  const rolesInfo: { rol: RolUsuario; label: string; desc: string }[] = [
    { rol: 'superadmin', label: '👑 SuperAdmin', desc: 'Control total y configuración global' },
    { rol: 'admin', label: '🛠️ Administrador', desc: 'Aprueba, rechaza y exporta' },
    { rol: 'digitador', label: '✍️ Digitador', desc: 'Crea solicitudes y revisa historial' },
    { rol: 'visualizador', label: '👁️ Visualizador', desc: 'Modo lectura de resúmenes y reportes' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-[#E6E0D5] flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <div>
        <h4 className="font-bold text-[#5C4033] text-sm">Simulador de Roles de Usuario</h4>
        <p className="text-xs text-[#795548]">Cambia de rol para probar los accesos en tiempo real:</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {rolesInfo.map((item) => (
          <button
            key={item.rol}
            onClick={() => onCambiarRol(item.rol)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              rolActual === item.rol
                ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-sm ring-2 ring-[#8B5A2B]/30'
                : 'bg-[#FDFBF7] text-[#795548] border-[#D7CCC8] hover:bg-[#F5F2EB]'
            }`}
            title={item.desc}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import type { Usuario, RolUsuario } from '../types';

interface Props {
  usuarios: Usuario[];
  onAgregarUsuario: (nuevo: Omit<Usuario, 'id'>) => void;
  onCambiarRolUsuario: (id: string, nuevoRol: RolUsuario) => void;
  onEliminarUsuario: (id: string) => void;
}

export const GestionUsuarios: React.FC<Props> = ({
  usuarios,
  onAgregarUsuario,
  onCambiarRolUsuario,
  onEliminarUsuario,
}) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // <-- Nuevo estado para la contraseña
  const [rol, setRol] = useState<RolUsuario>('digitador');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      alert('⚠️ Por favor, completa todos los campos, incluyendo la contraseña.');
      return;
    }

    onAgregarUsuario({
      nombre,
      email,
      password, // <-- Enviamos la contraseña al componente principal
      rol,
    });

    // Limpiar formulario
    setNombre('');
    setEmail('');
    setPassword('');
    setRol('digitador');
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-2xl shadow-md border border-[#E6E0D5]">
      <div>
        <h2 className="text-xl font-extrabold text-[#5C4033]">Gestión de Usuarios y Accesos</h2>
        <p className="text-sm text-[#795548]">Crea cuentas nuevas y asigna contraseñas y roles de seguridad.</p>
      </div>

      {/* Formulario para nuevo usuario */}
      <form onSubmit={handleSubmit} className="bg-[#FDFBF7] p-4 rounded-xl border border-[#D7CCC8] space-y-4">
        <h3 className="text-sm font-bold text-[#5C4033] uppercase">Registrar Nuevo Usuario</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#795548] mb-1">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
              className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#795548] mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@sindicato.cl"
              required
              className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#795548] mb-1">Contraseña Inicial</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#795548] mb-1">Rol de Usuario</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as RolUsuario)}
              className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            >
              <option value="superadmin">SuperAdmin</option>
              <option value="admin">Administrador</option>
              <option value="digitador">Digitador</option>
              <option value="visualizador">Visualizador</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#8B5A2B] hover:bg-[#6F451E] text-white font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition cursor-pointer"
        >
          Crear Usuario con Contraseña
        </button>
      </form>

      {/* Listado de usuarios existentes */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F5F2EB] text-[#5C4033] border-b border-[#D7CCC8]">
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol Actual</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E0D5]">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-[#FDFBF7]">
                <td className="p-3 font-medium text-[#2C241D]">{u.nombre}</td>
                <td className="p-3 text-[#795548]">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.rol}
                    onChange={(e) => onCambiarRolUsuario(u.id, e.target.value as RolUsuario)}
                    className="border border-[#D7CCC8] rounded px-2 py-1 text-xs bg-white text-[#5C4033] font-semibold"
                  >
                    <option value="superadmin">superadmin</option>
                    <option value="admin">admin</option>
                    <option value="digitador">digitador</option>
                    <option value="visualizador">visualizador</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onEliminarUsuario(u.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded border border-red-200 transition cursor-pointer"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
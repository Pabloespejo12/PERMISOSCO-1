import React, { useState } from 'react';
import type { Usuario } from '../types';

interface Props {
  usuarios: Usuario[];
  onIniciarSesion: (usuario: Usuario) => void;
}

export const Login: React.FC<Props> = ({ usuarios, onIniciarSesion }) => {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Buscamos el usuario por correo y contraseña
    const usuarioEncontrado = usuarios.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
      onIniciarSesion(usuarioEncontrado);
    } else {
      alert('⚠️ Correo o contraseña incorrectos. Por favor, verifica tus datos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E6E0D5] w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#5C4033]">Centro Odontológico</h2>
          <p className="text-sm text-[#795548]">Sindicato N° 1 Codelco Chile</p>
          <div className="w-16 h-1 bg-[#8B5A2B] mx-auto rounded-full mt-2"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#795548] uppercase mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@sindicato.cl"
              required
              className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2.5 text-sm bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#795548] uppercase mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2.5 text-sm bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B5A2B] hover:bg-[#6F451E] text-white font-semibold py-3 rounded-lg text-sm shadow transition cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="bg-[#F5F2EB] p-3 rounded-lg text-xs text-[#795548] space-y-1">
          <p className="font-bold text-[#5C4033]">Credenciales por defecto para pruebas:</p>
          <p>👑 <strong>SuperAdmin:</strong> super@sindicato.cl / 1234</p>
          <p>🛠️ <strong>Admin:</strong> admin@sindicato.cl / 1234</p>
          <p>✍️ <strong>Digitador:</strong> digitador@sindicato.cl / 1234</p>
          <p>👁️ <strong>Visualizador:</strong> visor@sindicato.cl / 1234</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import type { MotivoPermiso, SolicitudPermiso } from '../types';

interface Props {
  onAgregarSolicitud: (solicitud: Omit<SolicitudPermiso, 'id'>) => void;
}

export const FormularioPermiso: React.FC<Props> = ({ onAgregarSolicitud }) => {
  const [nombreTrabajador, setNombreTrabajador] = useState('');
  const [rut, setRut] = useState('');
  const [jefeSeccion, setJefeSeccion] = useState('');
  const [motivo, setMotivo] = useState<MotivoPermiso>('Particulares');
  const [tipoTiempo, setTipoTiempo] = useState<'Dias' | 'Horas'>('Horas');
  const [dias, setDias] = useState<number>(0.5);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [horaLlegada, setHoraLlegada] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar coherencia estricta de horas si el tipo de solicitud es "Horas"
    if (tipoTiempo === 'Horas' && horaSalida && horaLlegada) {
      const [salidaHora, salidaMin] = horaSalida.split(':').map(Number);
      const [llegadaHora, llegarMin] = horaLlegada.split(':').map(Number);

      const totalMinutosSalida = salidaHora * 60 + salidaMin;
      const totalMinutosLlegada = llegadaHora * 60 + llegarMin;
      const diferenciaMinutos = totalMinutosLlegada - totalMinutosSalida;

      if (diferenciaMinutos <= 0) {
        alert('Error: La hora de llegada debe ser posterior a la hora de salida.');
        return;
      }

      const horasCalculadas = diferenciaMinutos / 60;
      const horasSolicitadas = Number(dias);

      // Validación estricta: la diferencia horaria debe coincidir exactamente con lo solicitado
      if (horasCalculadas !== horasSolicitadas) {
        alert(
          `Error de coherencia: El rango horario seleccionado (${horasCalculadas} hrs) no coincide con la cantidad de horas solicitadas (${horasSolicitadas} hrs). Deben ser exactamente iguales.`
        );
        return;
      }
    }

    const nuevaSolicitud = {
      fechaSolicitud: new Date().toISOString().split('T')[0],
      nombreTrabajador,
      rut,
      jefeSeccion,
      motivo,
      tipoTiempo,
      fechaDesde,
      fechaHasta,
      dias: Number(dias),
      ...(tipoTiempo === 'Horas' && { horaSalida, horaLlegada }),
      observaciones,
      estado: 'En espera' as const,
    };

    onAgregarSolicitud(nuevaSolicitud);

    // Mensaje de éxito institucional
    alert(`¡Solicitud enviada con éxito!\n\nSe ha registrado correctamente el permiso para ${nombreTrabajador}. Queda en estado "En espera" para su revisión.`);

    // Limpiar formulario
    setNombreTrabajador('');
    setRut('');
    setJefeSeccion('');
    setFechaDesde('');
    setFechaHasta('');
    setHoraSalida('');
    setHoraLlegada('');
    setDias(0.5);
    setObservaciones('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Formulario de Solicitud de Permiso</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Trabajador</label>
          <input
            type="text"
            value={nombreTrabajador}
            onChange={(e) => setNombreTrabajador(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Juan Pérez"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 12.345.678-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value as MotivoPermiso)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Particulares">Particulares</option>
            <option value="Consolidado">Consolidado</option>
            <option value="Permiso Médico">Permiso Médico</option>
            <option value="Fallecimiento">Fallecimiento</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Solicitud</label>
          <select
            value={tipoTiempo}
            onChange={(e) => setTipoTiempo(e.target.value as 'Dias' | 'Horas')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Dias">Por Días</option>
            <option value="Horas">Por Horas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cantidad ({tipoTiempo === 'Horas' ? 'Horas' : 'Días'})
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={dias}
            onChange={(e) => setDias(parseFloat(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {tipoTiempo === 'Horas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hora de Salida</label>
            <input
              type="time"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              required={tipoTiempo === 'Horas'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hora de Regreso / Llegada</label>
            <input
              type="time"
              value={horaLlegada}
              onChange={(e) => setHoraLlegada(e.target.value)}
              required={tipoTiempo === 'Horas'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Desde (Fecha)</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hasta (Fecha)</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jefe de Sección</label>
          <input
            type="text"
            value={jefeSeccion}
            onChange={(e) => setJefeSeccion(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Dr. Javier Pérez"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
        <textarea
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detalles adicionales del permiso..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition shadow"
        >
          Enviar Solicitud
        </button>
      </div>
    </form>
  );
};
export type MotivoPermiso = 'Consolidado' | 'Particulares' | 'Permiso Médico' | 'Fallecimiento';
export type EstadoPermiso = 'En espera' | 'Aprobado' | 'Rechazado';

export interface SolicitudPermiso {
  id: string;
  fechaSolicitud: string;
  nombreTrabajador: string;
  rut: string;
  jefeSeccion: string;
  motivo: MotivoPermiso;
  tipoTiempo: 'Dias' | 'Horas';
  fechaDesde: string;
  fechaHasta: string;
  dias: number;
  // Nuevos campos opcionales para permisos por horas
  horaSalida?: string;
  horaLlegada?: string;
  observaciones: string;
  estado: EstadoPermiso;
}
export interface TrabajadorNomina {
  id: string;
  nombre: string;
  rut: string;
  cargo: string;
}

export type RolUsuario = 'superadmin' | 'admin' | 'digitador' | 'visualizador';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string; // Agregamos la contraseña
  rol: RolUsuario;
}
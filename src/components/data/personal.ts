export interface Trabajador {
  nombre: string;
  rut: string;
  cargo?: string;
}

export const NOMINA_PERSONAL: Trabajador[] = [
  { nombre: "IVAN SOTO", rut: "1245789-9", cargo: "Operador Planta" },
  { nombre: "PAMELA DIAZ", rut: "44545412-2", cargo: "Administrativa" },
  { nombre: "PABLO ESPEJO C", rut: "12575300-0", cargo: "Odontólogo" },
  // Agrega aquí al resto de los trabajadores de tu centro...
];
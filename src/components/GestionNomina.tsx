import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import type { TrabajadorNomina } from '../types';

interface Props {
  nomina: TrabajadorNomina[];
  onAgregarTrabajador: (trabajador: Omit<TrabajadorNomina, 'id'>) => void;
  onEliminarTrabajador: (id: string) => void;
  onCargaMasiva: (trabajadores: Omit<TrabajadorNomina, 'id'>[]) => void;
}

export const GestionNomina: React.FC<Props> = ({ nomina, onAgregarTrabajador, onEliminarTrabajador, onCargaMasiva }) => {
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !rut.trim()) return;

    onAgregarTrabajador({
      nombre: nombre.trim().toUpperCase(),
      rut: rut.trim(),
      cargo: ''
    });

    setNombre('');
    setRut('');
    alert('¡Trabajador agregado a la nómina con éxito!');
  };

  const descargarPlantilla = () => {
    const plantillaEjemplo = [
      { Nombre: 'JUAN PÉREZ GONZÁLEZ', RUT: '12.345.678-9' },
      { Nombre: 'MARÍA ROJAS LÓPEZ', RUT: '9.876.543-K' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(plantillaEjemplo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla Nomina');
    XLSX.writeFile(workbook, 'Plantilla_Carga_Nomina.xlsx');
  };

  const procesarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      try {
        const buffer = evento.target?.result;
        const libro = XLSX.read(buffer, { type: 'array' });
        const hojaNombre = libro.SheetNames[0];
        const hoja = libro.Sheets[hojaNombre];
        
        // Convertir filas a matriz
        const filas = XLSX.utils.sheet_to_json<any[]>(hoja, { header: 1 });
        console.log("Filas encontradas:", filas);

        const listaNuevos: Omit<TrabajadorNomina, 'id'>[] = [];

        // Recorrer desde la fila 1 (saltando los encabezados de la fila 0)
        for (let i = 1; i < filas.length; i++) {
          const fila = filas[i];
          if (!fila || fila.length === 0) continue;

          const nom = fila[0]; // Columna A
          const rutVal = fila[1]; // Columna B

          if (nom && rutVal) {
            listaNuevos.push({
              nombre: String(nom).trim().toUpperCase(),
              rut: String(rutVal).trim(),
              cargo: ''
            });
          }
        }

        if (listaNuevos.length > 0) {
          onCargaMasiva(listaNuevos);
          alert(`¡Éxito! Se cargaron ${listaNuevos.length} trabajadores correctamente.`);
        } else {
          alert(`El archivo se leyó, pero no se encontraron datos válidos. Total de filas leídas: ${filas.length}. Asegúrate de que la Columna A tenga el Nombre y la Columna B el RUT.`);
        }
      } catch (err) {
        console.error("Error leyendo excel:", err);
        alert('Hubo un error al leer el archivo. Asegúrate de que sea un archivo Excel (.xlsx) válido.');
      }
    };

    lector.readAsArrayBuffer(archivo);
    e.target.value = ''; 
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestión de Nómina de Personal</h2>
          <p className="text-sm text-slate-500 mt-0.5">Administra el personal o importa masivamente con la plantilla oficial.</p>
        </div>
        
        {/* Botones de plantilla y carga masiva */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={descargarPlantilla}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm cursor-pointer"
          >
            📥 Descargar Plantilla Excel
          </button>

          <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow cursor-pointer inline-block text-center">
            📊 Cargar Nómina Masiva
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={procesarArchivo} 
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Formulario individual */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Ana Torres"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej. 12.345.678-9"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow"
          >
            Agregar Trabajador
          </button>
        </div>
      </form>

      {/* Listado de la nómina */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre del Trabajador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">RUT</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {nomina.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                  No hay trabajadores registrados en la nómina.
                </td>
              </tr>
            ) : (
              nomina.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{t.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{t.rut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => onEliminarTrabajador(t.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
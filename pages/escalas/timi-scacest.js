import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const EDADES = [
  { id: 'lt65', label: 'Edad < 65 años', puntos: 0 },
  { id: '65_74', label: 'Edad 65-74 años', puntos: 2 },
  { id: 'ge75', label: 'Edad ≥ 75 años', puntos: 3 }
];

const CRITERIOS = [
  { id: 'frcv', label: 'DM, HTA o angina', puntos: 1, texto: 'DM, HTA o angina' },
  { id: 'tas', label: 'TA sistólica < 100 mmHg', puntos: 3, texto: 'TA sistólica < 100 mmHg' },
  { id: 'peso', label: 'Peso < 67 kg', puntos: 1, texto: 'Peso < 67 kg' },
  { id: 'st', label: 'Elevación ST previa o BCRI', puntos: 1, texto: 'Elevación ST previa o BCRI' },
  { id: 'killip', label: 'Killip II-IV', puntos: 2, texto: 'Killip II-IV' },
  { id: 'fc', label: 'FC > 110 lpm', puntos: 2, texto: 'FC > 110 lpm' },
  { id: 'tto', label: 'Retraso tratamiento > 4 h', puntos: 1, texto: 'Retraso tratamiento > 4 h' }
];

function getMortalidad(puntos) {
  if (puntos <= 0) return '0,8 %';
  if (puntos === 1) return '1,6 %';
  if (puntos === 2) return '2,2 %';
  if (puntos === 3) return '4,4 %';
  if (puntos === 4) return '7,3 %';
  if (puntos === 5) return '12,4 %';
  if (puntos === 6) return '16,1 %';
  if (puntos === 7) return '23,4 %';
  if (puntos === 8) return '26,8 %';
  return '35,9 %';
}

export default function TimiScacest() {
  const [edad, setEdad] = useState(EDADES[0]);
  const [seleccion, setSeleccion] = useState({});

  const puntuacion = useMemo(() => {
    const edadPuntos = edad?.puntos || 0;
    const otros = CRITERIOS.reduce(
      (total, c) => (seleccion[c.id] ? total + c.puntos : total),
      0
    );
    return edadPuntos + otros;
  }, [edad, seleccion]);

  const mortalidad = useMemo(() => getMortalidad(puntuacion), [puntuacion]);

  const textoInforme = useMemo(() => {
    const criteriosSeleccionados = CRITERIOS.filter((c) => seleccion[c.id]).map(
      (c) => `- ${c.texto}`
    );
    return `TIMI Risk Score (SCACEST)
- ${edad.label}
${criteriosSeleccionados.join('\n')}

Puntuación: ${puntuacion} puntos
Riesgo de mortalidad global a los 30 días: ${mortalidad}`;
  }, [edad, seleccion, puntuacion, mortalidad]);

  const toggle = (id) => {
    setSeleccion((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setEdad(EDADES[0]);
    setSeleccion({});
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="input-group">
        <label>Edad</label>
        <div className="selector-botones">
          {EDADES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`selector-btn ${edad?.id === opt.id ? 'activo' : ''}`}
              onClick={() => setEdad(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="criterios">
        {CRITERIOS.map((c) => (
          <button
            key={c.id}
            className={`criterio-btn ${seleccion[c.id] ? 'activo-rojo' : ''}`}
            onClick={() => toggle(c.id)}
          >
            <span>{c.label}</span>
            <span className="puntos">{c.puntos > 0 ? `+${c.puntos}` : c.puntos}</span>
          </button>
        ))}
      </div>

      <div className="escala-footer">
        <div className="acciones-escala">
          <button className="reset-btn" onClick={reset}>
            Reiniciar escala
          </button>
        </div>

        <div className="resultado rojo">
          <div className="puntos-total">{puntuacion} puntos</div>
          <div className="interpretacion">
            Riesgo de mortalidad global a los 30 días: {mortalidad}
          </div>
        </div>
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

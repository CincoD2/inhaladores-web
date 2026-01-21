import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const CRITERIOS = [
  {
    id: 'confusion',
    label: 'Confusión (desorientación en los 3 ejes)',
    texto: 'Confusión. Desorientación en los 3 ejes.'
  },
  {
    id: 'urea',
    label: 'Urea > 42 mg/dl (7 mmol/l o BUN > 19 mg/dl)',
    texto: 'Urea >42 mg/dl (BUN >19 mg/dl)'
  },
  {
    id: 'fr',
    label: 'Frecuencia respiratoria ≥ 30 rpm',
    texto: 'Frecuencia respiratoria ≥30 rpm'
  },
  {
    id: 'ta',
    label: 'Tensión arterial: TAS < 90 mmHg o TAD < 60 mmHg',
    texto: 'TA: TAS <90 mmHg o TAD <60 mmHg'
  },
  {
    id: 'edad',
    label: 'Edad ≥ 65 años',
    texto: 'Edad ≥65 años'
  }
];

function getInterpretacion(puntuacion) {
  if (puntuacion <= 1) {
    return {
      texto: 'BAJO RIESGO: Puede hacerse tratamiento ambulatorio',
      color: 'verde'
    };
  }
  if (puntuacion === 2) {
    return {
      texto: 'RIESGO MEDIO: Valorar ingreso u observación en urgencias',
      color: 'amarillo'
    };
  }
  if (puntuacion === 3) {
    return {
      texto: 'RIESGO ELEVADO: Requiere ingreso hospitalario',
      color: 'rojo'
    };
  }
  return {
    texto: 'RIESGO ELEVADO: Requiere ingreso hospitalario. Valorar UCI',
    color: 'rojo'
  };
}

export default function Curb65() {
  const [seleccion, setSeleccion] = useState({});
  const haySeleccion = Object.values(seleccion).some(Boolean);

  const puntuacion = useMemo(() => {
    return CRITERIOS.reduce((total, c) => (seleccion[c.id] ? total + 1 : total), 0);
  }, [seleccion]);

  const interpretacion = useMemo(() => getInterpretacion(puntuacion), [puntuacion]);

  const textoInforme = useMemo(() => {
    if (!haySeleccion) return null;

    const criteriosSeleccionados = CRITERIOS
      .filter((c) => seleccion[c.id])
      .map((c) => `- ${c.texto}`)
      .join('\n');

    return `CURB-65
${criteriosSeleccionados}

Puntuación: ${puntuacion}
${interpretacion.texto}`;
  }, [haySeleccion, seleccion, puntuacion, interpretacion]);

  const toggle = (id) => {
    setSeleccion((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setSeleccion({});
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="criterios">
        {CRITERIOS.map((c) => (
          <button
            key={c.id}
            className={`criterio-btn ${seleccion[c.id] ? 'activo-rojo' : ''}`}
            onClick={() => toggle(c.id)}
          >
            <span>{c.label}</span>
            <span className="puntos">+1</span>
          </button>
        ))}
      </div>

      <div className="escala-footer">
        <div className="acciones-escala">
          <button className="reset-btn" onClick={reset}>
            Reiniciar escala
          </button>
        </div>

        <div className={`resultado ${interpretacion.color}`}>
          <div className="puntos-total">{puntuacion} puntos</div>
          <div className="interpretacion">{interpretacion.texto}</div>
        </div>
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

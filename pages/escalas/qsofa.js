import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const CRITERIOS = [
  {
    id: 'mental',
    label: 'Estado mental alterado o empeorado',
    texto: 'Estado mental alterado'
  },
  {
    id: 'fr',
    label: 'Frecuencia respiratoria ≥ 22 rpm',
    texto: 'Frecuencia respiratoria ≥22 rpm'
  },
  {
    id: 'tas',
    label: 'TAS ≤ 100 mmHg',
    texto: 'TAS ≤100 mmHg'
  }
];

function getInterpretacion(puntuacion) {
  if (puntuacion < 2) {
    return {
      texto: 'BAJO RIESGO: Repetir qSOFA frecuentemente. Continuar tratamiento estándar.',
      color: 'verde'
    };
  }
  return {
    texto: 'RIESGO ALTO: Vigilar disfunción orgánica. Pedir lactato. Evaluar con SOFA.',
    color: 'rojo'
  };
}

export default function Qsofa() {
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

    return `qSOFA
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

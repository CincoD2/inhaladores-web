import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const CRITERIOS = [
  {
    id: 'hta',
    label: 'Hipertensión arterial (TAS > 160 mmHg)',
    texto: 'Hipertensión arterial (TAS > 160 mmHg)'
  },
  {
    id: 'renal',
    label: 'Alteración de la función renal (diálisis, trasplante, Cr > 2,26 mg/dL)',
    texto: 'Alteración de la función renal'
  },
  {
    id: 'hepatico',
    label:
      'Alteración de la función hepática (cirrosis, Br > x2, AST/ALT/ALP > x3)',
    texto: 'Alteración de la función hepática'
  },
  {
    id: 'acv',
    label: 'ACV isquémico o hemorrágico previo',
    texto: 'ACV isquémico o hemorrágico previo'
  },
  {
    id: 'hemorragia',
    label:
      'Hemorragia mayor previa o predisposición (asociada o no a anemia o trombocitopenia severa)',
    texto: 'Hemorragia mayor previa o predisposición'
  },
  {
    id: 'inr',
    label:
      'INR lábil (menos del 60% del tiempo en rango terapéutico en pacientes con AVK)',
    texto: 'INR lábil'
  },
  {
    id: 'edad',
    label: 'Edad > 65 años (o fragilidad extrema)',
    texto: 'Edad > 65 años (o fragilidad extrema)'
  },
  {
    id: 'medicacion',
    label: 'Medicación predisponente (antiagregantes, AINEs)',
    texto: 'Medicación predisponente'
  },
  {
    id: 'alcohol',
    label: 'Alcoholismo activo',
    texto: 'Alcoholismo activo'
  }
];

function getInterpretacion(puntuacion) {
  if (puntuacion >= 3) {
    return {
      texto: 'Riesgo alto (probabilidad de sangrado en un año entre el 4,9 y el 19,6 %)',
      color: 'rojo'
    };
  }
  if (puntuacion === 2) {
    return {
      texto: 'Riesgo intermedio (probabilidad de sangrado en un año entre 1,88 y 3,2 %)',
      color: 'amarillo'
    };
  }
  if (puntuacion === 1) {
    return {
      texto: 'Riesgo bajo (probabilidad de sangrado en un año entre el 1,02 y el 1,5 %)',
      color: 'verde'
    };
  }
  return {
    texto: 'Riesgo muy bajo (probabilidad de sangrado en un año menor del 1 %)',
    color: 'verde'
  };
}

export default function Hasbled() {
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

    return `HAS-BLED
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

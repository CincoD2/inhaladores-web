import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const EDADES = [
  { id: 'lt65', label: 'Edad < 65 años', puntos: 0, texto: 'Edad < 65 años' },
  { id: '65_74', label: 'Edad entre 65 y 74 años', puntos: 1, texto: 'Edad entre 65 y 74 años' },
  { id: 'ge75', label: 'Edad ≥ 75 años', puntos: 2, texto: 'Edad ≥ 75 años' }
];

const CRITERIOS = [
  {
    id: 'icc',
    label:
      'Historia de insuficiencia cardiaca congestiva (valoración clínica o disfunción ventricular moderada o severa o MCPH)',
    puntos: 1,
    texto: 'Historia de insuficiencia cardiaca congestiva'
  },
  {
    id: 'hta',
    label: 'HTA actual (>140/90) o en tratamiento',
    puntos: 1,
    texto: 'HTA actual (>140/90) o en tratamiento'
  },
  {
    id: 'acv',
    label: 'ACV, AIT o TEP previos',
    puntos: 2,
    texto: 'ACV, AIT o TEP previos'
  },
  {
    id: 'vascular',
    label:
      'Historia de enfermedad vascular (enf. arterial coronaria significativa, IAM previo, EAP o ateromatosis aórtica)',
    puntos: 1,
    texto: 'Historia de enfermedad vascular'
  },
  {
    id: 'dm',
    label:
      'Diabetes mellitus (tratamiento con ADOs o insulina o glucemia capilar > 125 mg/dL)',
    puntos: 1,
    texto: 'Diabetes mellitus'
  },
  {
    id: 'mujer',
    label: 'Género femenino',
    puntos: 1,
    texto: 'Género femenino'
  }
];

const RIESGO = [
  'menor de 1.3 %',
  '1.3 %',
  '2.2 %',
  '3.2 %',
  '4.0 %',
  '6.7 %',
  '9.8 %',
  '9.6 %',
  '6.7 %',
  '15.2 %'
];

function getInterpretacion(puntuacion, soloMujer) {
  if (puntuacion < 1) {
    return {
      texto: `Riesgo bajo (riesgo de ACV en el próximo año: ${RIESGO[puntuacion]})`,
      color: 'verde'
    };
  }
  if (puntuacion === 1 && soloMujer) {
    return {
      texto: 'Riesgo bajo (riesgo de ACV en el próximo año: menor de 1.3 %)',
      color: 'verde'
    };
  }
  if (puntuacion === 1) {
    return {
      texto: `Riesgo bajo-moderado. Considerar anticoagulación o antiagregación (riesgo de ACV en el próximo año: ${RIESGO[puntuacion]})`,
      color: 'amarillo'
    };
  }
  return {
    texto: `Riesgo moderado o alto. Está indicada la anticoagulación (riesgo de ACV en el próximo año: ${RIESGO[puntuacion]})`,
    color: 'rojo'
  };
}

export default function Chads2vasc() {
  const [edad, setEdad] = useState(EDADES[0]);
  const [seleccion, setSeleccion] = useState({});

  const puntuacionBase = useMemo(() => {
    const edadPuntos = edad?.puntos || 0;
    const otros = CRITERIOS.reduce(
      (total, c) => (seleccion[c.id] ? total + c.puntos : total),
      0
    );
    return edadPuntos + otros;
  }, [edad, seleccion]);

  const soloMujer = useMemo(() => {
    const mujer = !!seleccion.mujer;
    const otros = Object.keys(seleccion).some((id) => id !== 'mujer' && seleccion[id]);
    return mujer && !otros && (edad?.puntos || 0) === 0;
  }, [seleccion, edad]);

  const puntuacionFinal = soloMujer ? puntuacionBase - 1 : puntuacionBase;

  const interpretacion = useMemo(
    () => getInterpretacion(puntuacionFinal, soloMujer),
    [puntuacionFinal, soloMujer]
  );

  const textoInforme = useMemo(() => {
    const criteriosEdad = edad?.texto ? `- ${edad.texto}` : '';
    const criteriosSeleccionados = CRITERIOS
      .filter((c) => seleccion[c.id])
      .map((c) => `- ${c.texto}`)
      .join('\n');

    return `CHA2DS2-VASc
${[criteriosEdad, criteriosSeleccionados].filter(Boolean).join('\n')}

Puntuación: ${puntuacionFinal}
${interpretacion.texto}`;
  }, [edad, seleccion, puntuacionFinal, interpretacion]);

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

        <div className={`resultado ${interpretacion.color}`}>
          <div className="puntos-total">{puntuacionFinal} puntos</div>
          <div className="interpretacion">{interpretacion.texto}</div>
        </div>
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

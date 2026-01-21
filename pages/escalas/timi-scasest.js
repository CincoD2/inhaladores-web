import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const FRCV = [
  { id: 'hta', label: 'HTA > 140/90 o en tratamiento' },
  { id: 'tabaco', label: 'Tabaquismo' },
  { id: 'dislipemia', label: 'Dislipemia (HDL < 40)' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'familia', label: 'Antecedentes familiares de cardiopatía isquémica prematura' }
];

const CRITERIOS = [
  { id: 'cad', label: 'CAD previa (estenosis ≥ 50%)', puntos: 1 },
  { id: 'aas', label: 'Tratamiento con AAS más de 1 semana', puntos: 1 },
  { id: 'angina', label: 'Angina severa (≥ 2 crisis/24 h)', puntos: 1 },
  { id: 'st', label: 'Cambios en ST (≥ 0,5 mm)', puntos: 1 },
  { id: 'tn', label: 'Biomarcadores elevados', puntos: 1 },
  { id: 'edad', label: 'Edad ≥ 65', puntos: 1 }
];

function getRiesgoCombinado(puntos) {
  if (puntos < 2) return { combinado: '4,7 %', iam: '3 %' };
  if (puntos === 2) return { combinado: '8,3 %', iam: '3 %' };
  if (puntos === 3) return { combinado: '13,2 %', iam: '5 %' };
  if (puntos === 4) return { combinado: '20 %', iam: '7 %' };
  if (puntos === 5) return { combinado: '26,2 %', iam: '12 %' };
  return { combinado: '41 %', iam: '19 %' };
}

function getRecomendacion(puntos, st, tn) {
  if (puntos <= 2) {
    return 'Bajo riesgo. Puede seguir tratamiento ambulatorio.';
  }
  if (puntos >= 3 && puntos <= 4) {
    return 'Riesgo intermedio. Ingreso hospitalario. Iniciar enoxaparina o HNF y IIb/IIIa si se plantea estrategia invasiva precoz (PCI).';
  }
  return 'Alto riesgo. Ingreso hospitalario. Iniciar enoxaparina o HNF y IIb/IIIa. Estrategia invasiva precoz (ICP).';
}

function getRecomendacionEspecial(puntos, st, tn) {
  if (puntos === 1 && (st || tn)) {
    return 'Bajo riesgo. Puede seguir tratamiento ambulatorio. Se recomienda una prueba de estrés no invasiva para valoración de isquemia inducible antes del alta (clase IA).';
  }
  if (puntos === 2 && tn && st) {
    return 'Riesgo moderado (debido al incremento de cTnI y alteración del ST). Ingreso hospitalario.';
  }
  if (puntos === 2 && tn) {
    return 'Riesgo moderado (debido al incremento de cTnI). Ingreso hospitalario.';
  }
  if (puntos === 2 && st) {
    return 'Riesgo moderado (debido a los cambios en el ST). Ingreso hospitalario.';
  }
  return null;
}

export default function TimiScasest() {
  const [frcv, setFrcv] = useState({});
  const [seleccion, setSeleccion] = useState({});

  const frcvCount = useMemo(
    () => FRCV.reduce((total, f) => (frcv[f.id] ? total + 1 : total), 0),
    [frcv]
  );

  const puntosFrcv = frcvCount >= 3 ? 1 : 0;

  const puntosCriterios = useMemo(
    () => CRITERIOS.reduce((total, c) => (seleccion[c.id] ? total + c.puntos : total), 0),
    [seleccion]
  );

  const puntuacion = puntosFrcv + puntosCriterios;
  const riesgo = getRiesgoCombinado(puntuacion);
  const st = !!seleccion.st;
  const tn = !!seleccion.tn;
  const recomendacionEspecial = getRecomendacionEspecial(puntuacion, st, tn);
  const recomendacion = recomendacionEspecial || getRecomendacion(puntuacion, st, tn);

  const textoInforme = useMemo(() => {
    const frcvSeleccionados = FRCV.filter((f) => frcv[f.id]).map((f) => `- ${f.label}`);
    const criteriosSeleccionados = CRITERIOS.filter((c) => seleccion[c.id]).map(
      (c) => `- ${c.label}`
    );
    return `TIMI Risk Score (SCASEST)
Factores de riesgo cardiovascular: ${frcvCount} (≥3 = ${puntosFrcv} punto)
${frcvSeleccionados.join('\n')}

Hallazgos clínicos:
${criteriosSeleccionados.join('\n')}

Puntuación: ${puntuacion} puntos
Riesgo combinado a 14 días: ${riesgo.combinado}
Mortalidad por IAM: ${riesgo.iam}
${recomendacion}`;
  }, [frcv, seleccion, frcvCount, puntosFrcv, puntuacion, riesgo, recomendacion]);

  const toggleFrcv = (id) => {
    setFrcv((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggle = (id) => {
    setSeleccion((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setFrcv({});
    setSeleccion({});
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="input-group">
        <label>Factores de riesgo cardiovascular ({frcvCount})</label>
        <div className="criterios">
          {FRCV.map((f) => (
            <button
              key={f.id}
              className={`criterio-btn ${frcv[f.id] ? 'activo-rojo' : ''}`}
              onClick={() => toggleFrcv(f.id)}
            >
              <span>{f.label}</span>
              <span className="puntos">+1</span>
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

        <div className="resultado rojo">
          <div className="puntos-total">{puntuacion} puntos</div>
          <div className="interpretacion">
            Riesgo combinado: {riesgo.combinado} — Mortalidad IAM: {riesgo.iam}
          </div>
        </div>
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

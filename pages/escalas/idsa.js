import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const MAYORES = [
  { id: 'vmi', label: 'Necesidad de ventilación mecánica invasiva', texto: 'Necesidad de ventilación mecánica invasiva' },
  { id: 'shock', label: 'Shock séptico que precisa fármacos vasoactivos', texto: 'Shock séptico que precisa fármacos vasoactivos' }
];

const MENORES = [
  { id: 'multilobar', label: 'Infiltrados multilobares', texto: 'Infiltrados multilobares' },
  { id: 'pafi', label: 'PaO2/FiO2 ≤ 90 mmHg', texto: 'PaO2/FiO2 ≤ 90 mmHg' },
  { id: 'confusion', label: 'Confusión/Desorientación', texto: 'Confusión/Desorientación' },
  { id: 'fr', label: 'Frecuencia respiratoria ≥ 30 rpm', texto: 'Frecuencia respiratoria ≥ 30 rpm' },
  { id: 'urea', label: 'Urea > 43 mg/dL', texto: 'Urea > 43 mg/dL' },
  { id: 'leuco', label: 'Leucopenia < 4 000 céls/mm3', texto: 'Leucopenia < 4 000 céls/mm3' },
  { id: 'plaquetas', label: 'Trombocitopenia < 100 000 céls/mm3', texto: 'Trombocitopenia < 100 000 céls/mm3' },
  { id: 'hipotermia', label: 'Hipotermia < 36 ºC', texto: 'Hipotermia < 36 ºC' },
  { id: 'hipotension', label: 'Hipotensión que precise aporte intensivo de fluidos', texto: 'Hipotensión que precise aporte intensivo de fluidos' }
];

function getInterpretacion(mayores, menores) {
  if (mayores === 0 && menores < 3) {
    return {
      texto: 'No hay criterios de ingreso en UCI.',
      color: 'verde',
      resumen: `${menores} criterios menores y ningún criterio mayor.`
    };
  }
  if (mayores === 0 && menores >= 3) {
    return {
      texto: 'Está indicado el ingreso en UCI.',
      color: 'rojo',
      resumen: `${menores} criterios menores y ningún criterio mayor.`
    };
  }
  if (mayores === 1) {
    return {
      texto: 'Está indicado el ingreso en UCI.',
      color: 'rojo',
      resumen: `1 criterio mayor y ${menores} criterios menores.`
    };
  }
  return {
    texto: 'Está indicado el ingreso en UCI.',
    color: 'rojo',
    resumen: `2 criterios mayores y ${menores} criterios menores.`
  };
}

export default function Idsa() {
  const [mayoresSel, setMayoresSel] = useState({});
  const [menoresSel, setMenoresSel] = useState({});

  const mayores = useMemo(
    () => MAYORES.reduce((total, c) => (mayoresSel[c.id] ? total + 1 : total), 0),
    [mayoresSel]
  );
  const menores = useMemo(
    () => MENORES.reduce((total, c) => (menoresSel[c.id] ? total + 1 : total), 0),
    [menoresSel]
  );

  const interpretacion = useMemo(() => getInterpretacion(mayores, menores), [mayores, menores]);

  const textoInforme = useMemo(() => {
    const mayoresTxt = MAYORES.filter((c) => mayoresSel[c.id]).map((c) => `- ${c.texto}`);
    const menoresTxt = MENORES.filter((c) => menoresSel[c.id]).map((c) => `- ${c.texto}`);
    return `IDSA/ATS
Criterios mayores:
${mayoresTxt.join('\n') || '- Ninguno'}

Criterios menores:
${menoresTxt.join('\n') || '- Ninguno'}

Resultado: ${interpretacion.resumen}
${interpretacion.texto}`;
  }, [mayoresSel, menoresSel, interpretacion]);

  const toggleMayor = (id) => {
    setMayoresSel((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMenor = (id) => {
    setMenoresSel((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setMayoresSel({});
    setMenoresSel({});
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="input-group">
        <label>Criterios mayores</label>
        <div className="criterios">
          {MAYORES.map((c) => (
            <button
              key={c.id}
              className={`criterio-btn ${mayoresSel[c.id] ? 'activo-rojo' : ''}`}
              onClick={() => toggleMayor(c.id)}
            >
              <span>{c.label}</span>
              <span className="puntos">+10</span>
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Criterios menores</label>
        <div className="criterios">
          {MENORES.map((c) => (
            <button
              key={c.id}
              className={`criterio-btn ${menoresSel[c.id] ? 'activo-rojo' : ''}`}
              onClick={() => toggleMenor(c.id)}
            >
              <span>{c.label}</span>
              <span className="puntos">+1</span>
            </button>
          ))}
        </div>
      </div>

      <div className="escala-footer">
        <div className="acciones-escala">
          <button className="reset-btn" onClick={reset}>
            Reiniciar escala
          </button>
        </div>

        <div className={`resultado ${interpretacion.color}`}>
          <div className="puntos-total">
            {mayores} mayor(es), {menores} menor(es)
          </div>
          <div className="interpretacion">{interpretacion.texto}</div>
        </div>
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

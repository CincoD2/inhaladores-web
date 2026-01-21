import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const OXIGENO = [
  { id: '21', label: 'Sin oxígeno suplementario', valor: 21 },
  { id: '24', label: 'Gafas nasales a 1 lpm', valor: 24 },
  { id: '28', label: 'Gafas nasales a 2 lpm', valor: 28 },
  { id: '32', label: 'Gafas nasales a 3 lpm', valor: 32 },
  { id: '36', label: 'Gafas nasales a 4 lpm', valor: 36 },
  { id: '40', label: 'Gafas nasales a 5 lpm', valor: 40 },
  { id: '30', label: 'VMK al 30%', valor: 30 },
  { id: '35', label: 'VMK al 35%', valor: 35 },
  { id: '40b', label: 'VMK al 40%', valor: 40 },
  { id: '50', label: 'VMK reservorio', valor: 50 }
];

function getGravedad(ratio) {
  if (ratio > 0 && ratio <= 100) {
    return { texto: 'SDRA grave (mortalidad 45%)', color: 'rojo' };
  }
  if (ratio > 100 && ratio <= 200) {
    return { texto: 'SDRA moderado (mortalidad 32%)', color: 'naranja' };
  }
  if (ratio > 200 && ratio <= 300) {
    return { texto: 'SDRA leve (mortalidad 27%)', color: 'amarillo' };
  }
  return { texto: 'Adecuada PaFi', color: 'verde' };
}

export default function Pafi() {
  const [po2, setPo2] = useState('');
  const [fio2, setFio2] = useState('');
  const [oxigeno, setOxigeno] = useState(OXIGENO[0]);

  const calculo = useMemo(() => {
    const pO2 = parseFloat(po2);
    const FiO2 = parseFloat(fio2);
    if (!pO2 || !FiO2) return null;
    if (pO2 < 10 || FiO2 < 21 || FiO2 > 100) {
      return { error: 'Revisa valores de pO2 y/o FiO2 (21%-100%)' };
    }
    const ratio = Math.round((pO2 / FiO2) * 100);
    const gravedad = getGravedad(ratio);
    return { ratio, ...gravedad };
  }, [po2, fio2]);

  const textoInforme = useMemo(() => {
    if (!calculo || calculo.error) return null;
    return `PaFi
- pO2: ${po2} mmHg
- FiO2: ${fio2} %

PaFi: ${calculo.ratio} mmHg
${calculo.texto}`;
  }, [calculo, po2, fio2]);

  const reset = () => {
    setPo2('');
    setFio2('');
    setOxigeno(OXIGENO[0]);
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="inputs-grid">
        <div className="input-group">
          <label>pO2</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={po2} onChange={(e) => setPo2(e.target.value)} />
            <span className="input-unidad">mmHg</span>
          </div>
        </div>

        <div className="input-group">
          <label>FiO2</label>
          <div className="input-con-unidad">
            <input type="number" min="21" max="100" value={fio2} onChange={(e) => setFio2(e.target.value)} />
            <span className="input-unidad">%</span>
          </div>
        </div>

        <div className="input-group">
          <label>Oxígeno suplementario</label>
          <select
            value={oxigeno.id}
            onChange={(e) => {
              const sel = OXIGENO.find((o) => o.id === e.target.value) || OXIGENO[0];
              setOxigeno(sel);
              setFio2(String(sel.valor));
            }}
          >
            {OXIGENO.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>
        Borrar datos
      </button>

      {calculo?.error && (
        <div className="resultado rojo">
          <div className="puntos-total">{calculo.error}</div>
        </div>
      )}

      {calculo && !calculo.error && (
        <div className={`resultado ${calculo.color}`}>
          <div className="puntos-total">{calculo.ratio} mmHg</div>
          <div className="interpretacion">{calculo.texto}</div>
        </div>
      )}

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

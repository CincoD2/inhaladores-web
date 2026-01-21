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

function calcularPaFiEquivalente(spo2, fio2) {
  const SpO2 = spo2 / 100;
  const FiO2 = fio2 / 100;

  const A = Math.pow(28.6025, 3);
  const B = 1 / SpO2;
  const C = B - 0.99;
  const D = A / C;
  const PAO2 = Math.pow(D, 1 / 3);
  const E = Math.round(PAO2 / FiO2);

  const B1 = Math.pow(SpO2, -1);
  const C1 = B1 - 1;
  const D1 = Math.pow(C1, -1);
  const RA = 11700 * D1;

  const E1 = Math.pow(50, 3) + Math.pow(RA, 2);
  const RB = Math.pow(E1, 0.5);
  const RBA = RB + RA;
  const RBA2 = RB - RA;
  const F1 = Math.pow(RBA, 1 / 3);
  const F2 = Math.pow(RBA2, 1 / 3);
  const F3 = F1 - F2;
  const F4 = Math.round(F3 / FiO2);

  return { paFi: F4, paFiAlt: E };
}

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

function getSofa(ratio) {
  if (ratio < 100) return 4;
  if (ratio >= 100 && ratio < 200) return 3;
  if (ratio >= 200 && ratio < 300) return 2;
  if (ratio >= 300 && ratio < 400) return 1;
  return 0;
}

export default function Safi() {
  const [spo2, setSpo2] = useState('');
  const [fio2, setFio2] = useState('');
  const [oxigeno, setOxigeno] = useState(OXIGENO[0]);

  const calculo = useMemo(() => {
    const SpO2 = parseFloat(spo2);
    const FiO2 = parseFloat(fio2);
    if (!SpO2 || !FiO2) return null;
    if (FiO2 < 21 || FiO2 > 100) {
      return { error: 'Revisa valores de FiO2 (entre 21 y 100%)' };
    }
    if (SpO2 < 85 || SpO2 > 99) {
      return { error: 'Pulsioximetría: valores entre 85 y 99%' };
    }

    const spfi = Math.round((SpO2 / FiO2) * 100);
    const { paFi } = calcularPaFiEquivalente(SpO2, FiO2);
    const gravedad = getGravedad(paFi);
    const sofa = getSofa(paFi);

    return { spfi, paFi, gravedad, sofa };
  }, [spo2, fio2]);

  const textoInforme = useMemo(() => {
    if (!calculo || calculo.error) return null;
    return `SpFi / PaFi
- SpO2: ${spo2} %
- FiO2: ${fio2} %

SpFi: ${calculo.spfi} mmHg
Equivalencia PaFi: ${calculo.paFi} mmHg
SOFA: ${calculo.sofa}
${calculo.gravedad.texto}`;
  }, [calculo, spo2, fio2]);

  const reset = () => {
    setSpo2('');
    setFio2('');
    setOxigeno(OXIGENO[0]);
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="inputs-grid">
        <div className="input-group">
          <label>SpO2</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
            <span className="input-unidad">%</span>
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
        <div className={`resultado ${calculo.gravedad.color}`}>
          <div className="puntos-total">PaFi {calculo.paFi} mmHg</div>
          <div className="interpretacion">
            SpFi {calculo.spfi} mmHg · SOFA {calculo.sofa} · {calculo.gravedad.texto}
          </div>
        </div>
      )}

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

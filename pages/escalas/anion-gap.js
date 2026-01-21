import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const UNIDADES = [
  { id: 'uno', label: 'mEq/L', factor: 1 },
  { id: 'dos', label: 'mmol/L', factor: 1 },
  { id: 'tres', label: 'mEq/100 mL', factor: 10 },
  { id: 'cuatro', label: 'mmol/100 mL', factor: 10 },
  { id: 'cinco', label: 'mg/100 mL', factor: 1 },
  { id: 'seis', label: 'mg/L', factor: 1 }
];

function convertir(valor, unidad, tipo) {
  if (!valor || isNaN(valor)) return null;
  const base = parseFloat(valor);
  if (unidad.id === 'cinco') {
    const divisor = tipo === 'na' ? 2.299 : tipo === 'k' ? 3.91 : tipo === 'cl' ? 3.545 : 6.1017;
    return base / divisor;
  }
  if (unidad.id === 'seis') {
    const divisor = tipo === 'na' ? 22.99 : tipo === 'k' ? 39.1 : tipo === 'cl' ? 35.45 : 61.017;
    return base / divisor;
  }
  return base * unidad.factor;
}

export default function AnionGap() {
  const [na, setNa] = useState('');
  const [k, setK] = useState('');
  const [cl, setCl] = useState('');
  const [hco3, setHco3] = useState('');
  const [uNa, setUNa] = useState(UNIDADES[0]);
  const [uK, setUK] = useState(UNIDADES[0]);
  const [uCl, setUCl] = useState(UNIDADES[0]);
  const [uHco3, setUHco3] = useState(UNIDADES[0]);

  const calculo = useMemo(() => {
    const naV = convertir(na, uNa, 'na');
    const clV = convertir(cl, uCl, 'cl');
    const hco3V = convertir(hco3, uHco3, 'hco3');
    const kV = k ? convertir(k, uK, 'k') : null;

    if (!naV || !clV || !hco3V) return null;
    const total1 = naV + (kV || 0);
    const total2 = clV + hco3V;
    const total = total1 - total2;
    const valor = Math.round(total * 100) / 100;

    const tieneK = !!kV;
    const normalMin = tieneK ? 12 : 8;
    const normalMax = tieneK ? 20 : 16;
    let interpretacion = 'valor normal';
    let color = 'verde';
    if (valor < normalMin) {
      interpretacion = 'valor descendido';
      color = 'amarillo';
    } else if (valor >= normalMax) {
      interpretacion = 'valor elevado';
      color = 'rojo';
    }

    return { valor, interpretacion, color };
  }, [na, k, cl, hco3, uNa, uK, uCl, uHco3]);

  const textoInforme = useMemo(() => {
    if (!calculo) return null;
    return `Brecha aniónica
- Na: ${na} ${uNa.label}
- K: ${k ? `${k} ${uK.label}` : 'No incluido'}
- Cl: ${cl} ${uCl.label}
- HCO3: ${hco3} ${uHco3.label}

Resultado: ${calculo.valor} mEq/L
Interpretación: ${calculo.interpretacion}`;
  }, [calculo, na, k, cl, hco3, uNa, uK, uCl, uHco3]);

  const reset = () => {
    setNa('');
    setK('');
    setCl('');
    setHco3('');
    setUNa(UNIDADES[0]);
    setUK(UNIDADES[0]);
    setUCl(UNIDADES[0]);
    setUHco3(UNIDADES[0]);
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="inputs-grid">
        <div className="input-group">
          <label>Sodio (Na+)</label>
          <input type="number" min="0" value={na} onChange={(e) => setNa(e.target.value)} />
          <select value={uNa.id} onChange={(e) => setUNa(UNIDADES.find((u) => u.id === e.target.value))}>
            {UNIDADES.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Potasio (K+) (opcional)</label>
          <input type="number" min="0" value={k} onChange={(e) => setK(e.target.value)} />
          <select value={uK.id} onChange={(e) => setUK(UNIDADES.find((u) => u.id === e.target.value))}>
            {UNIDADES.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Cloro (Cl-)</label>
          <input type="number" min="0" value={cl} onChange={(e) => setCl(e.target.value)} />
          <select value={uCl.id} onChange={(e) => setUCl(UNIDADES.find((u) => u.id === e.target.value))}>
            {UNIDADES.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Bicarbonato (HCO3-)</label>
          <input type="number" min="0" value={hco3} onChange={(e) => setHco3(e.target.value)} />
          <select
            value={uHco3.id}
            onChange={(e) => setUHco3(UNIDADES.find((u) => u.id === e.target.value))}
          >
            {UNIDADES.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>
        Borrar datos
      </button>

      {calculo && (
        <div className={`resultado ${calculo.color}`}>
          <div className="puntos-total">{calculo.valor} mEq/L</div>
          <div className="interpretacion">{calculo.interpretacion}</div>
        </div>
      )}

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

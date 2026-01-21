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

export default function GradienteAaO2() {
  const [pAtm, setPAtm] = useState('760');
  const [pco2, setPco2] = useState('');
  const [po2, setPo2] = useState('');
  const [fio2, setFio2] = useState('21');
  const [edad, setEdad] = useState('');
  const [oxigeno, setOxigeno] = useState(OXIGENO[0]);

  const calculo = useMemo(() => {
    const PAtm = parseFloat(pAtm);
    const pCO2 = parseFloat(pco2);
    const pO2 = parseFloat(po2);
    const FiO2 = parseFloat(fio2);
    const Edad = parseFloat(edad);

    if (!PAtm || !pCO2 || !pO2 || !FiO2 || !Edad) return null;
    if (FiO2 < 21 || FiO2 > 100) return { error: 'FiO2 debe estar entre 21 y 100%' };

    const grad = ((PAtm - 47) * (FiO2 / 100)) - (pCO2 / 0.8) - pO2;
    if (grad < 0) return { error: 'El gradiente A-a no puede ser negativo' };

    const gradR = Math.round(grad * 100) / 100;
    const gradEdad = Edad / 4 - -4;
    const nota = gradR > gradEdad ? 'elevado' : 'normal';

    let interpretacion = '';
    if (gradR > gradEdad && pO2 < 80) {
      interpretacion =
        'Posibles causas de hipoxemia con elevación del gradiente A-a: defecto de difusión, alteración V/Q, shunts.';
    }
    if (gradR <= gradEdad && pO2 < 80) {
      interpretacion =
        'Posibles causas de hipoxemia sin elevación del gradiente A-a: hipoventilación alveolar, baja FiO2.';
    }

    return { gradR, gradEdad, nota, interpretacion };
  }, [pAtm, pco2, po2, fio2, edad]);

  const textoInforme = useMemo(() => {
    if (!calculo || calculo.error) return null;
    return `Gradiente A-a de O2
- PAtm: ${pAtm} mmHg
- PaCO2: ${pco2} mmHg
- PaO2: ${po2} mmHg
- FiO2: ${fio2} %
- Edad: ${edad} años

Gradiente A-a: ${calculo.gradR} mmHg (${calculo.nota})
Valor normal por edad: ${calculo.gradEdad} mmHg
${calculo.interpretacion}`;
  }, [calculo, pAtm, pco2, po2, fio2, edad]);

  const reset = () => {
    setPAtm('760');
    setPco2('');
    setPo2('');
    setFio2('21');
    setEdad('');
    setOxigeno(OXIGENO[0]);
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="inputs-grid">
        <div className="input-group">
          <label>Presión atmosférica</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={pAtm} onChange={(e) => setPAtm(e.target.value)} />
            <span className="input-unidad">mmHg</span>
          </div>
        </div>

        <div className="input-group">
          <label>PaCO2</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={pco2} onChange={(e) => setPco2(e.target.value)} />
            <span className="input-unidad">mmHg</span>
          </div>
        </div>

        <div className="input-group">
          <label>PaO2</label>
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
          <label>Edad</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={edad} onChange={(e) => setEdad(e.target.value)} />
            <span className="input-unidad">años</span>
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
        <div className={`resultado ${calculo.nota === 'elevado' ? 'rojo' : 'verde'}`}>
          <div className="puntos-total">{calculo.gradR} mmHg</div>
          <div className="interpretacion">
            Gradiente A-a {calculo.nota}. Valor normal por edad: {calculo.gradEdad} mmHg
          </div>
        </div>
      )}

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

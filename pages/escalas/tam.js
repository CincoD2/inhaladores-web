import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

export default function Tam() {
  const [tas, setTas] = useState('');
  const [tad, setTad] = useState('');

  const calculo = useMemo(() => {
    const sp = parseFloat(tas);
    const dp = parseFloat(tad);
    if (!sp || !dp) return null;
    if (dp >= sp) return { error: '¿La diastólica mayor que la sistólica? Revisa los valores.' };
    const map = Math.round(dp - -((sp - dp) / 3));
    return { map };
  }, [tas, tad]);

  const textoInforme = useMemo(() => {
    if (!calculo || calculo.error) return null;
    return `PAM
- TAS: ${tas} mmHg
- TAD: ${tad} mmHg

PAM: ${calculo.map} mmHg`;
  }, [calculo, tas, tad]);

  const reset = () => {
    setTas('');
    setTad('');
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="inputs-grid">
        <div className="input-group">
          <label>TAS</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={tas} onChange={(e) => setTas(e.target.value)} />
            <span className="input-unidad">mmHg</span>
          </div>
        </div>

        <div className="input-group">
          <label>TAD</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={tad} onChange={(e) => setTad(e.target.value)} />
            <span className="input-unidad">mmHg</span>
          </div>
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
        <div className="resultado verde">
          <div className="puntos-total">PAM {calculo.map} mmHg</div>
        </div>
      )}

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

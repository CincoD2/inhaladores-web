import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const OCULAR = [
  { id: 'o4', label: 'Espontánea', puntos: 4 },
  { id: 'o3', label: 'Apertura a la orden', puntos: 3 },
  { id: 'o2', label: 'Apertura al dolor', puntos: 2 },
  { id: 'o1', label: 'Sin respuesta', puntos: 1 }
];

const VERBAL = [
  { id: 'v5', label: 'Orientada', puntos: 5 },
  { id: 'v4', label: 'Confusa', puntos: 4 },
  { id: 'v3', label: 'Inapropiada', puntos: 3 },
  { id: 'v2', label: 'Incomprensible', puntos: 2 },
  { id: 'v1', label: 'Sin respuesta', puntos: 1 }
];

const MOTORA = [
  { id: 'm6', label: 'Obedece órdenes', puntos: 6 },
  { id: 'm5', label: 'Localiza estímulo doloroso', puntos: 5 },
  { id: 'm4', label: 'Retirada al dolor', puntos: 4 },
  { id: 'm3', label: 'Flexión (decorticación)', puntos: 3 },
  { id: 'm2', label: 'Extensión (descerebración)', puntos: 2 },
  { id: 'm1', label: 'Sin respuesta', puntos: 1 }
];

function getInterpretacion(total) {
  if (total === 15) {
    return { texto: 'Sin lesión cerebral', color: 'verde' };
  }
  if (total < 8) {
    return { texto: 'Lesión cerebral severa. Considerar IOT.', color: 'rojo' };
  }
  if (total < 13) {
    return { texto: 'Lesión cerebral moderada', color: 'naranja' };
  }
  return { texto: 'Lesión cerebral leve', color: 'amarillo' };
}

export default function Glasgow() {
  const [ocular, setOcular] = useState(OCULAR[0]);
  const [verbal, setVerbal] = useState(VERBAL[0]);
  const [motora, setMotora] = useState(MOTORA[0]);

  const total = useMemo(
    () => (ocular?.puntos || 0) + (verbal?.puntos || 0) + (motora?.puntos || 0),
    [ocular, verbal, motora]
  );

  const interpretacion = useMemo(() => getInterpretacion(total), [total]);

  const textoInforme = useMemo(() => {
    return `GCS
- Respuesta ocular: ${ocular.label} (${ocular.puntos})
- Respuesta verbal: ${verbal.label} (${verbal.puntos})
- Respuesta motora: ${motora.label} (${motora.puntos})

Puntuación: ${total} (O:${ocular.puntos}, V:${verbal.puntos}, M:${motora.puntos})
${interpretacion.texto}`;
  }, [ocular, verbal, motora, total, interpretacion]);

  const reset = () => {
    setOcular(OCULAR[0]);
    setVerbal(VERBAL[0]);
    setMotora(MOTORA[0]);
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="input-group">
        <label>Respuesta ocular ({ocular.puntos})</label>
        <div className="selector-botones">
          {OCULAR.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`selector-btn ${ocular.id === opt.id ? 'activo' : ''}`}
              onClick={() => setOcular(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Respuesta verbal ({verbal.puntos})</label>
        <div className="selector-botones">
          {VERBAL.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`selector-btn ${verbal.id === opt.id ? 'activo' : ''}`}
              onClick={() => setVerbal(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Respuesta motora ({motora.puntos})</label>
        <div className="selector-botones">
          {MOTORA.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`selector-btn ${motora.id === opt.id ? 'activo' : ''}`}
              onClick={() => setMotora(opt)}
            >
              {opt.label}
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
          <div className="puntos-total">{total} puntos</div>
          <div className="interpretacion">{interpretacion.texto}</div>
        </div>
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

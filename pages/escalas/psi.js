import { useMemo, useState } from 'react';
import InformeCopiable from '@/components/InformeCopiable';

const CRITERIOS = [
  { id: 'institucionalizado', label: 'Institucionalizado', puntos: 10 },
  { id: 'neoplasia', label: 'Neoplasia', puntos: 30 },
  { id: 'hepatopatia', label: 'Hepatopatía', puntos: 30 },
  { id: 'icc', label: 'Insuficiencia cardiaca congestiva', puntos: 10 },
  { id: 'acv', label: 'ACV', puntos: 10 },
  { id: 'nefro', label: 'Nefropatía', puntos: 10 },
  { id: 'consciencia', label: 'Alteración del nivel de conciencia', puntos: 20 },
  { id: 'fr', label: 'Frecuencia respiratoria ≥ 30 rpm', puntos: 20 },
  { id: 'tas', label: 'TAS ≤ 90 mmHg', puntos: 20 },
  { id: 'temp', label: 'Temperatura < 35 ºC o > 40 ºC', puntos: 15 },
  { id: 'fc', label: 'Frecuencia cardiaca > 125 lpm', puntos: 10 },
  { id: 'ph', label: 'pH arterial < 7,35', puntos: 30 },
  { id: 'urea', label: 'Urea ≥ 65 mg/dl o creatinina > 1,5 mg/dl', puntos: 20 },
  { id: 'na', label: 'Sodio < 130 mEq/L', puntos: 20 },
  { id: 'glucosa', label: 'Glucemia ≥ 250 mg/dl', puntos: 10 },
  { id: 'hto', label: 'Hematocrito < 30%', puntos: 10 },
  { id: 'po2', label: 'pO2 arterial < 60 mmHg o SatO2 < 90%', puntos: 10 },
  { id: 'derrame', label: 'Derrame pleural', puntos: 10 }
];

function getInterpretacion(puntuacion) {
  if (puntuacion <= 50) {
    return {
      clase: 'PSI Clase I',
      texto: 'La mortalidad a los 30 días es del 0,1-2,8%. Se puede dar alta domiciliaria.',
      color: 'verde'
    };
  }
  if (puntuacion <= 70) {
    return {
      clase: 'PSI Clase II',
      texto: 'La mortalidad a los 30 días es del 0,1-2,8%. Se puede dar alta domiciliaria.',
      color: 'verde'
    };
  }
  if (puntuacion <= 90) {
    return {
      clase: 'PSI Clase III',
      texto:
        'La mortalidad a los 30 días es del 0,1-2,8%. Se recomienda ingreso en Unidad de Corta Estancia si no hay hipoxemia.',
      color: 'amarillo'
    };
  }
  if (puntuacion <= 131) {
    return {
      clase: 'PSI Clase IV',
      texto: 'La mortalidad a los 30 días es del 8,2-9,3%. El paciente precisa ingreso hospitalario.',
      color: 'rojo'
    };
  }
  return {
    clase: 'PSI Clase V',
    texto: 'La mortalidad a los 30 días es del 27-31%. El paciente precisa ingreso hospitalario.',
    color: 'rojo'
  };
}

export default function Psi() {
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('H');
  const [seleccion, setSeleccion] = useState({});

  const puntuacion = useMemo(() => {
    const edadNum = parseInt(edad, 10);
    if (!edadNum) return null;
    const base = edadNum + (sexo === 'M' ? -10 : 0);
    const extras = CRITERIOS.reduce(
      (total, c) => (seleccion[c.id] ? total + c.puntos : total),
      0
    );
    return base + extras;
  }, [edad, sexo, seleccion]);

  const interpretacion = useMemo(() => {
    if (puntuacion === null) return null;
    return getInterpretacion(puntuacion);
  }, [puntuacion]);

  const textoInforme = useMemo(() => {
    if (!edad || parseInt(edad, 10) === 0) {
      return 'Introduce la edad del paciente';
    }
    const criteriosSeleccionados = CRITERIOS
      .filter((c) => seleccion[c.id])
      .map((c) => `- ${c.label}`)
      .join('\n');
    return `PSI
- Edad del paciente: ${edad} años
- Sexo: ${sexo === 'M' ? 'Mujer' : 'Hombre'}
${criteriosSeleccionados}

PSI: ${puntuacion}
${interpretacion?.clase}
${interpretacion?.texto}`;
  }, [edad, sexo, seleccion, puntuacion, interpretacion]);

  const toggle = (id) => {
    setSeleccion((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setEdad('');
    setSexo('H');
    setSeleccion({});
  };

  return (
    <main className="escala-wrapper" style={{ padding: 24 }}>
      <div className="inputs-grid">
        <div className="input-group">
          <label>Sexo</label>
          <div className="selector-botones">
            <button
              type="button"
              className={`selector-btn ${sexo === 'H' ? 'activo' : ''}`}
              onClick={() => setSexo('H')}
            >
              Hombre
            </button>
            <button
              type="button"
              className={`selector-btn ${sexo === 'M' ? 'activo' : ''}`}
              onClick={() => setSexo('M')}
            >
              Mujer
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Edad</label>
          <div className="input-con-unidad">
            <input type="number" min="0" value={edad} onChange={(e) => setEdad(e.target.value)} />
            <span className="input-unidad">años</span>
          </div>
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

        {interpretacion && (
          <div className={`resultado ${interpretacion.color}`}>
            <div className="puntos-total">{puntuacion} puntos</div>
            <div className="interpretacion">
              {interpretacion.clase} · {interpretacion.texto}
            </div>
          </div>
        )}
      </div>

      {textoInforme && <InformeCopiable texto={textoInforme} />}
    </main>
  );
}

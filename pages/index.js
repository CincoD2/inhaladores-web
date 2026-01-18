import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRk7eftV0jKqjyLSf0nlVdheLthzEe6YnLH7UfKoKz_8rO0egB7imlswiymtLSRFhUFTv-XA-emUJyT/pub?gid=1829034177&single=true&output=csv';


//Formato Tipo Titulo

function toTitleCase(text) {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}


// Dar formato a la columna Nombre

function formatearNombre(nombre) {
  if (!nombre) return { marca: '', resto: '', completo: '' };

  const original = nombre.trim();

  // localizar primer dígito
  const match = original.match(/\d/);

  let marca, resto;

  if (match) {
    const i = match.index;
    marca = original.slice(0, i).trim();
    resto = original.slice(i).trim();
  } else {
    marca = original;
    resto = '';
  }

  // normalizaciones
  marca = marca.toUpperCase();
  resto = resto
    .replace(/microgramos/gi, 'mcg')
    .toLowerCase();

  return {
    marca,
    resto,
    completo: original
  };
}




export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log('CSV cargado:', results.data.length);
      setData(results.data);
      setLoading(false);
    },
    error: (err) => {
      console.error('Error PapaParse:', err);
      setLoading(false);
    }
  });
}, []);



  const sortedData = useMemo(() => {
  return [...data].sort((a, b) => {
    const nombreA = a['nombre'] || '';
    const nombreB = b['nombre'] || '';

    const n = nombreA.localeCompare(nombreB, 'es', { sensitivity: 'base' });
    if (n !== 0) return n;

    const labA = a['labcomercializador'] || '';
    const labB = b['labcomercializador'] || '';

    return labA.localeCompare(labB, 'es', { sensitivity: 'base' });
  });
}, [data]);

  
  if (loading) return <p>Cargando inhaladores…</p>;

if (!data.length) {
  return <p>No se han cargado datos</p>;
}

  return (
    <main style={{ padding: 24 }}>
      <h1>Inhaladores</h1>
      <p>Total filas: {sortedData.length}</p>

      <table>
        <thead>
  <tr>
    <th>Nombre</th>
    <th>Principio activo</th>
    <th>Dispositivo</th>
    <th>Tipo inhalador</th>
    <th>Indicación</th>
    <th>Tipo tratamiento</th>
    <th>Laboratorio</th>
  </tr>
</thead>

        <tbody>
  {sortedData.map((d, i) => (
    <tr
      key={i}
      style={{ cursor: 'pointer' }}
      onClick={() => window.open(d['POSOLOGIA_FT_4_2_URL'], '_blank')}
    >
      <td className="nombre-cell">
  {(() => {
    const n = formatearNombre(d['nombre']);
    return (
      <span className="nombre-wrapper" title={n.completo}>
        <strong className="nombre-marca">{n.marca}</strong>
        {n.resto && (
  <>
    {'\u00A0'}
    <span className="nombre-resto">{n.resto}</span>
  </>
)}
      </span>
    );
  })()}
</td>

      <td>{toTitleCase(d['vtm'])}</td>
      <td>{d['DISPOSITIVO']}</td>
      <td>{d['DISPOSITIVO_INHALACION']}</td>
      <td>
        {[
          d['ASMA (FT 4.1)'] === 'Sí' ? 'Asma' : null,
          d['EPOC (FT 4.1)'] === 'Sí' ? 'EPOC' : null
        ]
          .filter(Boolean)
          .join(', ')
        }
      </td>
      <td>{d['TIPO_TRATAMIENTO']}</td>
      <td>{d['labcomercializador']}</td>
    </tr>
  ))}
</tbody>

      </table>

      <style jsx>{`
        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 14px;
        }
        th, td {
          border-bottom: 1px solid #ddd;
          padding: 6px 8px;
          vertical-align: top;
        }
        tr:hover {
          background: #f5f7fa;
        }
        th {
          text-align: left;
        }
        .nombre-cell {
  max-width: 420px;
}

.nombre-wrapper {
  display: inline-flex;
  max-width: 100%;
  white-space: nowrap;
}

.nombre-marca {
  flex-shrink: 0; /* NUNCA se corta */
}

.nombre-resto {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
}
      `}</style>
    </main>
  );
}
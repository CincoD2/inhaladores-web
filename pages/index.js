import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRk7eftV0jKqjyLSf0nlVdheLthzEe6YnLH7UfKoKz_8rO0egB7imlswiymtLSRFhUFTv-XA-emUJyT/pub?gid=1829034177&single=true&output=csv";

// Normaliza la columna Nombre

function splitNombre(nombre) {
  if (!nombre) return { marca: "", resto: "" };

  // Normalizar MICROGRAMOS → mcg (case-insensitive)
  let txt = nombre.replace(/microgramos/gi, "mcg");

  // Buscar el primer dígito (inicio de dosis)
  const match = txt.match(/\d/);

  if (!match) {
    // Caso raro: sin dosis (ej. "BRETARIS GENUAIR")
    return {
      marca: txt.toUpperCase(),
      resto: "",
    };
  }

  const idx = match.index;

  const marca = txt.slice(0, idx).trim().toUpperCase();
  const resto = txt.slice(idx).trim().toLowerCase();

  return { marca, resto };
}

// Aplica formato Tipo Titulo

function toTitleCase(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((w) => (w === "+" ? "+" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export default function Home() {
  const [data, setData] = useState([]);
  const [f, setF] = useState({
    tipo: "",
    asma: false,
    epoc: false,
    dispositivo: "",
    clases: [],
  });

  useEffect(() => {
    fetch(CSV_URL)
      .then((r) => r.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
      });
  }, []);

  const dispositivos = useMemo(
    () =>
      Array.from(new Set(data.map((d) => d.DISPOSITIVO)))
        .filter(Boolean)
        .sort(),
    [data],
  );

//Filtrar y ordenar los datos de la tabla origen

  const filtrados = useMemo(() => {
  return data
    .filter(d => {
      if (f.tipo && d.TIPO_TRATAMIENTO !== f.tipo) return false;
      if (f.asma && d['ASMA (FT 4.1)'] !== 'Sí') return false;
      if (f.epoc && d['EPOC (FT 4.1)'] !== 'Sí') return false;
      if (f.dispositivo && d.DISPOSITIVO !== f.dispositivo) return false;

      if (f.clases.length) {
        for (const c of f.clases) {
          if (d[c] !== 'Sí') return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // 1º ordenar por nombre
      const n1 = (a.nombre || '').localeCompare(
        b.nombre || '',
        'es',
        { sensitivity: 'base' }
      );
      if (n1 !== 0) return n1;

      // 2º desempate por laboratorio
      return (a.labcomercializador || '').localeCompare(
        b.labcomercializador || '',
        'es',
        { sensitivity: 'base' }
      );
    });
}, [data, f]);



  const toggleClase = (c) =>
    setF((s) => ({
      ...s,
      clases: s.clases.includes(c)
        ? s.clases.filter((x) => x !== c)
        : [...s.clases, c],
    }));

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h1>Buscador de inhaladores</h1>

      {/* FILTROS */}
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}
      >
        <select onChange={(e) => setF({ ...f, tipo: e.target.value })}>
          <option value="">Tipo tratamiento</option>
          <option>Mono</option>
          <option>Dual</option>
          <option>Triple</option>
        </select>

        <label>
          <input
            type="checkbox"
            onChange={(e) => setF({ ...f, asma: e.target.checked })}
          />{" "}
          Asma
        </label>

        <label>
          <input
            type="checkbox"
            onChange={(e) => setF({ ...f, epoc: e.target.checked })}
          />{" "}
          EPOC
        </label>

        <select onChange={(e) => setF({ ...f, dispositivo: e.target.value })}>
          <option value="">Dispositivo</option>
          {dispositivos.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {["SABA", "SAMA", "LABA", "LAMA", "CI"].map((c) => (
          <label key={c}>
            <input
              type="checkbox"
              checked={f.clases.includes(c)}
              onChange={() => toggleClase(c)}
            />{" "}
            {c}
          </label>
        ))}
      </div>

      {/* TABLA */}
      <table
        width="100%"
        cellPadding={8}
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th>Nombre</th>
            <th>Principio activo</th>
            <th>Dispositivo</th>
            <th>Indicación</th>
            <th>Laboratorio</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((d, i) => (
            <tr
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => window.open(d.POSOLOGIA_FT_4_2_URL, "_blank")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <td>
                <span
                  title={d.nombre}
                  style={{
                    display: "inline-block",
                    maxWidth: "360px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    verticalAlign: "bottom",
                    cursor: "help",
                  }}
                >
                  <strong>{splitNombre(d.nombre).marca}</strong>
                  {splitNombre(d.nombre).resto
                    ? " " + splitNombre(d.nombre).resto
                    : ""}
                </span>
              </td>
              <td>{toTitleCase(d.vtm)}</td>
              <td>{d.DISPOSITIVO}</td>
              <td>
                {[
                  d["ASMA (FT 4.1)"] === "Sí" ? "Asma" : null,
                  d["EPOC (FT 4.1)"] === "Sí" ? "EPOC" : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td>{d.labcomercializador}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 10 }}>
        Resultados: <b>{filtrados.length}</b>
      </p>
    </div>
  );
}

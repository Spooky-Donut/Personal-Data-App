import "./styles/Consulta.css";
import Back from "./BackButton.tsx";
import { useState } from "react";
import Busqueda from "./Busqueda.tsx";
import DetalleLog from "./DetalleLog.tsx";

function Logs() {
  const logs = [
    {
      id: 1,
      action: "crear_persona",
      date: new Date("2024-10-12T14:33:21"),
      person: 1000000000,
    },
    {
      id: 2,
      action: "editar_persona",
      date: new Date("2024-10-12T14:35:10"),
      person: 1000000000,
    },
    {
      id: 3,
      action: "buscar_persona",
      date: new Date("2024-10-12T14:36:44"),
      person: 2000000000,
    },
    {
      id: 4,
      action: "borrar_persona",
      date: new Date("2024-10-12T14:40:02"),
      person: 3000000000,
    },
    {
      id: 5,
      action: "listar_personas",
      date: new Date("2024-10-12T15:01:12"),
      person: null,
    },
    {
      id: 6,
      action: "crear_persona",
      date: new Date("2024-10-13T10:22:55"),
      person: 4000000000,
    },
    {
      id: 7,
      action: "buscar_persona",
      date: new Date("2024-10-13T10:30:31"),
      person: 6000000000,
    },
    {
      id: 8,
      action: "editar_persona",
      date: new Date("2024-10-13T11:12:08"),
      person: 5000000000,
    },
    {
      id: 9,
      action: "borrar_persona",
      date: new Date("2024-10-13T12:03:44"),
      person: 9000000000,
    },
    {
      id: 10,
      action: "listar_logs",
      date: new Date("2024-10-13T13:50:20"),
      person: null,
    },
    {
      id: 11,
      action: "buscar_persona",
      date: new Date("2024-10-14T09:15:00"),
      person: 7000000000,
    },
    {
      id: 12,
      action: "crear_persona",
      date: new Date("2024-10-14T09:18:27"),
      person: 8000000000,
    },
    {
      id: 13,
      action: "editar_persona",
      date: new Date("2024-10-14T09:22:10"),
      person: 8000000000,
    },
    {
      id: 14,
      action: "buscar_persona",
      date: new Date("2024-10-14T10:03:45"),
      person: 1200000000,
    },
    {
      id: 15,
      action: "borrar_persona",
      date: new Date("2024-10-14T10:09:13"),
      person: 1100000000,
    },
    {
      id: 16,
      action: "listar_personas",
      date: new Date("2024-10-14T11:22:55"),
      person: null,
    },
    {
      id: 17,
      action: "crear_persona",
      date: new Date("2024-10-14T11:55:33"),
      person: 1300000000,
    },
    {
      id: 18,
      action: "editar_persona",
      date: new Date("2024-10-14T12:14:40"),
      person: 1400000000,
    },
    {
      id: 19,
      action: "buscar_persona",
      date: new Date("2024-10-14T13:00:22"),
      person: 1500000000,
    },
    {
      id: 20,
      action: "listar_logs",
      date: new Date("2024-10-14T13:33:58"),
      person: null,
    },
  ];

  const [showTable, setShowTable] = useState(false);

  const [logg, setLog] = useState<any | null>(null);

  const handleBusqueda = (id: number) => {
    const encontrada = logs.find((p) => p.id === id);
    if (encontrada) {
      setLog(encontrada);
    } else {
      alert("No se encontró una persona con ese ID");
    }
  };

  return (
    <div className="body">
      <Back />
      <h1 className="tittle">Transacciones Registradas</h1>
      {!logg ? (
        <div>
          <Busqueda onBuscar={handleBusqueda} />
          <button onClick={() => setShowTable(true)}>
            Listar transacciones
          </button>
          {showTable && (
            <div className="table-container">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Log Id</th>
                    <th>Acción</th>
                    <th>Fecha</th>
                    <th>Hecho por</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.action}</td>
                      <td>{r.date.toLocaleDateString("es-CO")}</td>
                      <td>{r.person}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <DetalleLog logg={logg} edit={false} />
      )}
    </div>
  );
}

export default Logs;

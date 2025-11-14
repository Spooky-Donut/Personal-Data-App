import { useEffect, useState } from "react";
import type { LogType } from "./LogType.tsx";

interface DetallesProps {
  logg?: LogType;
  edit: boolean;
}

function DetalleLog({ logg }: DetallesProps) {
  const [id, setId] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [person, setPerson] = useState<string>("");

  useEffect(() => {
    setId(logg ? logg.id.toString() : "");
    setAction(logg?.action ?? "");
    setDate(logg?.date ? new Date(logg.date).toISOString().split("T")[0] : "");
    setPerson(logg ? logg.person.toString() : "");
  }, [logg]);

  return (
    <>
      <form className="data-form">
        <div className="form-in">
          <label htmlFor="id">Id</label>
          <input
            type="text"
            name="id"
            value={id}
            readOnly={true}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="form-in">
          <label htmlFor="action">Acción</label>
          <input
            type="text"
            name="action"
            value={action}
            readOnly={true}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        <div className="form-in">
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            name="date"
            value={date || ""}
            readOnly={true}
            disabled={true}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-in">
          <label htmlFor="person">Hecho por</label>
          <input
            type="text"
            name="person"
            value={person}
            readOnly={true}
            onChange={(e) => setPerson(e.target.value)}
          />
        </div>
      </form>
    </>
  );
}

export default DetalleLog;

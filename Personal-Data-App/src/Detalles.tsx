import { useEffect, useState } from "react";
import "./styles/Detalles.css";
import type { Persona } from "./Persona.tsx";

interface DetallesProps {
  persona?: Persona;
  edit: boolean;
}

function Detalles({ persona, edit }: DetallesProps) {
  const [fname, setFname] = useState<string>("");
  const [mname, setMname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [typeId, setTypeId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleCrear = () => {
    console.log("Crear persona");
  };

  const handleEditar = () => {
    console.log("Editar persona con ID:", persona?.id);
  };

  const handleBorrar = () => {
    console.log("Borrar persona con ID:", persona?.id);
  };

  useEffect(() => {
    setFname(persona?.first_name ?? "");
    setMname(persona?.middle_name ?? "");
    setLname(persona?.last_name ?? "");
    setTypeId(persona?.id_type ?? "");
    setId(persona ? persona.id.toString() : "");
    setDate(
      persona?.birthdate
        ? new Date(persona.birthdate).toISOString().split("T")[0]
        : ""
    );
    setGender(persona?.gender ?? "");
    setEmail(persona?.email ?? "");
    setPhone(persona ? persona.phone.toString() : "");
  }, [persona]);

  return (
    <>
      <form className="data-form">
        <div className="form-group">
          <div className="form-in">
            <label htmlFor="fname">Primer nombre</label>
            <input
              type="text"
              name="fname"
              value={fname}
              readOnly={!edit}
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className="form-in">
            <label htmlFor="mname">Segundo nombre</label>
            <input
              type="text"
              name="mname"
              value={mname}
              readOnly={!edit}
              onChange={(e) => setMname(e.target.value)}
            />
          </div>
          <div className="form-in">
            <label htmlFor="lname">Apellido</label>
            <input
              type="text"
              name="lname"
              value={lname}
              readOnly={!edit}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-in">
            <label htmlFor="id-type">Tipo de documento</label>
            <select
              id="id-type"
              value={typeId}
              disabled={!edit}
              onChange={(e) => setTypeId(e.target.value)}
            >
              <option value="">-- Elige una opción --</option>
              <option value="ti">Tarjeta de identidad</option>
              <option value="cc">Cédula</option>
            </select>
          </div>
          <div className="form-in">
            <label htmlFor="id">Número de identificación</label>
            <input
              type="text"
              name="id"
              value={id}
              readOnly={!edit}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-in">
            <label htmlFor="bdate">Fecha de nacimiento</label>
            <input
              type="date"
              name="bdate"
              value={date || ""}
              readOnly={!edit}
              disabled={!edit}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-in">
            <label htmlFor="gender">Género</label>
            <select
              id="gender"
              value={gender}
              disabled={!edit}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">-- Elige una opción --</option>
              <option value="m">Masculino</option>
              <option value="f">Femenino</option>
              <option value="nb">No binario</option>
              <option value="na">Prefiero no responder</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="form-in">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="text"
              name="email"
              value={email}
              readOnly={!edit}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-in">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={phone}
              readOnly={!edit}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {edit ? (
          persona ? (
            <button id="save-btn" type="button" onClick={handleEditar}>
              Guardar
            </button>
          ) : (
            <button id="save-btn" type="button" onClick={handleCrear}>
              Crear
            </button>
          )
        ) : (
          <button id="save-btn" type="button" onClick={handleBorrar}>
            Borrar
          </button>
        )}
      </form>
    </>
  );
}

export default Detalles;

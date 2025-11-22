import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import "../styles/Detalles.css";
import type { Persona } from "../types/Persona.tsx";

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
  const [photo, setPhoto] = useState<string>("");

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "pdate_upload");
    data.append("cloud_name", "dwlegrpg5");

    const res = await fetch(
      " https://api.cloudinary.com/v1_1/dwlegrpg5/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadedImage = await res.json();
    setPhoto(uploadedImage.secure_url);
  };

  const handleCrear = async () => {
    try {
      const body = {
        id_persona: id,
        primer_nombre: fname,
        segundo_nombre: mname || null,
        apellidos: lname,
        fecha_nacimiento: date,
        genero: gender,
        correo: email,
        celular: phone,
        tipo_documento: typeId,
        foto: photo,
      };

      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al crear persona:", errorData);
        alert("Error al crear persona");
        return;
      }

      const data = await response.json();
      console.log("Persona creada:", data);
      alert("Persona creada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      alert("Error inesperado al crear persona");
    }
  };

  const handleEditar = () => {};

  const handleBorrar = () => {};

  const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ]/g, "");
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");
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
    setPhoto(persona?.foto ?? "");
  }, [persona]);

  return (
    <>
      <form className="data-form">
        <div className="form-group">
          <img src={photo} alt="Foto" />
          <label htmlFor="photo">Foto</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            disabled={!edit}
            onChange={handleUpload}
          />
        </div>
        <div className="form-group">
          <div className="form-in">
            <label htmlFor="fname">Primer nombre</label>
            <input
              type="text"
              name="fname"
              maxLength={30}
              onInput={handleNameInput}
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
              maxLength={30}
              onInput={handleNameInput}
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
              maxLength={60}
              onInput={handleNameInput}
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
              minLength={10}
              maxLength={10}
              onInput={handleNumberInput}
              inputMode="numeric"
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
              minLength={10}
              maxLength={10}
              onInput={handleNumberInput}
              inputMode="numeric"
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

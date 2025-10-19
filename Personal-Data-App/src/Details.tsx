import { useState } from "react";
import "./styles/Details.css";

function Details() {
  const [selected, setSelected] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
  };

  return (
    <>
      <form className="data-form">
        <div className="form-group">
          <div className="form-in">
            <label htmlFor="fname">Primer nombre</label>
            <input type="text" name="fname" />
          </div>
          <div className="form-in">
            <label htmlFor="mname">Segundo nombre</label>
            <input type="text" name="mname" />
          </div>
          <div className="form-in">
            <label htmlFor="lname">Apellido</label>
            <input type="text" name="lname" />
          </div>
        </div>

        <div className="form-group">
          <div className="form-in">
            <label htmlFor="id-type">Tipo de documento</label>
            <select id="id-type" value={selected} onChange={handleChange}>
              <option value="">-- Elige una opción --</option>
              <option value="ti">Tarjeta de identidad</option>
              <option value="cc">Cédula</option>
            </select>
          </div>
          <div className="form-in">
            <label htmlFor="id">Número de identificación</label>
            <input type="text" name="id" />
          </div>
        </div>

        <div className="form-group">
          <div className="form-in">
            <label htmlFor="bdate">Fecha de nacimiento</label>
            <input type="date" name="bdate" />
          </div>
          <div className="form-in">
            <label htmlFor="gender">Género</label>
            <select id="gender" value={selected} onChange={handleChange}>
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
            <input type="text" name="email" />
          </div>
          <div className="form-in">
            <label htmlFor="phone">Teléfono</label>
            <input type="text" name="phone" />
          </div>
        </div>
        <button id="save-btn">Guardar</button>
      </form>
    </>
  );
}

export default Details;

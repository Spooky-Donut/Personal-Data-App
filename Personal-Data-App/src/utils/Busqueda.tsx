import { useState } from "react";

interface BusquedaProps {
  onBuscar: (id: number) => void;
}

function Busqueda({ onBuscar }: BusquedaProps) {
  const [id, setId] = useState<number | "">("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    setId(valor === "" ? "" : Number(valor));
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");
  };

  const handleBuscar = () => {
    if (id === "" || isNaN(Number(id))) {
      alert("No se pudo encontrar. Intente nuevamente.");
      return;
    }
    onBuscar(Number(id));
  };

  return (
    <>
      <input
        className="browser"
        type="text"
        name="search"
        minLength={10}
        maxLength={10}
        onInput={handleNumberInput}
        placeholder="Buscar por identificación"
        onChange={onChange}
      />
      <button onClick={handleBuscar}>Buscar</button>
    </>
  );
}

export default Busqueda;

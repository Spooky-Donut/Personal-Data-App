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

  const handleBuscar = () => {
    if (id === "" || isNaN(Number(id))) {
      alert("Por favor ingresa un valor válido");
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
        placeholder="Buscar por identificación"
        onChange={onChange}
      />
      <button onClick={handleBuscar}>Buscar</button>
    </>
  );
}

export default Busqueda;

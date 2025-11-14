import "./styles/App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <Link to={"/crear"} state={{ editar: true }}>
        Crear
      </Link>
      <Link to={"/consulta"}>Consulta</Link>
      <Link to={"/editar"}>Editar</Link>
      <Link to={"/borrar"}>Borrar</Link>
      <Link to={"/logs"}>Logs</Link>
    </>
  );
}

export default App;

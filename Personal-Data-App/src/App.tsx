import "./styles/App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="home-page">
      <h1 className="home-title">Personal Data App</h1>
      <p className="home-subtitle">Selecciona una opción para continuar:</p>

      <div className="home-links">
        <Link to="/crear" state={{ editar: true }}>
          Crear
        </Link>
        <Link to="/consulta">Consulta</Link>
        <Link to="/editar">Editar</Link>
        <Link to="/borrar">Borrar</Link>
        <Link to="/logs">Logs</Link>
      </div>
    </div>
  );
}

export default App;
import { Link } from "react-router-dom";
import "../styles/BackButton.css";

function Back() {
  return (
    <Link to={"/"} className="back-button">
      Volver
    </Link>
  );
}

export default Back;

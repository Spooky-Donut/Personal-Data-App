import Detalles from "../utils/Detalles.tsx";
import Back from "../utils/BackButton.tsx";

function Crear() {
  return (
    <div>
      <Back />
      <Detalles edit={true} />
    </div>
  );
}
export default Crear;

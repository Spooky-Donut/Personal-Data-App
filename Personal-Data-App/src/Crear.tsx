import Detalles from "./Detalles.tsx";
import Back from "./BackButton.tsx";

function Crear() {
  return (
    <div>
      <Back />
      <Detalles edit={true} />;
    </div>
  );
}
export default Crear;

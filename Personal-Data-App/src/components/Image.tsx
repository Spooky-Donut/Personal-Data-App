import type { ChangeEvent } from "react";
import Back from "../utils/BackButton.tsx";
import { useState } from "react";

function Imagen() {
  const [imageUrl, setImageUrl] = useState<string>("");

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
    setImageUrl(uploadedImage.secure_url);
  };

  return (
    <div>
      <Back />
      <img src={imageUrl} />
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
}
export default Imagen;

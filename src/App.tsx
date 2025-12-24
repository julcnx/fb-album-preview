import React, { useState } from "react";
import PhotoGrid from "./components/PhotoGrid";

export default function App() {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const urls = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setPhotos(urls);
  };

  return (
    <div className="app-container">
      <h1>FB Album Preview</h1>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      {photos.length > 0 && <PhotoGrid photos={photos} />}
    </div>
  );
}

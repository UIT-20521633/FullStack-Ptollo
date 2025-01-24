import React, { useEffect, useState } from "react";
import axios from "axios";
import { getImagesAPI } from "~/apis";

const UnsplashGallery = ({ onSave }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImagesAPI().then((data) => {
      setImages(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading images...</div>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt={image.alt}
          style={{
            width: "150px",
            height: "100px",
            cursor: "pointer",
            border: "2px solid transparent",
          }}
          onClick={() => onSave(image.url)}
        />
      ))}
    </div>
  );
};

export default UnsplashGallery;

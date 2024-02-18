import React, { useState, useRef } from "react";
import "./CanvasComponent.css";

const ImageSizeComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    {
      width: 0,
      height: 0,
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 400;
  const canvasHeight = 300;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setImageUrl(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
    };
  };

  const handleImageLoad = () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
      drawImageToCanvas(image);
    };
    image.onerror = () => {
      setError("Failed to load image");
    };
  };

  const drawImageToCanvas = (image: HTMLImageElement) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    canvas.addEventListener("mousemove", handleCanvasMouseMove);
    canvas.addEventListener("mouseleave", handleCanvasMouseLeave);
  };

  const handleCanvasMouseMove = (event: MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    try {
      const pixel = context.getImageData(x, y, 1, 1).data;
      const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      setHoveredColor(color);
    } catch (error) {
      // Handle the error, for example, show a message to the user
      console.error("Failed to get pixel data:", error);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredColor(null);
  };

  return (
    <div className="form">
      <div className="form__link">
        <input
          className="from__input-url"
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={handleInputChange}
        />
        <input
          className="from__input-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button onClick={handleImageLoad} className="form__btn-link">
          Загрузка изображения
        </button>
      </div>

      {error && <div>{error}</div>}
      {imageSize.width > 0 && imageSize.height > 0 && (
        <div>
          <p>Original Image Size:</p>
          <p>Width: {imageSize.width}</p>
          <p>Height: {imageSize.height}</p>
        </div>
      )}
      {hoveredColor && (
        <div className="hover__color">
          <p>Hovered Color:</p>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: hoveredColor,
            }}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
      />
    </div>
  );
};

export default ImageSizeComponent;

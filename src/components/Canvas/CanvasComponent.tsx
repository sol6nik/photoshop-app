import React, { useState, useRef } from "react";

const ImageSizeComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    {
      width: 0,
      height: 0,
    }
  );
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 400; // Фиксированная ширина канваса
  const canvasHeight = 300; // Фиксированная высота канваса

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
  };

  return (
    <div className="form">
      <input
        className="from__input-url"
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={handleInputChange}
      />
      <button onClick={handleImageLoad} className="form__btn-link">
        Загрузка изображения из URL
      </button>
      <input
        className="from__input-file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleImageLoad} className="form__btn-file">
        Загрузка изображения из файла
      </button>
      {error && <div>{error}</div>}
      {imageSize.width > 0 && imageSize.height > 0 && (
        <div>
          <p>Original Image Size:</p>
          <p>Width: {imageSize.width}</p>
          <p>Height: {imageSize.height}</p>
        </div>
      )}
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default ImageSizeComponent;

import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import API from "../api";

export default function Canvas() {
  const [label, setLabel] = useState("A");
  const canvasRef = useRef();

  const handleClear = () => canvasRef.current.clear();

  const handleSave = async () => {
    const imageData = canvasRef.current.getDataURL("image/png");
    await API.post("/save-sample", { image: imageData, label });
    alert(`Saved sample for ${label}`);
    handleClear();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <select
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="p-2 rounded-lg bg-gray-800 text-white"
      >
        {Array.from({ length: 26 }, (_, i) =>
          String.fromCharCode(65 + i)
        ).map((char) => (
          <option key={char} value={char}>
            {char}
          </option>
        ))}
      </select>

      <CanvasDraw
        ref={canvasRef}
        brushRadius={4}
        lazyRadius={0}
        canvasWidth={300}
        canvasHeight={300}
        className="border-4 border-gray-600 rounded-lg"
      />

      <div className="flex gap-4">
        <button onClick={handleClear} className="px-4 py-2 bg-red-500 rounded-lg">
          Clear
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-green-500 rounded-lg">
          Save Sample
        </button>
      </div>
    </div>
  );
}

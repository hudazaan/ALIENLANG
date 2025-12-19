import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import API from "../api"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Canvas() {
  const [label, setLabel] = useState("A");
  const [prediction, setPrediction] = useState(null);
  const [predictedWord, setPredictedWord] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const canvasRef = useRef();

  const [learningMode, setLearningMode] = useState(false);
  const [feedback, setFeedback] = useState(null); 

  const handleClear = () => {
    canvasRef.current.clearCanvas();
    setFeedback(null); 
  };

  const handleSave = async () => {
    try {
      const imageData = await canvasRef.current.exportImage("png");
      await API.post("/save-sample", { image: imageData, label });
      alert(`Saved sample for ${label}`);
      handleClear();
    } catch (err) {
      console.error("Error in handleSave:", err);
      alert("Error: " + err.message);
    }
  };

  const handlePredict = async () => {
    try {
      const imageData = await canvasRef.current.exportImage("png");
      const resp = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await resp.json();
      setPrediction(data);
      setShowCard(true); 

      if (learningMode) {
        if (data.symbol === label && data.confidence >= 0.8) {
          setFeedback("correct");
        } else {
          setFeedback("retry");
        }
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction error — make sure backend and ml-service are running");
    }
  };

  const handlePredictWord = async () => {
    try {
      let imageData = await canvasRef.current.exportImage("png");
      if (!imageData.startsWith("data:image")) {
        imageData = `data:image/png;base64,${imageData}`;
      }
      const resp = await API.post("/predict-word", { image: imageData });
      setPredictedWord(resp.data.word);
      setShowCard(true);
    } catch (err) {
      console.error("Word prediction error:", err);
      setPredictedWord("Error");
      setShowCard(true);
    }
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #001f3f, #007bff)",
    color: "white",
    borderRadius: "20px",
    padding: "0.6rem 2.7rem",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(0, 123, 255, 0.3)",
    transition: "transform 0.2s",
    marginBottom: "20px",
    width: "160px",
    textAlign: "center",
  };

  return (
    <div className="d-flex" style={{ height: "100vh", width: "100vw", backgroundColor: "#121212", overflow: "hidden" }}>

      <div
        className="d-flex flex-column align-items-center py-4"
        style={{
          width: "200px",
          backgroundColor: "#1a1a1a",
          borderRight: "2px solid #007bff",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >

        <button
          onClick={() => {
            setLearningMode(!learningMode);
            setFeedback(null);
          }}
          style={{
            width: "100%",
            marginBottom: "30px",
            marginTop: "90px", 
            padding: "0.5rem",
            borderRadius: "12px",
            border: "none",
            background: learningMode
              ? "linear-gradient(135deg, #0f5132, #198754)"
              : "linear-gradient(135deg, #3a3a3a, #6c757d)",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {learningMode ? "Learning Mode ON" : "Learning Mode OFF"}
        </button> 
        
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{
            width: "70px",
            marginBottom: "30px",
            padding: "0.5rem",
            borderRadius: "12px",
            border: "none",
            fontWeight: "600",
            backgroundColor: "#022a51ff",
            color: "white",
            textAlign: "center",
          }}
        >
          {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((char) => (
            <option key={char} value={char}>
              {char}
            </option>
          ))}
        </select>

        <button
          onClick={handleClear}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Clear
        </button>

        <button
          onClick={handleSave}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Save Sample
        </button>

        <button
          onClick={handlePredict}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Predict Symbol
        </button>

        <button
          onClick={handlePredictWord}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Predict Word
        </button>
      </div>

      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
        <div
          className="border border-light rounded-3 bg-white mt-4"
          style={{ width: "940px", height: "510px", padding: "10px", marginRight: "120px" }}
        >
          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="100%"
            strokeWidth={5}
            strokeColor="black"
          />
        </div>

        <AnimatePresence>
          {showCard && (
            <motion.div
              className="position-fixed top-50 start-50 translate-middle bg-dark text-white p-4 rounded-4 shadow-lg border border-primary"
              style={{ width: "320px", zIndex: 1050 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <h5 className="text-center mb-3">Prediction Result</h5>

              {prediction && (
                <>
                  <p className="mb-1 text-center">
                    <strong>Symbol:</strong> {prediction.symbol}
                  </p>
                  <p className="mb-3 text-center">
                    <strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%
                  </p>
                </>
              )}

            {learningMode && feedback && (
              <p
                className="text-center fw-bold"
                style={{
                  color: feedback === "correct" ? "#00ff9c" : "#ff6b6b",
                }}
              >
                {feedback === "correct"
                  ? "Correct! Great handwriting ✅"
                  : "Poor Handwriting! Practice again ✍️"}
              </p>
            )}

              {predictedWord && (
                <p className="mb-3 text-center">
                  <strong>Word:</strong> {predictedWord}
                </p>
              )}

              <div className="text-center">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => {
                    setShowCard(false);
                    setPredictedWord(null);
                    setPrediction(null);
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

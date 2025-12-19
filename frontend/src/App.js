import React from "react";
import Canvas from "./components/Canvas";
import Header from "./components/Header";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center bg-dark text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-100"
      >
        <Header />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-100"
      >
        <Canvas />
      </motion.div>
    </div>
  );
}

export default App;

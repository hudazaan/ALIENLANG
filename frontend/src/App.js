import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Result from "./components/Result";
import Header from "./components/Header";
import { motion } from "framer-motion";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <Header />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8 w-full max-w-2xl"
      >
        <Canvas setResult={setResult} />
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 w-full max-w-lg"
        >
          <Result data={result} />
        </motion.div>
      )}
    </div>
  );
}

export default App;

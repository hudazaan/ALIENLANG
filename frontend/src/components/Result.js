import React from "react";
import { motion } from "framer-motion";

export default function Result({ data }) {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-xl shadow-lg text-center"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-indigo-400">
        Predicted Symbol: {data.symbol}
      </h2>
      <p className="text-sm text-gray-300 mt-2">
        Confidence: {(data.confidence * 100).toFixed(2)}%
      </p>
    </motion.div>
  );
}

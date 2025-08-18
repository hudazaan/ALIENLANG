import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 rounded-2xl shadow-lg"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center">🛸 Alien Language Detector</h1>
      <p className="text-center mt-2 text-sm">Draw an alien symbol and let the AI decode it!</p>
    </motion.header>
  );
}

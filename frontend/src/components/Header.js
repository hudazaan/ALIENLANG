import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      className="text-white py-3 px-4 shadow-sm fixed-top"
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #001f3f, #007bff)",
        boxShadow: "0 0 20px rgba(0, 123, 255, 0.3)",
        zIndex: 1000
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="fs-4 fw-semibold mb-1 text-center">Alien Language Detector</h1>
      <p className="mb-0 small text-center">
        Draw and let XenoGlyph decode it.
      </p>
    </motion.header>
  );
}


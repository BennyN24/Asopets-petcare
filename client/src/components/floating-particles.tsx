import * as React from "react";
import { motion } from "framer-motion";

interface FloatingParticlesProps {
  show: boolean;
}

export default function FloatingParticles({ show }: FloatingParticlesProps) {
  const particles = Array.from({ length: 8 }, (_, i) => i);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0,
            opacity: 0 
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedPetMascotProps {
  isScanning: boolean;
  scanSuccess: boolean;
  petCategory?: string;
}

const petMascots = {
  dog: "🐕",
  cat: "🐱", 
  bird: "🐦",
  rabbit: "🐰",
  horse: "🐴",
  exotic: "🦎",
  other: "🐾"
};

export default function AnimatedPetMascot({ isScanning, scanSuccess, petCategory = "other" }: AnimatedPetMascotProps) {
  const mascot = petMascots[petCategory as keyof typeof petMascots] || petMascots.other;
  
  const scanningAnimation = {
    initial: { rotate: 0, scale: 1 },
    animate: { 
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const successAnimation = {
    initial: { scale: 1, y: 0 },
    animate: {
      scale: [1, 1.3, 1.1],
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const idleAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.div
        className="text-6xl"
        variants={scanSuccess ? successAnimation : isScanning ? scanningAnimation : idleAnimation}
        initial="initial"
        animate="animate"
      >
        {mascot}
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
              />
              <span className="text-sm text-blue-600 font-medium">Looking for QR codes...</span>
            </div>
          </motion.div>
        )}
        
        {scanSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="text-green-600 text-lg font-semibold"
            >
              🎉 Found a pet!
            </motion.div>
          </motion.div>
        )}
        
        {!isScanning && !scanSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 text-sm"
          >
            Ready to scan pet QR codes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
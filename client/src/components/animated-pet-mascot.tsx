import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";


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
  
  const getAnimationClass = () => {
    if (scanSuccess) {
      return "animate-bounce";
    } else if (isScanning) {
      return "animate-pulse";
    } else {
      return "animate-pulse";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`text-6xl transition-all duration-500 ${getAnimationClass()}`}
        style={{
          transform: scanSuccess ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {mascot}
      </div>
      
      <div className="text-center min-h-[2rem]">
        {isScanning && (
          <div className="flex items-center space-x-2 justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Looking for QR codes...</span>
          </div>
        )}
        
        {scanSuccess && (
          <div className="text-green-600 text-lg font-semibold animate-pulse">
            🎉 Found a pet!
          </div>
        )}
        
        {!isScanning && !scanSuccess && (
          <div className="text-center text-gray-500 text-sm">
            Ready to scan pet QR codes
          </div>
        )}
      </div>
    </div>
  );
}
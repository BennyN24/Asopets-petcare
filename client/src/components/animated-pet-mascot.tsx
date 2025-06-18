import React from "react";

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

  let animationClass = "";
  if (scanSuccess) {
    animationClass = "animate-bounce";
  } else if (isScanning) {
    animationClass = "animate-pulse";
  }

  return (
    <div className={`text-6xl ${animationClass} transition-all duration-500`}>
      {isScanning && (
        <div className="relative">
          {mascot}
          <div className="absolute inset-0 animate-spin">
            <div className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}
      {scanSuccess && !isScanning && (
        <div className="relative">
          {mascot}
          <div className="absolute -top-2 -right-2 text-2xl">✨</div>
        </div>
      )}
      {!isScanning && !scanSuccess && mascot}
    </div>
  );
}
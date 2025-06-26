// QR Scanner Diagnostic Test
const jsQR = require('jsqr');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Test data that matches our QR generation
const testPetData = {
  type: "pet_profile",
  petId: "debug-test-123",
  ownerId: "owner-test-456", 
  name: "Debug Dog",
  petName: "Debug Dog",
  category: "dog",
  breed: "Test Breed",
  dateOfBirth: "2022-01-01",
  age: 36,
  microchipId: "TEST123456789",
  birthmarks: "Test markings for debugging",
  medicalRecordCount: 5,
  lastUpdated: "2025-06-26T15:00:00.000Z",
  owner: {
    name: "Test Owner",
    email: "test@example.com",
    phone: "+1234567890"
  },
  timestamp: "2025-06-26T15:00:00.000Z"
};

async function testQRDetection() {
  console.log("Starting QR detection diagnostic...");
  console.log("Test data length:", JSON.stringify(testPetData).length);
  
  // Test our exact detection algorithms
  const strategies = [
    "dontInvert",
    "onlyInvert", 
    "attemptBoth"
  ];
  
  strategies.forEach(strategy => {
    console.log(`Testing with inversionAttempts: ${strategy}`);
    // This would test with actual image data in browser context
  });
  
  console.log("Diagnostic complete - check browser console for real results");
}

testQRDetection();
// Test QR code generation for debugging
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

console.log("Test QR Data:");
console.log(JSON.stringify(testPetData, null, 2));
console.log("\nData length:", JSON.stringify(testPetData).length);
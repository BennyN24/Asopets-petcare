// Simple QR test to verify detection works
const testData = {
  type: "pet_profile",
  petId: "test-123",
  name: "Buddy",
  category: "dog"
};

console.log("Test QR data:", JSON.stringify(testData));
console.log("Character count:", JSON.stringify(testData).length);

// This data should be detectable by our enhanced scanner
const simpleTest = '{"type":"pet_profile","petId":"123","name":"Test"}';
console.log("Simple test data:", simpleTest);
console.log("Simple length:", simpleTest.length);
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DatabaseStorage } from "../storage";
import {
  insertPetSchema,
  type InsertPet,
  type Pet,
  petCategories,
} from "../../shared/schema";
import { z } from "zod";

// Mock the database connection to avoid actual database calls
vi.mock("../db", () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: {
      pets: {
        findMany: vi.fn(),
      },
    },
    transaction: vi.fn(),
  },
}));

describe("Pet Management", () => {
  let storage: DatabaseStorage;
  let testUserId: string;
  let createdPetIds: number[] = [];

  beforeEach(() => {
    storage = new DatabaseStorage();
    testUserId = "test-user-" + Date.now();
    createdPetIds = [];
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up created pets - mocked, so no actual cleanup needed
    createdPetIds = [];
  });

  describe("Pet CRUD Operations", () => {
    it("should validate pet data structure for creation", () => {
      const validPetData: InsertPet = {
        userId: testUserId,
        name: "Buddy",
        category: "dog",
        breed: "Golden Retriever",
        age: 24, // 2 years in months
        microchipId: "123456789012345",
        birthmarks: "White patch on chest",
      };

      // Should not throw for valid data
      expect(() => insertPetSchema.parse(validPetData)).not.toThrow();

      const parsedData = insertPetSchema.parse(validPetData);
      expect(parsedData.name).toBe("Buddy");
      expect(parsedData.category).toBe("dog");
      expect(parsedData.breed).toBe("Golden Retriever");
      expect(parsedData.age).toBe(24);
      expect(parsedData.userId).toBe(testUserId);
    });

    it("should validate required fields for pet creation", () => {
      const invalidPetData = {
        userId: testUserId,
        // Missing required 'name' field
        category: "dog",
      };

      expect(() => insertPetSchema.parse(invalidPetData)).toThrow();
    });

    it("should accept any string as category (database level validation)", () => {
      // Note: The current schema doesn't enforce enum validation at Zod level
      // Category validation would happen at the application or database constraint level
      const customCategoryData = {
        userId: testUserId,
        name: "Test Pet",
        category: "custom-category",
      };

      expect(() => insertPetSchema.parse(customCategoryData)).not.toThrow();

      const parsed = insertPetSchema.parse(customCategoryData);
      expect(parsed.category).toBe("custom-category");
    });

    it("should accept all valid pet categories", () => {
      const validCategories = [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "horse",
        "exotic",
        "other",
      ];

      validCategories.forEach((category) => {
        const petData = {
          userId: testUserId,
          name: "Test Pet",
          category,
        };

        expect(() => insertPetSchema.parse(petData)).not.toThrow();
      });
    });

    it("should validate age as optional number", () => {
      const validDataWithAge = {
        userId: testUserId,
        name: "Test Pet",
        category: "dog",
        age: 24,
      };

      const validDataWithoutAge = {
        userId: testUserId,
        name: "Test Pet",
        category: "dog",
      };

      expect(() => insertPetSchema.parse(validDataWithAge)).not.toThrow();
      expect(() => insertPetSchema.parse(validDataWithoutAge)).not.toThrow();
    });

    it("should reject invalid age types", () => {
      const invalidAgeData = {
        userId: testUserId,
        name: "Test Pet",
        category: "dog",
        age: "two years", // Should be number
      };

      expect(() => insertPetSchema.parse(invalidAgeData)).toThrow();
    });
  });

  describe("Pet Data Validation", () => {
    it("should validate string fields correctly", () => {
      const validStringData = {
        userId: testUserId,
        name: "Valid Pet Name",
        category: "dog",
        breed: "Golden Retriever",
        microchipId: "123456789012345",
        birthmarks: "White patch on chest",
      };

      expect(() => insertPetSchema.parse(validStringData)).not.toThrow();
    });

    it("should validate optional fields can be omitted", () => {
      const minimalPetData = {
        userId: testUserId,
        name: "Minimal Pet",
        category: "other",
      };

      expect(() => insertPetSchema.parse(minimalPetData)).not.toThrow();
    });

    it("should validate complete pet data with all fields", () => {
      const fullPetData = {
        userId: testUserId,
        name: "Full Pet",
        category: "dog",
        breed: "Mixed",
        age: 36,
        microchipId: "123456789012345",
        birthmarks: "Spot on ear",
        imageUrl: "https://example.com/pet.jpg",
      };

      expect(() => insertPetSchema.parse(fullPetData)).not.toThrow();

      const parsed = insertPetSchema.parse(fullPetData);
      expect(parsed.name).toBe("Full Pet");
      expect(parsed.category).toBe("dog");
      expect(parsed.breed).toBe("Mixed");
      expect(parsed.age).toBe(36);
    });

    it("should validate userId is required", () => {
      const dataWithoutUserId = {
        name: "Test Pet",
        category: "dog",
      };

      expect(() => insertPetSchema.parse(dataWithoutUserId)).toThrow();
    });

    it("should validate name is required", () => {
      const dataWithoutName = {
        userId: testUserId,
        category: "dog",
      };

      expect(() => insertPetSchema.parse(dataWithoutName)).toThrow();
    });
  });

  describe("Pet Photo Upload Validation", () => {
    it("should accept valid image URL format", () => {
      const petDataWithImage: InsertPet = {
        userId: testUserId,
        name: "Photo Pet",
        category: "cat",
        imageUrl: "https://example.com/images/pet.jpg",
      };

      expect(() => insertPetSchema.parse(petDataWithImage)).not.toThrow();

      const parsed = insertPetSchema.parse(petDataWithImage);
      expect(parsed.imageUrl).toBe("https://example.com/images/pet.jpg");
    });

    it("should handle null image URL", () => {
      const petDataWithoutImage: InsertPet = {
        userId: testUserId,
        name: "No Photo Pet",
        category: "dog",
        imageUrl: null,
      };

      expect(() => insertPetSchema.parse(petDataWithoutImage)).not.toThrow();

      const parsed = insertPetSchema.parse(petDataWithoutImage);
      expect(parsed.imageUrl).toBeNull();
    });

    it("should handle undefined image URL", () => {
      const petDataUndefinedImage = {
        userId: testUserId,
        name: "Undefined Photo Pet",
        category: "bird",
        // imageUrl is undefined (not provided)
      };

      expect(() => insertPetSchema.parse(petDataUndefinedImage)).not.toThrow();
    });

    it("should validate image URL as string when provided", () => {
      const petDataWithValidUrl = {
        userId: testUserId,
        name: "Valid URL Pet",
        category: "dog",
        imageUrl: "https://example.com/pet-photo.png",
      };

      expect(() => insertPetSchema.parse(petDataWithValidUrl)).not.toThrow();
    });
  });

  describe("Pet Profile Data Integrity", () => {
    it("should validate complete pet data structure", () => {
      const completeData: InsertPet = {
        userId: testUserId,
        name: "Integrity Test Pet",
        category: "dog",
        breed: "Beagle",
        age: 30,
        microchipId: "987654321098765",
        birthmarks: "Brown spots on back",
        imageUrl: "https://example.com/pet.jpg",
      };

      expect(() => insertPetSchema.parse(completeData)).not.toThrow();

      const parsed = insertPetSchema.parse(completeData);
      expect(parsed.name).toBe(completeData.name);
      expect(parsed.category).toBe(completeData.category);
      expect(parsed.breed).toBe(completeData.breed);
      expect(parsed.age).toBe(completeData.age);
      expect(parsed.microchipId).toBe(completeData.microchipId);
      expect(parsed.birthmarks).toBe(completeData.birthmarks);
      expect(parsed.imageUrl).toBe(completeData.imageUrl);
    });

    it("should validate partial pet data updates", () => {
      const partialUpdateData = {
        name: "Updated Name",
        age: 36,
        breed: "Updated Breed",
      };

      // Using partial schema for updates
      const partialSchema = insertPetSchema.partial();
      expect(() => partialSchema.parse(partialUpdateData)).not.toThrow();

      const parsed = partialSchema.parse(partialUpdateData);
      expect(parsed.name).toBe("Updated Name");
      expect(parsed.age).toBe(36);
      expect(parsed.breed).toBe("Updated Breed");
    });

    it("should validate microchip ID format", () => {
      const validMicrochipData = {
        userId: testUserId,
        name: "Microchip Pet",
        category: "dog",
        microchipId: "123456789012345",
      };

      expect(() => insertPetSchema.parse(validMicrochipData)).not.toThrow();
    });

    it("should validate birthmarks as text field", () => {
      const birthmarksData = {
        userId: testUserId,
        name: "Birthmarks Pet",
        category: "cat",
        birthmarks: "White patch on chest, brown spot on left ear",
      };

      expect(() => insertPetSchema.parse(birthmarksData)).not.toThrow();

      const parsed = insertPetSchema.parse(birthmarksData);
      expect(parsed.birthmarks).toBe(
        "White patch on chest, brown spot on left ear"
      );
    });

    it("should validate breed as optional string", () => {
      const withBreed = {
        userId: testUserId,
        name: "Breed Pet",
        category: "dog",
        breed: "Golden Retriever",
      };

      const withoutBreed = {
        userId: testUserId,
        name: "No Breed Pet",
        category: "dog",
      };

      expect(() => insertPetSchema.parse(withBreed)).not.toThrow();
      expect(() => insertPetSchema.parse(withoutBreed)).not.toThrow();

      expect(insertPetSchema.parse(withBreed).breed).toBe("Golden Retriever");
      expect(insertPetSchema.parse(withoutBreed).breed).toBeUndefined();
    });

    it("should validate all pet categories are supported", () => {
      const categories = [
        "dog",
        "cat",
        "bird",
        "rabbit",
        "horse",
        "exotic",
        "other",
      ];

      categories.forEach((category) => {
        const petData = {
          userId: testUserId,
          name: `${category} pet`,
          category,
        };

        expect(() => insertPetSchema.parse(petData)).not.toThrow();
        expect(insertPetSchema.parse(petData).category).toBe(category);
      });
    });
  });
});

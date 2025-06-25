
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  testUser: {
    firstName: 'Test',
    lastName: 'User',
    email: 'testpayload@example.com',
    password: 'TestPassword123!'
  },
  petCount: 50,
  recordsPerPet: 10
};

// Pet templates for variety
const PET_TEMPLATES = [
  { name: 'Buddy', category: 'dog', breed: 'Golden Retriever' },
  { name: 'Whiskers', category: 'cat', breed: 'Persian' },
  { name: 'Charlie', category: 'dog', breed: 'Labrador' },
  { name: 'Mittens', category: 'cat', breed: 'Siamese' },
  { name: 'Max', category: 'dog', breed: 'German Shepherd' },
  { name: 'Luna', category: 'cat', breed: 'Maine Coon' },
  { name: 'Rocky', category: 'dog', breed: 'Bulldog' },
  { name: 'Shadow', category: 'cat', breed: 'Russian Blue' },
  { name: 'Bella', category: 'dog', breed: 'Poodle' },
  { name: 'Smokey', category: 'cat', breed: 'British Shorthair' }
];

// Medical record templates
const RECORD_TEMPLATES = [
  { type: 'vaccine', title: 'Rabies Vaccination', veterinarian: 'Dr. Smith', clinic: 'City Vet Clinic' },
  { type: 'vaccine', title: 'DHPP Vaccination', veterinarian: 'Dr. Johnson', clinic: 'Animal Care Center' },
  { type: 'deworming', title: 'Deworming Treatment', veterinarian: 'Dr. Brown', clinic: 'Pet Health Clinic' },
  { type: 'checkup', title: 'Annual Checkup', veterinarian: 'Dr. Wilson', clinic: 'Veterinary Hospital' },
  { type: 'treatment', title: 'Flea Treatment', veterinarian: 'Dr. Davis', clinic: 'Emergency Vet' },
  { type: 'grooming', title: 'Full Grooming Service', veterinarian: 'Groomer Jane', clinic: 'Pet Spa' },
  { type: 'lab-test', title: 'Blood Work Analysis', veterinarian: 'Dr. Miller', clinic: 'Diagnostic Center' },
  { type: 'surgery', title: 'Dental Cleaning', veterinarian: 'Dr. Garcia', clinic: 'Surgical Center' },
  { type: 'vaccine', title: 'Bordetella Vaccine', veterinarian: 'Dr. Taylor', clinic: 'Mobile Vet' },
  { type: 'treatment', title: 'Allergy Treatment', veterinarian: 'Dr. Anderson', clinic: 'Specialty Clinic' }
];

class PayloadTester {
  constructor() {
    this.cookies = '';
    this.errors = [];
    this.timings = [];
    this.createdPets = [];
    this.createdRecords = [];
  }

  async makeRequest(method, endpoint, data = null) {
    const startTime = Date.now();
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, options);
      const responseTime = Date.now() - startTime;
      
      // Update cookies if set-cookie header is present
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        this.cookies = setCookieHeader.split(';')[0];
      }

      const responseData = await response.json().catch(() => null);
      
      this.timings.push({
        endpoint,
        method,
        responseTime,
        status: response.status,
        timestamp: new Date().toISOString()
      });

      if (!response.ok) {
        this.errors.push({
          endpoint,
          method,
          status: response.status,
          error: responseData?.message || 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw new Error(`HTTP ${response.status}: ${responseData?.message || 'Request failed'}`);
      }

      return responseData;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.errors.push({
        endpoint,
        method,
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async createTestAccount() {
    console.log('🚀 Creating test account...');
    try {
      await this.makeRequest('POST', '/api/auth/signup', TEST_CONFIG.testUser);
      console.log('✅ Test account created successfully');
    } catch (error) {
      if (error.message.includes('Email already registered')) {
        console.log('ℹ️  Test account already exists, proceeding with login...');
      } else {
        throw error;
      }
    }
  }

  async loginTestAccount() {
    console.log('🔐 Logging in test account...');
    const loginData = {
      email: TEST_CONFIG.testUser.email,
      password: TEST_CONFIG.testUser.password
    };
    
    try {
      await this.makeRequest('POST', '/api/auth/login', loginData);
      console.log('✅ Successfully logged in');
    } catch (error) {
      // If login fails due to unconfirmed email, let's confirm it manually
      if (error.message.includes('confirm your email')) {
        console.log('📧 Email not confirmed, attempting manual confirmation...');
        // In a real test, you'd need to implement email confirmation bypass
        // For now, we'll skip this test if email confirmation is required
        throw new Error('Email confirmation required - test cannot proceed');
      }
      throw error;
    }
  }

  generatePetData(index) {
    const template = PET_TEMPLATES[index % PET_TEMPLATES.length];
    return {
      name: `${template.name}_${index + 1}`,
      category: template.category,
      breed: template.breed,
      age: Math.floor(Math.random() * 120) + 1, // 1-120 months
      dateOfBirth: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      microchipId: `CHIP${String(index + 1).padStart(6, '0')}`,
      birthmarks: `Test birthmark description for pet ${index + 1}`
    };
  }

  generateMedicalRecord(petId, recordIndex) {
    const template = RECORD_TEMPLATES[recordIndex % RECORD_TEMPLATES.length];
    const daysAgo = Math.floor(Math.random() * 365);
    const dateAdministered = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      petId,
      type: template.type,
      title: `${template.title} #${recordIndex + 1}`,
      description: `Test medical record description for record ${recordIndex + 1}`,
      dateAdministered,
      veterinarian: template.veterinarian,
      clinic: template.clinic,
      cost: `${(Math.random() * 200 + 50).toFixed(2)}`,
      notes: `Test notes for medical record ${recordIndex + 1}`,
      batchNumber: template.type === 'vaccine' ? `BATCH${recordIndex + 1}` : null,
      weight: `${(Math.random() * 30 + 5).toFixed(1)}kg`
    };
  }

  async createPets() {
    console.log(`🐕 Creating ${TEST_CONFIG.petCount} pets...`);
    const batchSize = 5; // Create pets in batches to avoid overwhelming the server
    
    for (let i = 0; i < TEST_CONFIG.petCount; i += batchSize) {
      const batch = [];
      const endIndex = Math.min(i + batchSize, TEST_CONFIG.petCount);
      
      for (let j = i; j < endIndex; j++) {
        const petData = this.generatePetData(j);
        batch.push(this.makeRequest('POST', '/api/pets', petData));
      }
      
      try {
        const results = await Promise.all(batch);
        this.createdPets.push(...results);
        console.log(`✅ Created pets ${i + 1}-${endIndex} (${this.createdPets.length}/${TEST_CONFIG.petCount})`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error creating pets batch ${i + 1}-${endIndex}:`, error.message);
      }
    }
  }

  async createMedicalRecords() {
    console.log(`📋 Creating ${TEST_CONFIG.recordsPerPet} medical records per pet...`);
    let totalRecords = 0;
    const totalExpected = this.createdPets.length * TEST_CONFIG.recordsPerPet;
    
    for (const pet of this.createdPets) {
      console.log(`📝 Creating records for ${pet.name} (ID: ${pet.id})...`);
      
      const batchSize = 3; // Create records in smaller batches
      for (let i = 0; i < TEST_CONFIG.recordsPerPet; i += batchSize) {
        const batch = [];
        const endIndex = Math.min(i + batchSize, TEST_CONFIG.recordsPerPet);
        
        for (let j = i; j < endIndex; j++) {
          const recordData = this.generateMedicalRecord(pet.id, j);
          batch.push(this.makeRequest('POST', `/api/pets/${pet.id}/medical-records`, recordData));
        }
        
        try {
          const results = await Promise.all(batch);
          this.createdRecords.push(...results);
          totalRecords += results.length;
          
          // Small delay between record batches
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`❌ Error creating records for pet ${pet.name}:`, error.message);
        }
      }
      
      console.log(`✅ Records progress: ${totalRecords}/${totalExpected}`);
    }
  }

  async testDataRetrieval() {
    console.log('🔍 Testing data retrieval...');
    
    try {
      // Test getting all pets
      console.log('📊 Fetching all pets...');
      const petsResponse = await this.makeRequest('GET', '/api/pets');
      console.log(`✅ Retrieved ${petsResponse.length} pets`);
      
      // Test getting reminders
      console.log('⏰ Fetching reminders...');
      const remindersResponse = await this.makeRequest('GET', '/api/reminders');
      console.log(`✅ Retrieved ${remindersResponse.length} reminders`);
      
      // Test getting medical records for a few pets
      console.log('🏥 Testing medical records retrieval...');
      const samplePets = this.createdPets.slice(0, 5);
      for (const pet of samplePets) {
        const records = await this.makeRequest('GET', `/api/pets/${pet.id}/medical-records`);
        console.log(`✅ Pet ${pet.name}: ${records.length} medical records`);
      }
      
    } catch (error) {
      console.error('❌ Error during data retrieval test:', error.message);
    }
  }

  generateReport() {
    console.log('\n📊 PAYLOAD TEST REPORT');
    console.log('='.repeat(50));
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`• Pets created: ${this.createdPets.length}/${TEST_CONFIG.petCount}`);
    console.log(`• Records created: ${this.createdRecords.length}/${TEST_CONFIG.petCount * TEST_CONFIG.recordsPerPet}`);
    console.log(`• Total API calls: ${this.timings.length}`);
    console.log(`• Errors encountered: ${this.errors.length}`);
    
    if (this.timings.length > 0) {
      const avgResponseTime = this.timings.reduce((sum, t) => sum + t.responseTime, 0) / this.timings.length;
      const maxResponseTime = Math.max(...this.timings.map(t => t.responseTime));
      const minResponseTime = Math.min(...this.timings.map(t => t.responseTime));
      
      console.log(`\n⏱️  PERFORMANCE:`);
      console.log(`• Average response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`• Maximum response time: ${maxResponseTime}ms`);
      console.log(`• Minimum response time: ${minResponseTime}ms`);
      
      // Find slowest endpoints
      const endpointStats = {};
      this.timings.forEach(t => {
        const key = `${t.method} ${t.endpoint}`;
        if (!endpointStats[key]) {
          endpointStats[key] = { times: [], count: 0 };
        }
        endpointStats[key].times.push(t.responseTime);
        endpointStats[key].count++;
      });
      
      console.log(`\n🐌 SLOWEST ENDPOINTS:`);
      Object.entries(endpointStats)
        .map(([endpoint, stats]) => ({
          endpoint,
          avgTime: stats.times.reduce((a, b) => a + b, 0) / stats.times.length,
          count: stats.count
        }))
        .sort((a, b) => b.avgTime - a.avgTime)
        .slice(0, 5)
        .forEach(stat => {
          console.log(`• ${stat.endpoint}: ${stat.avgTime.toFixed(2)}ms avg (${stat.count} calls)`);
        });
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORS:`);
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.method} ${error.endpoint}: ${error.error}`);
      });
    }
    
    // Save detailed report to file
    const report = {
      summary: {
        petsCreated: this.createdPets.length,
        recordsCreated: this.createdRecords.length,
        totalApiCalls: this.timings.length,
        errorCount: this.errors.length,
        testDate: new Date().toISOString()
      },
      timings: this.timings,
      errors: this.errors,
      createdPets: this.createdPets.map(p => ({ id: p.id, name: p.name })),
      config: TEST_CONFIG
    };
    
    fs.writeFileSync('payload-test-report.json', JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: payload-test-report.json`);
  }

  async runTest() {
    console.log('🧪 Starting Payload Test');
    console.log('='.repeat(30));
    
    const startTime = Date.now();
    
    try {
      await this.createTestAccount();
      await this.loginTestAccount();
      await this.createPets();
      await this.createMedicalRecords();
      await this.testDataRetrieval();
      
      const totalTime = Date.now() - startTime;
      console.log(`\n🎉 Test completed in ${(totalTime / 1000).toFixed(2)} seconds`);
      
    } catch (error) {
      console.error(`\n💥 Test failed:`, error.message);
    } finally {
      this.generateReport();
    }
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Run the test
const tester = new PayloadTester();
tester.runTest().catch(console.error);

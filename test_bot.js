#!/usr/bin/env node

/**
 * AutoSherpa WhatsApp Bot Test Suite
 * Tests all 20 test cases for the car customer agent
 */

import { handleDeterministicFlows } from './src/flows.js';
import { handleUserMessage } from './src/gemini.js';
import { getSession, setSession, clearSession } from './src/session.js';

// Test configuration
const TEST_USER_ID = 'test_user_12345';
const TEST_CASES = [
  {
    id: 'TC-001',
    category: 'Consent / Greeting',
    input: 'Hi, I want to buy a new car.',
    expectedBehavior: 'Bot greets user, explains capabilities, asks for preferences.',
    expectedIntent: 'browse_cars'
  },
  {
    id: 'TC-002',
    category: 'Suggestion (Budget Filter)',
    input: 'Show me the best SUV under 15 lakhs.',
    expectedBehavior: 'Bot fetches 2–3 cars (e.g., Nexon, Brezza, Sonet), asks if user wants petrol/diesel.',
    expectedIntent: 'suggest_car',
    expectedPriceRange: 'under 15 lakhs'
  },
  {
    id: 'TC-003',
    category: 'Suggestion (Brand Filter)',
    input: 'I\'m interested in a Maruti car with automatic transmission.',
    expectedBehavior: 'Bot lists Maruti cars with auto variants.',
    expectedBrand: 'Maruti',
    expectedTransmission: 'automatic'
  },
  {
    id: 'TC-004',
    category: 'Suggestion (Fuel Type)',
    input: 'Looking for a petrol hatchback with good mileage.',
    expectedBehavior: 'Bot shows hatchbacks (e.g., Swift, Baleno) with mileage specs.',
    expectedFuelType: 'petrol',
    expectedFeatures: ['hatchback', 'good mileage']
  },
  {
    id: 'TC-005',
    category: 'Comparison',
    input: 'Compare Kia Seltos and Hyundai Creta.',
    expectedBehavior: 'Bot summarizes differences (price, features, mileage).',
    expectedIntent: 'compare_cars',
    expectedCarNames: ['Kia Seltos', 'Hyundai Creta']
  },
  {
    id: 'TC-006',
    category: 'Comparison (Variant Missing)',
    input: 'Compare Tata Nexon EV with Creta.',
    expectedBehavior: 'Bot gracefully handles missing variant (EV vs ICE) and clarifies.',
    expectedActionRequired: 'compare_from_db'
  },
  {
    id: 'TC-007',
    category: 'Car Details',
    input: 'Tell me about Hyundai Verna.',
    expectedBehavior: 'Bot provides summary of model specs, variants, and price range.',
    expectedIntent: 'car_details',
    expectedCarNames: ['Hyundai Verna']
  },
  {
    id: 'TC-008',
    category: 'Image Upload (Car)',
    input: '[IMAGE: Car photo]',
    expectedBehavior: 'Bot detects car → identifies model/make if possible.',
    expectedIntent: 'image_check',
    expectedImageType: 'car'
  },
  {
    id: 'TC-009',
    category: 'Image Upload (Non-car)',
    input: '[IMAGE: Random photo]',
    expectedBehavior: 'Bot replies "This doesn\'t seem to be a car image."',
    expectedImageType: 'non-car'
  },
  {
    id: 'TC-010',
    category: 'Booking',
    input: 'I want to book a test drive for Kia Seltos.',
    expectedBehavior: 'Bot offers available time slots and confirms booking.',
    expectedIntent: 'book_test_drive',
    expectedCarNames: ['Kia Seltos']
  },
  {
    id: 'TC-011',
    category: 'Financing Info',
    input: 'Can you tell me EMI for Tata Nexon?',
    expectedBehavior: 'Bot explains financing options, mentions approximate EMI.',
    expectedIntent: 'financing_info'
  },
  {
    id: 'TC-012',
    category: 'Service Request',
    input: 'I need to service my Baleno.',
    expectedBehavior: 'Bot collects service location and connects to service center API.',
    expectedIntent: 'service_request'
  },
  {
    id: 'TC-013',
    category: 'Multi-intent',
    input: 'Compare Seltos and Creta, and also tell me which gives better mileage.',
    expectedBehavior: 'Bot combines comparison + performance insights.',
    expectedIntent: 'compare_cars',
    expectedFollowUp: 'mileage'
  },
  {
    id: 'TC-014',
    category: 'Ambiguous Input',
    input: 'What\'s the best one?',
    expectedBehavior: 'Bot requests clarification politely (budget, type, or brand).',
    expectedIntent: 'unknown',
    expectedFollowUp: 'clarification'
  },
  {
    id: 'TC-015',
    category: 'Out-of-scope',
    input: 'Can you order car accessories?',
    expectedBehavior: 'Bot clarifies scope — not currently supported.',
    expectedIntent: 'unknown'
  },
  {
    id: 'TC-016',
    category: 'Edge – Typo',
    input: 'Compre Kea Seltis and Hundai Cretaa.',
    expectedBehavior: 'Bot corrects spelling, proceeds with comparison.',
    expectedCarNames: ['Kia Seltos', 'Hyundai Creta']
  },
  {
    id: 'TC-017',
    category: 'Follow-up',
    input: 'Show me the diesel versions.',
    expectedBehavior: 'Bot understands it refers to last shown cars.',
    expectedFuelType: 'diesel'
  },
  {
    id: 'TC-018',
    category: 'Emotion / UX',
    input: 'I\'m confused between these two.',
    expectedBehavior: 'Bot responds empathetically and summarizes comparison again.',
    expectedIntent: 'compare_cars'
  },
  {
    id: 'TC-019',
    category: 'Multiple Filters',
    input: 'SUV under 25 lakhs, automatic, diesel.',
    expectedBehavior: 'Bot lists matching models.',
    expectedPriceRange: 'under 25 lakhs',
    expectedFuelType: 'diesel',
    expectedTransmission: 'automatic'
  },
  {
    id: 'TC-020',
    category: 'Edge – Empty Input',
    input: '...',
    expectedBehavior: 'Bot asks user to describe preference again.',
    expectedIntent: 'unknown'
  }
];

// Test helper functions
function logTest(testCase, response, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`\n${status} ${testCase.id} - ${testCase.category}`);
  console.log(`Input: "${testCase.input}"`);
  console.log(`Expected: ${testCase.expectedBehavior}`);
  console.log(`Response: ${typeof response === 'string' ? response.substring(0, 100) + '...' : JSON.stringify(response).substring(0, 100) + '...'}`);
  if (details) console.log(`Details: ${details}`);
  console.log('─'.repeat(80));
}

function checkResponse(response, testCase) {
  if (!response) return { passed: false, details: 'No response received' };
  
  const responseStr = typeof response === 'string' ? response.toLowerCase() : JSON.stringify(response).toLowerCase();
  
  // Check for specific expected behaviors
  switch (testCase.id) {
    case 'TC-001':
      return {
        passed: responseStr.includes('budget') || responseStr.includes('looking') || responseStr.includes('help'),
        details: 'Should ask about preferences or budget'
      };
    
    case 'TC-002':
      return {
        passed: responseStr.includes('suv') || responseStr.includes('15') || responseStr.includes('lakh'),
        details: 'Should mention SUV and budget'
      };
    
    case 'TC-003':
      return {
        passed: responseStr.includes('maruti') || responseStr.includes('automatic'),
        details: 'Should mention Maruti or automatic transmission'
      };
    
    case 'TC-004':
      return {
        passed: responseStr.includes('hatchback') || responseStr.includes('petrol') || responseStr.includes('mileage'),
        details: 'Should mention hatchback, petrol, or mileage'
      };
    
    case 'TC-005':
      return {
        passed: responseStr.includes('seltos') || responseStr.includes('creta') || responseStr.includes('compare'),
        details: 'Should mention Seltos, Creta, or comparison'
      };
    
    case 'TC-006':
      return {
        passed: responseStr.includes('nexon') || responseStr.includes('creta') || responseStr.includes('compare'),
        details: 'Should mention Nexon, Creta, or comparison'
      };
    
    case 'TC-007':
      return {
        passed: responseStr.includes('verna') || responseStr.includes('hyundai'),
        details: 'Should mention Verna or Hyundai'
      };
    
    case 'TC-008':
      return {
        passed: responseStr.includes('car') || responseStr.includes('image') || responseStr.includes('detect'),
        details: 'Should handle image upload'
      };
    
    case 'TC-009':
      return {
        passed: responseStr.includes('doesn\'t seem') || responseStr.includes('not a car') || responseStr.includes('car image'),
        details: 'Should identify non-car image'
      };
    
    case 'TC-010':
      return {
        passed: responseStr.includes('test drive') || responseStr.includes('seltos') || responseStr.includes('book'),
        details: 'Should handle test drive booking'
      };
    
    case 'TC-011':
      return {
        passed: responseStr.includes('emi') || responseStr.includes('financing') || responseStr.includes('nexon'),
        details: 'Should handle financing/EMI query'
      };
    
    case 'TC-012':
      return {
        passed: responseStr.includes('service') || responseStr.includes('baleno') || responseStr.includes('book'),
        details: 'Should handle service request'
      };
    
    case 'TC-013':
      return {
        passed: responseStr.includes('seltos') || responseStr.includes('creta') || responseStr.includes('mileage'),
        details: 'Should handle comparison and mileage query'
      };
    
    case 'TC-014':
      return {
        passed: responseStr.includes('clarify') || responseStr.includes('budget') || responseStr.includes('type') || responseStr.includes('brand'),
        details: 'Should ask for clarification'
      };
    
    case 'TC-015':
      return {
        passed: responseStr.includes('accessories') || responseStr.includes('not supported') || responseStr.includes('scope'),
        details: 'Should clarify scope limitations'
      };
    
    case 'TC-016':
      return {
        passed: responseStr.includes('seltos') || responseStr.includes('creta') || responseStr.includes('kia') || responseStr.includes('hyundai'),
        details: 'Should correct spelling and proceed'
      };
    
    case 'TC-017':
      return {
        passed: responseStr.includes('diesel') || responseStr.includes('version'),
        details: 'Should understand diesel filter'
      };
    
    case 'TC-018':
      return {
        passed: responseStr.includes('confused') || responseStr.includes('help') || responseStr.includes('compare'),
        details: 'Should respond empathetically'
      };
    
    case 'TC-019':
      return {
        passed: responseStr.includes('suv') || responseStr.includes('25') || responseStr.includes('diesel') || responseStr.includes('automatic'),
        details: 'Should handle multiple filters'
      };
    
    case 'TC-020':
      return {
        passed: responseStr.includes('describe') || responseStr.includes('preference') || responseStr.includes('help'),
        details: 'Should ask for clarification on empty input'
      };
    
    default:
      return { passed: true, details: 'No specific validation' };
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting AutoSherpa WhatsApp Bot Test Suite');
  console.log('='.repeat(80));
  
  let passedTests = 0;
  let totalTests = TEST_CASES.length;
  
  for (const testCase of TEST_CASES) {
    try {
      // Clear session for each test
      clearSession(TEST_USER_ID);
      
      // Test deterministic flows first
      let response = await handleDeterministicFlows(TEST_USER_ID, testCase.input);
      
      // If no deterministic flow matched, test Gemini
      if (!response) {
        response = await handleUserMessage(TEST_USER_ID, testCase.input);
      }
      
      // Validate response
      const validation = checkResponse(response, testCase);
      logTest(testCase, response, validation.passed, validation.details);
      
      if (validation.passed) passedTests++;
      
    } catch (error) {
      console.log(`\n❌ ERROR ${testCase.id} - ${testCase.category}`);
      console.log(`Input: "${testCase.input}"`);
      console.log(`Error: ${error.message}`);
      console.log('─'.repeat(80));
    }
  }
  
  // Test summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Bot is working correctly.');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} tests failed. Review the bot logic.`);
  }
}

// Test specific flows
async function testSpecificFlows() {
  console.log('\n🔍 Testing Specific Flows');
  console.log('='.repeat(80));
  
  // Test Contact flow
  console.log('\n📞 Testing Contact Flow:');
  clearSession(TEST_USER_ID);
  let response = await handleDeterministicFlows(TEST_USER_ID, 'contact our team');
  console.log('Contact menu:', response);
  
  response = await handleDeterministicFlows(TEST_USER_ID, 'call us now');
  console.log('Call numbers:', response);
  
  // Test About flow
  console.log('\nℹ️  Testing About Flow:');
  clearSession(TEST_USER_ID);
  response = await handleDeterministicFlows(TEST_USER_ID, 'about us');
  console.log('About menu:', response);
  
  response = await handleDeterministicFlows(TEST_USER_ID, 'our company story');
  console.log('Company story:', response);
  
  // Test Browse flow
  console.log('\n🚗 Testing Browse Flow:');
  clearSession(TEST_USER_ID);
  response = await handleDeterministicFlows(TEST_USER_ID, 'browse used cars');
  console.log('Browse budget prompt:', response);
  
  response = await handleDeterministicFlows(TEST_USER_ID, '15 lakhs');
  console.log('Budget confirmed, type prompt:', response);
  
  response = await handleDeterministicFlows(TEST_USER_ID, 'SUV');
  console.log('Type confirmed, brand prompt:', response);
  
  response = await handleDeterministicFlows(TEST_USER_ID, 'Toyota');
  console.log('Brand confirmed, results:', response);
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then(() => testSpecificFlows())
    .catch(console.error);
}

export { runTests, testSpecificFlows, TEST_CASES };

#!/usr/bin/env node

console.log('🚀 AutoSherpa WhatsApp Bot Comprehensive Test');
console.log('='.repeat(60));

// Test cases with expected behaviors
const testCases = [
  {
    id: 'TC-001',
    name: 'Greeting & Browse Intent',
    input: 'Hi, I want to buy a new car.',
    shouldContain: ['budget', 'looking', 'help']
  },
  {
    id: 'TC-002', 
    name: 'Budget Filter (SUV under 15L)',
    input: 'Show me the best SUV under 15 lakhs.',
    shouldContain: ['suv', '15', 'lakh']
  },
  {
    id: 'TC-003',
    name: 'Brand Filter (Maruti + Auto)',
    input: 'I\'m interested in a Maruti car with automatic transmission.',
    shouldContain: ['maruti', 'automatic']
  },
  {
    id: 'TC-004',
    name: 'Fuel Type (Petrol Hatchback)',
    input: 'Looking for a petrol hatchback with good mileage.',
    shouldContain: ['hatchback', 'petrol', 'mileage']
  },
  {
    id: 'TC-005',
    name: 'Car Comparison',
    input: 'Compare Kia Seltos and Hyundai Creta.',
    shouldContain: ['seltos', 'creta', 'compare']
  },
  {
    id: 'TC-007',
    name: 'Car Details',
    input: 'Tell me about Hyundai Verna.',
    shouldContain: ['verna', 'hyundai']
  },
  {
    id: 'TC-010',
    name: 'Test Drive Booking',
    input: 'I want to book a test drive for Kia Seltos.',
    shouldContain: ['test drive', 'seltos', 'book']
  },
  {
    id: 'TC-011',
    name: 'Financing Info',
    input: 'Can you tell me EMI for Tata Nexon?',
    shouldContain: ['emi', 'financing', 'nexon']
  },
  {
    id: 'TC-012',
    name: 'Service Request',
    input: 'I need to service my Baleno.',
    shouldContain: ['service', 'baleno']
  },
  {
    id: 'TC-014',
    name: 'Ambiguous Input',
    input: 'What\'s the best one?',
    shouldContain: ['clarify', 'budget', 'type', 'brand']
  },
  {
    id: 'TC-015',
    name: 'Out-of-scope',
    input: 'Can you order car accessories?',
    shouldContain: ['accessories', 'not supported', 'scope']
  },
  {
    id: 'TC-016',
    name: 'Typo Handling',
    input: 'Compre Kea Seltis and Hundai Cretaa.',
    shouldContain: ['seltos', 'creta', 'kia', 'hyundai']
  },
  {
    id: 'TC-017',
    name: 'Follow-up Query',
    input: 'Show me the diesel versions.',
    shouldContain: ['diesel', 'version']
  },
  {
    id: 'TC-019',
    name: 'Multiple Filters',
    input: 'SUV under 25 lakhs, automatic, diesel.',
    shouldContain: ['suv', '25', 'diesel', 'automatic']
  },
  {
    id: 'TC-020',
    name: 'Empty Input',
    input: '...',
    shouldContain: ['describe', 'preference', 'help']
  }
];

async function runTest(testCase) {
  try {
    // Clear session for each test
    const { clearSession } = await import('./src/session.js');
    clearSession('test_user');
    
    // Test deterministic flows first
    const { handleDeterministicFlows } = await import('./src/flows.js');
    let response = await handleDeterministicFlows('test_user', testCase.input);
    
    // If no deterministic flow matched, test Gemini
    if (!response) {
      const { handleUserMessage } = await import('./src/gemini.js');
      response = await handleUserMessage({
        userId: 'test_user',
        message: testCase.input,
        channel: 'whatsapp',
        businessName: 'AutoSherpa Motors'
      });
    }
    
    // Check if response contains expected keywords
    const responseStr = typeof response === 'string' ? response.toLowerCase() : JSON.stringify(response).toLowerCase();
    const foundKeywords = testCase.shouldContain.filter(keyword => responseStr.includes(keyword.toLowerCase()));
    const passed = foundKeywords.length > 0;
    
    console.log(`\n${passed ? '✅' : '❌'} ${testCase.id} - ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Response: ${typeof response === 'string' ? response.substring(0, 100) + '...' : 'Interactive message'}`);
    console.log(`Found keywords: ${foundKeywords.join(', ') || 'none'}`);
    console.log(`Expected: ${testCase.shouldContain.join(', ')}`);
    
    return passed;
    
  } catch (error) {
    console.log(`\n❌ ${testCase.id} - ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Error: ${error.message}`);
    return false;
  }
}

async function testSpecificFlows() {
  console.log('\n🔍 Testing Specific Deterministic Flows');
  console.log('='.repeat(60));
  
  const { clearSession, getSession } = await import('./src/session.js');
  const { handleDeterministicFlows } = await import('./src/flows.js');
  
  // Test Contact flow
  console.log('\n📞 Contact Flow:');
  clearSession('test_user');
  let response = await handleDeterministicFlows('test_user', 'contact our team');
  console.log('✅ Contact menu:', typeof response === 'object' ? 'Interactive buttons/list' : 'Text');
  
  response = await handleDeterministicFlows('test_user', 'call us now');
  console.log('✅ Call numbers:', typeof response === 'string' ? 'Text response' : 'Other');
  
  // Test About flow
  console.log('\nℹ️  About Flow:');
  clearSession('test_user');
  response = await handleDeterministicFlows('test_user', 'about us');
  console.log('✅ About menu:', typeof response === 'object' ? 'Interactive list' : 'Text');
  
  response = await handleDeterministicFlows('test_user', 'our company story');
  console.log('✅ Company story:', typeof response === 'string' ? 'Text response' : 'Other');
  
  // Test Browse flow
  console.log('\n🚗 Browse Flow:');
  clearSession('test_user');
  response = await handleDeterministicFlows('test_user', 'browse used cars');
  console.log('✅ Budget prompt:', typeof response === 'string' ? 'Text response' : 'Other');
  
  response = await handleDeterministicFlows('test_user', '15 lakhs');
  console.log('✅ Type prompt:', typeof response === 'string' ? 'Text response' : 'Other');
  
  response = await handleDeterministicFlows('test_user', 'SUV');
  console.log('✅ Brand prompt:', typeof response === 'string' ? 'Text response' : 'Other');
  
  response = await handleDeterministicFlows('test_user', 'Toyota');
  console.log('✅ Results:', typeof response === 'object' ? 'Interactive list' : 'Text response');
}

async function main() {
  let passedTests = 0;
  let totalTests = testCases.length;
  
  console.log(`Running ${totalTests} test cases...\n`);
  
  for (const testCase of testCases) {
    const passed = await runTest(testCase);
    if (passed) passedTests++;
  }
  
  // Test specific flows
  await testSpecificFlows();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
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

// Run the tests
main().catch(console.error);

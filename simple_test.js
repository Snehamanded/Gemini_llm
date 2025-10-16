#!/usr/bin/env node

console.log('🚀 Starting Simple Bot Test');
console.log('='.repeat(50));

// Test 1: Basic deterministic flows
console.log('\n📞 Test 1: Contact Flow');
try {
  const { handleDeterministicFlows } = await import('./src/flows.js');
  const response = await handleDeterministicFlows('test_user', 'contact our team');
  console.log('✅ Contact flow works:', typeof response === 'object' ? 'Interactive message' : 'Text message');
} catch (error) {
  console.log('❌ Contact flow failed:', error.message);
}

// Test 2: About flow
console.log('\nℹ️  Test 2: About Flow');
try {
  const { handleDeterministicFlows } = await import('./src/flows.js');
  const response = await handleDeterministicFlows('test_user', 'about us');
  console.log('✅ About flow works:', typeof response === 'object' ? 'Interactive message' : 'Text message');
} catch (error) {
  console.log('❌ About flow failed:', error.message);
}

// Test 3: Browse flow
console.log('\n🚗 Test 3: Browse Flow');
try {
  const { handleDeterministicFlows } = await import('./src/flows.js');
  const response = await handleDeterministicFlows('test_user', 'browse used cars');
  console.log('✅ Browse flow works:', typeof response === 'string' ? 'Text message' : 'Other');
} catch (error) {
  console.log('❌ Browse flow failed:', error.message);
}

console.log('\n✅ Simple tests completed!');

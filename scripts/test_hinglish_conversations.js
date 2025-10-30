import dotenv from 'dotenv';
import { handleUserMessage } from '../src/gemini.js';
import { detectLanguage, isHinglish } from '../src/language.js';

dotenv.config();

// Test Hinglish conversations
const hinglishTestCases = [
  {
    input: "Namaste! Main car dekh raha hun",
    expected: "hinglish",
    description: "Basic Hinglish greeting with car search intent"
  },
  {
    input: "Hello! Main budget 15 lakhs ke liye SUV chahta hun",
    expected: "hinglish", 
    description: "Mixed English-Hindi with budget and car type"
  },
  {
    input: "Aapka swagat hai! Test drive book karna chahta hun",
    expected: "hinglish",
    description: "Hinglish with test drive booking intent"
  },
  {
    input: "Main Hyundai i20 dekh raha hun. Price kya hai?",
    expected: "hinglish",
    description: "Specific car inquiry with price question"
  },
  {
    input: "Bahut badhiya! Financing options batao",
    expected: "hinglish",
    description: "Positive response with financing inquiry"
  },
  {
    input: "Dhanyavaad! Service appointment book karna hai",
    expected: "hinglish",
    description: "Thank you with service booking intent"
  },
  {
    input: "Main family ke liye car chahta hun. 5 members hain",
    expected: "hinglish",
    description: "Family car requirement with member count"
  },
  {
    input: "Petrol ya diesel? Kya better hai?",
    expected: "hinglish",
    description: "Fuel type comparison question"
  },
  {
    input: "Hello! I want to buy a car",
    expected: "english",
    description: "Pure English input for comparison"
  },
  {
    input: "नमस्ते! मैं कार देख रहा हूं",
    expected: "hindi",
    description: "Pure Hindi input for comparison"
  }
];

async function testHinglishConversations() {
  console.log('🧪 Testing Hinglish Language Detection and Responses\n');
  console.log('=' .repeat(80));
  
  let passedTests = 0;
  let totalTests = hinglishTestCases.length;
  
  for (let i = 0; i < hinglishTestCases.length; i++) {
    const testCase = hinglishTestCases[i];
    console.log(`\n📝 Test ${i + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    
    try {
      // Test language detection
      const detectedLang = detectLanguage(testCase.input);
      const isHinglishText = isHinglish(testCase.input);
      
      console.log(`Detected Language: ${detectedLang}`);
      console.log(`Is Hinglish: ${isHinglishText}`);
      
      // Check if detection matches expected
      const detectionCorrect = detectedLang === testCase.expected;
      console.log(`Detection Correct: ${detectionCorrect ? '✅' : '❌'}`);
      
      if (detectionCorrect) {
        passedTests++;
      }
      
      // Test bot response for Hinglish inputs
      if (testCase.expected === 'hinglish') {
        console.log('\n🤖 Testing Bot Response:');
        try {
          const response = await handleUserMessage({
            userId: `test_user_${i}`,
            message: testCase.input,
            channel: 'terminal',
            businessName: 'Sherpa Hyundai'
          });
          
          console.log(`Bot Response: "${response}"`);
          
          // Check if response contains Hinglish elements
          const responseIsHinglish = isHinglish(response);
          console.log(`Response in Hinglish: ${responseIsHinglish ? '✅' : '❌'}`);
          
        } catch (error) {
          console.log(`Bot Response Error: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Test Error: ${error.message}`);
    }
    
    console.log('-'.repeat(60));
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Hinglish language detection is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the language detection logic.');
  }
}

// Interactive conversation test
async function interactiveHinglishTest() {
  console.log('\n🎯 Interactive Hinglish Conversation Test');
  console.log('Type Hinglish messages to test the bot. Type "exit" to quit.\n');
  
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const askQuestion = () => {
    rl.question('You (Hinglish): ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }
      
      try {
        const detectedLang = detectLanguage(input);
        const isHinglishText = isHinglish(input);
        
        console.log(`\n🔍 Language Detection:`);
        console.log(`Detected: ${detectedLang} | Is Hinglish: ${isHinglishText}`);
        
        const response = await handleUserMessage({
          userId: 'interactive_test_user',
          message: input,
          channel: 'terminal',
          businessName: 'Sherpa Hyundai'
        });
        
        console.log(`\n🤖 Bot Response: ${response}\n`);
        
      } catch (error) {
        console.log(`❌ Error: ${error.message}\n`);
      }
      
      askQuestion();
    });
  };
  
  askQuestion();
}

// Main execution
async function main() {
  try {
    await testHinglishConversations();
    
    // Ask if user wants interactive test
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('\nWould you like to run interactive Hinglish conversation test? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        rl.close();
        await interactiveHinglishTest();
      } else {
        rl.close();
        console.log('\n✅ Testing completed!');
        process.exit(0);
      }
    });
    
  } catch (error) {
    console.error('❌ Test execution error:', error);
    process.exit(1);
  }
}

main();

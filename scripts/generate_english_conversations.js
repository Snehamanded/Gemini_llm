import XLSX from 'xlsx';
import { handleUserMessage } from '../src/gemini.js';

// Realistic English conversation scenarios
const conversationScenarios = [
  // Car Search Scenarios
  {
    category: 'Car Search - SUV',
    scenarios: [
      {
        userMessages: [
          "Hi, I'm looking for an SUV for my family",
          "Around 15 lakhs",
          "SUV",
          "Hyundai",
          "car1",
          "Yes, I'd like to book a test drive",
          "Tomorrow afternoon",
          "Name: Rajesh Kumar, Phone: +91-9876543210"
        ],
        context: "Family looking for SUV within budget"
      },
      {
        userMessages: [
          "Hello, I need a car for city driving",
          "Under 10 lakhs",
          "Hatchback",
          "Maruti",
          "car2",
          "Can you show me more options?",
          "show more",
          "car3",
          "This looks good, what about financing?"
        ],
        context: "City commuter looking for hatchback"
      },
      {
        userMessages: [
          "Hi, I'm interested in buying a sedan",
          "20 lakhs maximum",
          "Sedan",
          "Honda",
          "car1",
          "What are the features?",
          "Yes, I want to compare with Toyota Camry",
          "compare Honda City with Toyota Camry"
        ],
        context: "Professional looking for premium sedan"
      }
    ]
  },
  
  // Test Drive Scenarios
  {
    category: 'Test Drive Booking',
    scenarios: [
      {
        userMessages: [
          "I want to book a test drive for Hyundai Creta",
          "This weekend",
          "Saturday morning",
          "Name: Priya Sharma, Phone: +91-9876543211, Email: priya@email.com"
        ],
        context: "Weekend test drive booking"
      },
      {
        userMessages: [
          "Can I test drive the Maruti Swift?",
          "Today if possible",
          "Evening around 6 PM",
          "Name: Amit Singh, Phone: +91-9876543212"
        ],
        context: "Same day test drive request"
      }
    ]
  },
  
  // Service & Maintenance
  {
    category: 'Service & Maintenance',
    scenarios: [
      {
        userMessages: [
          "I need to book a service for my Hyundai i20",
          "Regular service",
          "Next week",
          "Tuesday morning",
          "Name: Suresh Patel, Phone: +91-9876543213, Registration: KA01AB1234"
        ],
        context: "Regular maintenance booking"
      },
      {
        userMessages: [
          "My car needs accident repair",
          "Hyundai Verna",
          "Insurance claim",
          "KA02CD5678",
          "Next Monday",
          "Name: Deepak Kumar, Phone: +91-9876543214"
        ],
        context: "Accident repair with insurance"
      }
    ]
  },
  
  // Financing & Insurance
  {
    category: 'Financing & Insurance',
    scenarios: [
      {
        userMessages: [
          "I'm interested in financing options for Hyundai Creta",
          "15 lakhs",
          "What's the EMI for 5 years?",
          "Yes, I'd like to proceed with the application"
        ],
        context: "Financing inquiry"
      },
      {
        userMessages: [
          "I need car insurance for my new Hyundai i20",
          "Comprehensive coverage",
          "What's the premium?",
          "Yes, please help me with the process"
        ],
        context: "Insurance inquiry"
      }
    ]
  },
  
  // General Inquiries
  {
    category: 'General Inquiries',
    scenarios: [
      {
        userMessages: [
          "What are your showroom timings?",
          "Do you have parking available?",
          "Can I bring my family for the test drive?",
          "What documents do I need to bring?"
        ],
        context: "General information request"
      },
      {
        userMessages: [
          "Tell me about your company",
          "How long have you been in business?",
          "What makes you different from other dealers?",
          "Do you offer after-sales service?"
        ],
        context: "Company information inquiry"
      }
    ]
  },
  
  // Price Negotiation
  {
    category: 'Price Negotiation',
    scenarios: [
      {
        userMessages: [
          "What's the best price for Hyundai Creta SX?",
          "Can you give me any discounts?",
          "What about exchange for my old car?",
          "My car is 2018 Maruti Swift, what's the exchange value?"
        ],
        context: "Price negotiation with exchange"
      },
      {
        userMessages: [
          "I'm comparing prices with other dealers",
          "Can you match XYZ dealer's price?",
          "What additional benefits can you offer?",
          "I'll think about it and get back to you"
        ],
        context: "Price comparison scenario"
      }
    ]
  },
  
  // Multiple Car Comparison
  {
    category: 'Car Comparison',
    scenarios: [
      {
        userMessages: [
          "I want to compare Hyundai Creta and Kia Seltos",
          "Both SUVs",
          "Around 15 lakhs budget",
          "Which one has better fuel efficiency?",
          "What about maintenance costs?",
          "I think Creta is better for me"
        ],
        context: "Detailed car comparison"
      },
      {
        userMessages: [
          "Show me hatchbacks under 8 lakhs",
          "Maruti Swift vs Hyundai i20",
          "compare Maruti Swift with Hyundai i20",
          "Which has better resale value?",
          "I'll go with Swift"
        ],
        context: "Hatchback comparison"
      }
    ]
  },
  
  // Follow-up Conversations
  {
    category: 'Follow-up Conversations',
    scenarios: [
      {
        userMessages: [
          "Hi, I came for a test drive last week",
          "Hyundai Creta",
          "Yes, I'm still interested",
          "Can you send me the quotation?",
          "I'll visit the showroom this weekend"
        ],
        context: "Follow-up after test drive"
      },
      {
        userMessages: [
          "I had booked a service appointment",
          "Last Tuesday",
          "How was the service?",
          "Can I get a copy of the service report?",
          "Thank you for the good service"
        ],
        context: "Service follow-up"
      }
    ]
  }
];

// Generate realistic variations
function generateVariations(baseScenario, count) {
  const variations = [];
  
  for (let i = 0; i < count; i++) {
    const variation = {
      ...baseScenario,
      userMessages: [...baseScenario.userMessages],
      context: baseScenario.context
    };
    
    // Add some natural variations
    if (Math.random() > 0.7) {
      // Sometimes add extra questions
      variation.userMessages.push("Can you tell me more about the warranty?");
    }
    
    if (Math.random() > 0.8) {
      // Sometimes add thank you
      variation.userMessages.push("Thank you for your help!");
    }
    
    variations.push(variation);
  }
  
  return variations;
}

// Generate all conversations
async function generateConversations() {
  const allConversations = [];
  let conversationId = 1;
  
  for (const category of conversationScenarios) {
    for (const scenario of category.scenarios) {
      // Generate multiple variations of each scenario
      const variations = generateVariations(scenario, Math.floor(250 / conversationScenarios.reduce((sum, cat) => sum + cat.scenarios.length, 0)) + 1);
      
      for (const variation of variations) {
        if (allConversations.length >= 250) break;
        
        const conversation = {
          conversationId: conversationId++,
          category: category.category,
          scenario: variation.context,
          turns: []
        };
        
        // Simulate conversation turns
        for (let i = 0; i < variation.userMessages.length; i++) {
          const userMessage = variation.userMessages[i];
          const turnNumber = i + 1;
          
          try {
            // Generate bot response using the actual bot
            const botResponse = await handleUserMessage({
              userId: `test_user_${conversationId}`,
              message: userMessage,
              channel: 'whatsapp',
              businessName: 'Sherpa Hyundai'
            });
            
            conversation.turns.push({
              turnNumber: turnNumber,
              userMessage: userMessage,
              botResponse: botResponse,
              language: 'English',
              outcome: i === variation.userMessages.length - 1 ? 'Conversation Complete' : 'In Progress',
              satisfaction: Math.random() > 0.2 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
            });
            
            // Add small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`Error generating response for conversation ${conversationId}, turn ${turnNumber}:`, error);
            conversation.turns.push({
              turnNumber: turnNumber,
              userMessage: userMessage,
              botResponse: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
              language: 'English',
              outcome: 'Error',
              satisfaction: 'Low'
            });
          }
        }
        
        allConversations.push(conversation);
        
        if (allConversations.length >= 250) break;
      }
      
      if (allConversations.length >= 250) break;
    }
    
    if (allConversations.length >= 250) break;
  }
  
  return allConversations.slice(0, 250);
}

// Convert to Excel format
function convertToExcelFormat(conversations) {
  const excelData = [];
  
  conversations.forEach(conversation => {
    conversation.turns.forEach(turn => {
      excelData.push({
        'Conversation ID': conversation.conversationId,
        'Category': conversation.category,
        'Scenario': conversation.scenario,
        'Turn Number': turn.turnNumber,
        'User Message': turn.userMessage,
        'Bot Response': turn.botResponse,
        'Language': turn.language,
        'Outcome': turn.outcome,
        'Customer Satisfaction': turn.satisfaction
      });
    });
  });
  
  return excelData;
}

// Main execution
async function main() {
  console.log('Starting to generate 250 English conversations...');
  
  try {
    const conversations = await generateConversations();
    console.log(`Generated ${conversations.length} conversations`);
    
    const excelData = convertToExcelFormat(conversations);
    console.log(`Converted to Excel format: ${excelData.length} rows`);
    
    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'English Conversations');
    
    // Save to file
    const filename = '250_English_Conversations.xlsx';
    XLSX.writeFile(wb, filename);
    console.log(`Excel file saved as: ${filename}`);
    
    // Generate summary statistics
    const stats = {
      totalConversations: conversations.length,
      totalTurns: excelData.length,
      categories: {},
      satisfaction: { High: 0, Medium: 0, Low: 0 },
      outcomes: {}
    };
    
    excelData.forEach(row => {
      stats.categories[row.Category] = (stats.categories[row.Category] || 0) + 1;
      stats.satisfaction[row['Customer Satisfaction']]++;
      stats.outcomes[row.Outcome] = (stats.outcomes[row.Outcome] || 0) + 1;
    });
    
    console.log('\n=== SUMMARY STATISTICS ===');
    console.log(`Total Conversations: ${stats.totalConversations}`);
    console.log(`Total Turns: ${stats.totalTurns}`);
    console.log('\nCategories:');
    Object.entries(stats.categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} turns`);
    });
    console.log('\nSatisfaction:');
    Object.entries(stats.satisfaction).forEach(([level, count]) => {
      console.log(`  ${level}: ${count} turns`);
    });
    
  } catch (error) {
    console.error('Error generating conversations:', error);
  }
}

// Run the generator
main();

import XLSX from 'xlsx';

// Realistic English conversation scenarios
const englishConversationScenarios = [
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

// Realistic Hinglish conversation scenarios
const hinglishConversationScenarios = [
  // Car Search Scenarios
  {
    category: 'Car Search - SUV',
    scenarios: [
      {
        userMessages: [
          "Hi, mujhe family ke liye SUV chahiye",
          "Around 15 lakhs ka budget hai",
          "SUV hi chahiye",
          "Hyundai ka koi achha model batao",
          "car1",
          "Haan, test drive book karna hai",
          "Kal afternoon mein",
          "Name: Rajesh Kumar, Phone: +91-9876543210"
        ],
        context: "Family looking for SUV within budget"
      },
      {
        userMessages: [
          "Hello, city driving ke liye car chahiye",
          "10 lakhs se kam mein",
          "Hatchback achha rahega",
          "Maruti ka koi model",
          "car2",
          "Aur options dikhao na",
          "show more",
          "car3",
          "Ye achha lag raha hai, financing ka kya scene hai?"
        ],
        context: "City commuter looking for hatchback"
      },
      {
        userMessages: [
          "Hi, sedan mein interest hai",
          "Maximum 20 lakhs",
          "Sedan",
          "Honda ka koi model",
          "car1",
          "Features kya kya hai?",
          "Haan, Toyota Camry se compare karna hai",
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
          "Hyundai Creta ka test drive book karna hai",
          "Is weekend mein",
          "Saturday morning",
          "Name: Priya Sharma, Phone: +91-9876543211, Email: priya@email.com"
        ],
        context: "Weekend test drive booking"
      },
      {
        userMessages: [
          "Maruti Swift ka test drive kar sakte hain?",
          "Aaj hi possible hai to",
          "Evening mein 6 PM",
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
          "Hyundai i20 ka service book karna hai",
          "Regular service",
          "Next week",
          "Tuesday morning",
          "Name: Suresh Patel, Phone: +91-9876543213, Registration: KA01AB1234"
        ],
        context: "Regular maintenance booking"
      },
      {
        userMessages: [
          "Meri car ka accident repair chahiye",
          "Hyundai Verna hai",
          "Insurance claim hai",
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
          "Hyundai Creta ke liye financing options chahiye",
          "15 lakhs",
          "5 saal ka EMI kitna hoga?",
          "Haan, application process karna hai"
        ],
        context: "Financing inquiry"
      },
      {
        userMessages: [
          "Nayi Hyundai i20 ke liye car insurance chahiye",
          "Comprehensive coverage",
          "Premium kitna hai?",
          "Haan, process mein help karo"
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
          "Showroom timings kya hai?",
          "Parking available hai?",
          "Family ko test drive ke liye le ja sakte hain?",
          "Documents kya kya lana hoga?"
        ],
        context: "General information request"
      },
      {
        userMessages: [
          "Company ke bare mein batao",
          "Kitne saal se business kar rahe ho?",
          "Dusre dealers se kya different hai?",
          "After-sales service dete ho?"
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
          "Hyundai Creta SX ka best price kya hai?",
          "Koi discount mil sakta hai?",
          "Old car exchange mein kya scene hai?",
          "Meri car 2018 Maruti Swift hai, exchange value kitna hai?"
        ],
        context: "Price negotiation with exchange"
      },
      {
        userMessages: [
          "Dusre dealers se price compare kar raha hun",
          "XYZ dealer ka price match kar sakte ho?",
          "Koi additional benefits de sakte ho?",
          "Soch ke batata hun"
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
          "Hyundai Creta aur Kia Seltos compare karna hai",
          "Donon SUV hain",
          "Around 15 lakhs budget",
          "Konsa better fuel efficiency deta hai?",
          "Maintenance cost kya hai?",
          "Mujhe Creta achha lag raha hai"
        ],
        context: "Detailed car comparison"
      },
      {
        userMessages: [
          "8 lakhs se kam mein hatchbacks dikhao",
          "Maruti Swift vs Hyundai i20",
          "compare Maruti Swift with Hyundai i20",
          "Konsa better resale value hai?",
          "Swift le lunga"
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
          "Hi, main last week test drive ke liye aaya tha",
          "Hyundai Creta",
          "Haan, abhi bhi interest hai",
          "Quotation send kar sakte ho?",
          "Is weekend showroom aunga"
        ],
        context: "Follow-up after test drive"
      },
      {
        userMessages: [
          "Service appointment book kiya tha",
          "Last Tuesday",
          "Service kaise tha?",
          "Service report ki copy mil sakti hai?",
          "Achhi service ke liye thanks"
        ],
        context: "Service follow-up"
      }
    ]
  }
];

// Predefined bot responses for different scenarios
const botResponses = {
  greeting: [
    "Hello! Welcome to Sherpa Hyundai. How can I help you today?",
    "Hi there! I'm here to assist you with all your car needs. What can I do for you?",
    "Good day! Thank you for contacting Sherpa Hyundai. How may I help you?"
  ],
  carSearch: [
    "Great! I'd be happy to help you find the perfect car. What's your budget range?",
    "Excellent! Let me show you some options that match your requirements.",
    "Perfect! Based on your needs, I have some great recommendations for you."
  ],
  testDrive: [
    "I'd be happy to arrange a test drive for you. When would be convenient?",
    "Great choice! Let me book a test drive for you. What time works best?",
    "Perfect! I'll arrange a test drive. Please provide your contact details."
  ],
  service: [
    "I can help you book a service appointment. What type of service do you need?",
    "Sure! Let me schedule your service appointment. When would you like to come in?",
    "I'll take care of your service booking. Please provide your vehicle details."
  ],
  financing: [
    "I can help you with financing options. What's your budget range?",
    "Great! Let me explain our financing plans. What loan tenure are you considering?",
    "I'll provide you with detailed financing information. What's your preferred EMI range?"
  ],
  general: [
    "I'd be happy to provide that information. Let me get the details for you.",
    "Of course! Here's what you need to know about that.",
    "I can help you with that. Let me share the relevant information."
  ],
  price: [
    "I can provide you with our best pricing. Let me check current offers for you.",
    "Great question! Let me get you the most competitive pricing available.",
    "I'll work on getting you the best deal possible. Let me check our offers."
  ],
  comparison: [
    "I'd be happy to help you compare these models. Let me provide detailed information.",
    "Great idea! Let me show you a detailed comparison of these vehicles.",
    "I'll help you make an informed decision. Let me compare these options for you."
  ],
  followUp: [
    "Thank you for following up! I'm here to continue assisting you.",
    "Great to hear from you again! How can I help you further?",
    "I'm glad you're still interested! Let me help you with the next steps."
  ],
  closing: [
    "Thank you for choosing Sherpa Hyundai! Is there anything else I can help you with?",
    "It was a pleasure assisting you today. Feel free to contact us anytime!",
    "Thank you for your time! We look forward to serving you at Sherpa Hyundai."
  ]
};

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
      if (variation.context.includes('English')) {
        variation.userMessages.push("Can you tell me more about the warranty?");
      } else {
        variation.userMessages.push("Warranty ke bare mein aur batao?");
      }
    }
    
    if (Math.random() > 0.8) {
      // Sometimes add thank you
      if (variation.context.includes('English')) {
        variation.userMessages.push("Thank you for your help!");
      } else {
        variation.userMessages.push("Help ke liye thanks!");
      }
    }
    
    variations.push(variation);
  }
  
  return variations;
}

// Generate realistic bot responses based on context
function generateBotResponse(userMessage, turnNumber, language, category) {
  const message = userMessage.toLowerCase();
  
  // Determine response type based on message content
  let responseType = 'general';
  
  if (message.includes('test drive') || message.includes('book')) {
    responseType = 'testDrive';
  } else if (message.includes('service') || message.includes('repair')) {
    responseType = 'service';
  } else if (message.includes('financing') || message.includes('emi') || message.includes('loan')) {
    responseType = 'financing';
  } else if (message.includes('price') || message.includes('discount') || message.includes('cost')) {
    responseType = 'price';
  } else if (message.includes('compare') || message.includes('vs') || message.includes('better')) {
    responseType = 'comparison';
  } else if (message.includes('hi') || message.includes('hello') || turnNumber === 1) {
    responseType = 'greeting';
  } else if (message.includes('thank') || message.includes('thanks')) {
    responseType = 'closing';
  } else if (message.includes('last week') || message.includes('came') || message.includes('booked')) {
    responseType = 'followUp';
  } else if (message.includes('car') || message.includes('looking') || message.includes('need')) {
    responseType = 'carSearch';
  }
  
  const responses = botResponses[responseType] || botResponses.general;
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add some language-specific variations for Hinglish
  if (language === 'Hinglish' && Math.random() > 0.5) {
    const hinglishVariations = {
      greeting: [
        "Namaste! Sherpa Hyundai mein aapka swagat hai. Kaise help kar sakta hun?",
        "Hello! Sherpa Hyundai mein aapka welcome hai. Kya help kar sakta hun?"
      ],
      carSearch: [
        "Bilkul! Aapke liye perfect car dhundne mein help karunga. Budget kya hai?",
        "Great! Aapke requirements ke hisab se options dikhata hun."
      ],
      testDrive: [
        "Bilkul! Test drive arrange kar sakta hun. Kab convenient hoga?",
        "Perfect! Test drive book kar deta hun. Time kya sahi rahega?"
      ],
      service: [
        "Service appointment book kar sakta hun. Kya type ka service chahiye?",
        "Sure! Service appointment schedule kar deta hun."
      ],
      financing: [
        "Financing options mein help kar sakta hun. Budget range kya hai?",
        "Great! Financing plans explain karta hun."
      ],
      price: [
        "Best pricing provide kar sakta hun. Current offers check karta hun.",
        "Great question! Most competitive pricing de sakta hun."
      ],
      comparison: [
        "Models compare karne mein help kar sakta hun.",
        "Detailed comparison provide karta hun."
      ],
      closing: [
        "Sherpa Hyundai choose karne ke liye thanks! Aur kya help kar sakta hun?",
        "Aapka time dene ke liye thanks! Sherpa Hyundai mein aapka welcome hai."
      ]
    };
    
    const hinglishResponses = hinglishVariations[responseType];
    if (hinglishResponses) {
      return hinglishResponses[Math.floor(Math.random() * hinglishResponses.length)];
    }
  }
  
  return selectedResponse;
}

// Generate English conversations
function generateEnglishConversations() {
  const allConversations = [];
  let conversationId = 1;
  
  for (const category of englishConversationScenarios) {
    for (const scenario of category.scenarios) {
      // Generate multiple variations of each scenario
      const variations = generateVariations(scenario, Math.floor(250 / englishConversationScenarios.reduce((sum, cat) => sum + cat.scenarios.length, 0)) + 1);
      
      for (const variation of variations) {
        if (allConversations.length >= 250) break;
        
        const conversation = {
          conversationId: conversationId++,
          category: category.category,
          scenario: variation.context,
          language: 'English',
          turns: []
        };
        
        // Simulate conversation turns
        for (let i = 0; i < variation.userMessages.length; i++) {
          const userMessage = variation.userMessages[i];
          const turnNumber = i + 1;
          
          const botResponse = generateBotResponse(userMessage, turnNumber, 'English', category.category);
          
          conversation.turns.push({
            turnNumber: turnNumber,
            userMessage: userMessage,
            botResponse: botResponse,
            language: 'English',
            outcome: i === variation.userMessages.length - 1 ? 'Conversation Complete' : 'In Progress',
            satisfaction: Math.random() > 0.2 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
          });
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

// Generate Hinglish conversations
function generateHinglishConversations() {
  const allConversations = [];
  let conversationId = 251; // Start from 251 to avoid conflicts
  
  for (const category of hinglishConversationScenarios) {
    for (const scenario of category.scenarios) {
      // Generate multiple variations of each scenario
      const variations = generateVariations(scenario, Math.floor(50 / hinglishConversationScenarios.reduce((sum, cat) => sum + cat.scenarios.length, 0)) + 1);
      
      for (const variation of variations) {
        if (allConversations.length >= 50) break;
        
        const conversation = {
          conversationId: conversationId++,
          category: category.category,
          scenario: variation.context,
          language: 'Hinglish',
          turns: []
        };
        
        // Simulate conversation turns
        for (let i = 0; i < variation.userMessages.length; i++) {
          const userMessage = variation.userMessages[i];
          const turnNumber = i + 1;
          
          const botResponse = generateBotResponse(userMessage, turnNumber, 'Hinglish', category.category);
          
          conversation.turns.push({
            turnNumber: turnNumber,
            userMessage: userMessage,
            botResponse: botResponse,
            language: 'Hinglish',
            outcome: i === variation.userMessages.length - 1 ? 'Conversation Complete' : 'In Progress',
            satisfaction: Math.random() > 0.2 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
          });
        }
        
        allConversations.push(conversation);
        
        if (allConversations.length >= 50) break;
      }
      
      if (allConversations.length >= 50) break;
    }
    
    if (allConversations.length >= 50) break;
  }
  
  return allConversations.slice(0, 50);
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
function main() {
  console.log('Starting to generate 250 English + 50 Hinglish conversations...');
  
  try {
    // Generate English conversations
    console.log('Generating English conversations...');
    const englishConversations = generateEnglishConversations();
    console.log(`Generated ${englishConversations.length} English conversations`);
    
    // Generate Hinglish conversations
    console.log('Generating Hinglish conversations...');
    const hinglishConversations = generateHinglishConversations();
    console.log(`Generated ${hinglishConversations.length} Hinglish conversations`);
    
    // Combine all conversations
    const allConversations = [...englishConversations, ...hinglishConversations];
    console.log(`Total conversations: ${allConversations.length}`);
    
    const excelData = convertToExcelFormat(allConversations);
    console.log(`Converted to Excel format: ${excelData.length} rows`);
    
    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Mixed Conversations');
    
    // Save to file
    const filename = '250_English_50_Hinglish_Conversations.xlsx';
    XLSX.writeFile(wb, filename);
    console.log(`Excel file saved as: ${filename}`);
    
    // Generate summary statistics
    const stats = {
      totalConversations: allConversations.length,
      totalTurns: excelData.length,
      languages: { English: 0, Hinglish: 0 },
      categories: {},
      satisfaction: { High: 0, Medium: 0, Low: 0 },
      outcomes: {}
    };
    
    excelData.forEach(row => {
      stats.languages[row.Language]++;
      stats.categories[row.Category] = (stats.categories[row.Category] || 0) + 1;
      stats.satisfaction[row['Customer Satisfaction']]++;
      stats.outcomes[row.Outcome] = (stats.outcomes[row.Outcome] || 0) + 1;
    });
    
    console.log('\n=== SUMMARY STATISTICS ===');
    console.log(`Total Conversations: ${stats.totalConversations}`);
    console.log(`Total Turns: ${stats.totalTurns}`);
    console.log('\nLanguages:');
    Object.entries(stats.languages).forEach(([lang, count]) => {
      console.log(`  ${lang}: ${count} turns`);
    });
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

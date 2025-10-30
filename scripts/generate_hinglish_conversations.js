import XLSX from 'xlsx';
import { handleUserMessage } from '../src/gemini.js';

// Comprehensive Hinglish scenarios covering all major flows and test cases
const hinglishConversationScenarios = [
  // Car Search Scenarios
  {
    category: 'Car Search - SUV',
    scenarios: [
      {
        userMessages: [
          'Hi, mujhe family ke liye SUV chahiye',
          'Around 15 lakhs ka budget hai',
          'SUV hi chahiye',
          'Hyundai ka koi achha model batao',
          'car1',
          'Haan, test drive book karna hai',
          'Kal afternoon mein',
          'Name: Rajesh Kumar, Phone: +91-9876543210'
        ],
        context: 'Family looking for SUV within budget'
      },
      {
        userMessages: [
          'Hello, city driving ke liye car chahiye',
          '10 lakhs se kam mein',
          'Hatchback achha rahega',
          'Maruti ka koi model',
          'car2',
          'Aur options dikhao na',
          'show more',
          'car3',
          'Ye achha lag raha hai, financing ka kya scene hai?'
        ],
        context: 'City commuter looking for hatchback'
      },
      {
        userMessages: [
          'Hi, sedan mein interest hai',
          'Maximum 20 lakhs',
          'Sedan',
          'Honda ka koi model',
          'car1',
          'Features kya kya hai?',
          'Haan, Toyota Camry se compare karna hai',
          'compare Honda City with Toyota Camry'
        ],
        context: 'Professional looking for premium sedan'
      }
    ]
  },

  // Test Drive Booking
  {
    category: 'Test Drive Booking',
    scenarios: [
      {
        userMessages: [
          'Hyundai Creta ka test drive book karna hai',
          'Is weekend mein',
          'Saturday morning',
          'Name: Priya Sharma, Phone: +91-9876543211, Email: priya@email.com'
        ],
        context: 'Weekend test drive booking'
      },
      {
        userMessages: [
          'Maruti Swift ka test drive kar sakte hain?',
          'Aaj hi possible hai to',
          'Evening mein 6 PM',
          'Name: Amit Singh, Phone: +91-9876543212'
        ],
        context: 'Same day test drive request'
      }
    ]
  },

  // Service & Maintenance
  {
    category: 'Service & Maintenance',
    scenarios: [
      {
        userMessages: [
          'Hyundai i20 ka service book karna hai',
          'Regular service',
          'Next week',
          'Tuesday morning',
          'Name: Suresh Patel, Phone: +91-9876543213, Registration: KA01AB1234'
        ],
        context: 'Regular maintenance booking'
      },
      {
        userMessages: [
          'Meri car ka accident repair chahiye',
          'Hyundai Verna hai',
          'Insurance claim hai',
          'KA02CD5678',
          'Next Monday',
          'Name: Deepak Kumar, Phone: +91-9876543214'
        ],
        context: 'Accident repair with insurance'
      }
    ]
  },

  // Financing & Insurance
  {
    category: 'Financing & Insurance',
    scenarios: [
      {
        userMessages: [
          'Hyundai Creta ke liye financing options chahiye',
          '15 lakhs',
          '5 saal ka EMI kitna hoga?',
          'Haan, application process karna hai'
        ],
        context: 'Financing inquiry'
      },
      {
        userMessages: [
          'Nayi Hyundai i20 ke liye car insurance chahiye',
          'Comprehensive coverage',
          'Premium kitna hai?',
          'Haan, process mein help karo'
        ],
        context: 'Insurance inquiry'
      }
    ]
  },

  // General Inquiries
  {
    category: 'General Inquiries',
    scenarios: [
      {
        userMessages: [
          'Showroom timings kya hai?',
          'Parking available hai?',
          'Family ko test drive ke liye le ja sakte hain?',
          'Documents kya kya lana hoga?'
        ],
        context: 'General information request'
      },
      {
        userMessages: [
          'Company ke bare mein batao',
          'Kitne saal se business kar rahe ho?',
          'Dusre dealers se kya different hai?',
          'After-sales service dete ho?'
        ],
        context: 'Company information inquiry'
      }
    ]
  },

  // Price Negotiation
  {
    category: 'Price Negotiation',
    scenarios: [
      {
        userMessages: [
          'Hyundai Creta SX ka best price kya hai?',
          'Koi discount mil sakta hai?',
          'Old car exchange mein kya scene hai?',
          'Meri car 2018 Maruti Swift hai, exchange value kitna hai?'
        ],
        context: 'Price negotiation with exchange'
      },
      {
        userMessages: [
          'Dusre dealers se price compare kar raha hun',
          'XYZ dealer ka price match kar sakte ho?',
          'Koi additional benefits de sakte ho?',
          'Soch ke batata hun'
        ],
        context: 'Price comparison scenario'
      }
    ]
  },

  // Car Comparison
  {
    category: 'Car Comparison',
    scenarios: [
      {
        userMessages: [
          'Hyundai Creta aur Kia Seltos compare karna hai',
          'Donon SUV hain',
          'Around 15 lakhs budget',
          'Konsa better fuel efficiency deta hai?',
          'Maintenance cost kya hai?',
          'Mujhe Creta achha lag raha hai'
        ],
        context: 'Detailed car comparison'
      },
      {
        userMessages: [
          '8 lakhs se kam mein hatchbacks dikhao',
          'Maruti Swift vs Hyundai i20',
          'compare Maruti Swift with Hyundai i20',
          'Konsa better resale value hai?',
          'Swift le lunga'
        ],
        context: 'Hatchback comparison'
      }
    ]
  },

  // Follow-up Conversations
  {
    category: 'Follow-up Conversations',
    scenarios: [
      {
        userMessages: [
          'Hi, main last week test drive ke liye aaya tha',
          'Hyundai Creta',
          'Haan, abhi bhi interest hai',
          'Quotation send kar sakte ho?',
          'Is weekend showroom aunga'
        ],
        context: 'Follow-up after test drive'
      },
      {
        userMessages: [
          'Service appointment book kiya tha',
          'Last Tuesday',
          'Service kaise tha?',
          'Service report ki copy mil sakti hai?',
          'Achhi service ke liye thanks'
        ],
        context: 'Service follow-up'
      }
    ]
  }
];

function generateVariations(baseScenario, count) {
  const variations = [];
  for (let i = 0; i < count; i++) {
    const variation = {
      ...baseScenario,
      userMessages: [...baseScenario.userMessages],
      context: baseScenario.context
    };
    if (Math.random() > 0.65) {
      variation.userMessages.push('Warranty ke bare mein aur batao?');
    }
    if (Math.random() > 0.75) {
      variation.userMessages.push('Help ke liye thanks!');
    }
    variations.push(variation);
  }
  return variations;
}

async function generateHinglishConversations(target = 250) {
  const allConversations = [];
  let conversationId = 1;

  const totalScenarioCount = hinglishConversationScenarios.reduce((sum, cat) => sum + cat.scenarios.length, 0);
  const perScenario = Math.floor(target / totalScenarioCount) + 1;

  for (const category of hinglishConversationScenarios) {
    for (const scenario of category.scenarios) {
      const variations = generateVariations(scenario, perScenario);
      for (const variation of variations) {
        if (allConversations.length >= target) break;

        const conversation = {
          conversationId: conversationId++,
          category: category.category,
          scenario: variation.context,
          language: 'Hinglish',
          turns: []
        };

        for (let i = 0; i < variation.userMessages.length; i++) {
          const userMessage = variation.userMessages[i];
          const turnNumber = i + 1;
          try {
            const botResponse = await handleUserMessage({
              userId: `hinglish_user_${conversationId}`,
              message: userMessage,
              channel: 'whatsapp',
              businessName: 'Sherpa Hyundai'
            });
            conversation.turns.push({
              turnNumber,
              userMessage,
              botResponse,
              language: 'Hinglish',
              outcome: i === variation.userMessages.length - 1 ? 'Conversation Complete' : 'In Progress',
              satisfaction: Math.random() > 0.2 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
            });
            await new Promise(r => setTimeout(r, 60));
          } catch (err) {
            conversation.turns.push({
              turnNumber,
              userMessage,
              botResponse: 'Sorry, abhi problem ho rahi hai. Please try again.',
              language: 'Hinglish',
              outcome: 'Error',
              satisfaction: 'Low'
            });
          }
        }

        allConversations.push(conversation);
        if (allConversations.length >= target) break;
      }
      if (allConversations.length >= target) break;
    }
    if (allConversations.length >= target) break;
  }
  return allConversations.slice(0, target);
}

function toExcelRows(conversations) {
  const rows = [];
  conversations.forEach(c => {
    c.turns.forEach(t => {
      rows.push({
        'Conversation ID': c.conversationId,
        'Category': c.category,
        'Scenario': c.scenario,
        'Turn Number': t.turnNumber,
        'User Message': t.userMessage,
        'Bot Response': t.botResponse,
        'Language': t.language,
        'Outcome': t.outcome,
        'Customer Satisfaction': t.satisfaction
      });
    });
  });
  return rows;
}

async function main() {
  console.log('Starting to generate 250 Hinglish conversations...');
  try {
    const conversations = await generateHinglishConversations(250);
    console.log(`Generated ${conversations.length} conversations`);

    const excelData = toExcelRows(conversations);
    console.log(`Converted to Excel format: ${excelData.length} rows`);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Hinglish Conversations');

    const filename = '250_Hinglish_Conversations.xlsx';
    XLSX.writeFile(wb, filename);
    console.log(`Excel file saved as: ${filename}`);
  } catch (error) {
    console.error('Error generating Hinglish conversations:', error);
    process.exit(1);
  }
}

main();



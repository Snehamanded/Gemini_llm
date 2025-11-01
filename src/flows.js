import { getSession, setSession } from './session.js';
import { detectLanguage, getTranslation, translateResponse, isHinglish as checkIsHinglish } from './language.js';

const contactMenu = () => ({
  type: 'buttons',
  bodyText: "I'd be happy to connect you with our team! How would you like to get in touch?",
  buttons: [
    { id: 'contact_call_now', title: 'Call us now' },
    { id: 'contact_request_callback', title: 'Request a callback' },
    { id: 'contact_visit_showroom', title: 'Visit our showroom' }
  ]
});

const contactCallNumbers = () => (
  "Perfect! Here are our direct contact numbers for immediate assistance:\n\nCALL US DIRECTLY:\nMain Showroom - Bangalore:\n- Sales: +91-9876543210\n- Service: +91-9876543211\n- Available: Mon-Sat: 9 AM - 8 PM, Sun: 10 AM - 6 PM\n\nBranch - Electronic City:\n- Sales: +91-9876543212\n- Available: Mon-Sat: 9 AM - 8 PM\n\nEmergency Support:\n- 24/7 Helpline: +91-9876543213\n\nPro Tip: Mention you contacted us via WhatsApp for priority assistance!"
);

const showroomLocations = () => (
  "We'd love to welcome you! Here are our locations:\n\nSHERPA HYUNDAI LOCATIONS:\n\nMain Showroom - Bangalore:\n- Address: 123 MG Road, Bangalore - 560001\n- Phone: +91-9876543210\n- Timings: Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM\n- Facilities: Free parking, Test drive facility, Customer lounge\n\nBranch - Electronic City:\n- Address: 456 Hosur Road, Electronic City - 560100\n- Phone: +91-9876543211\n- Timings: Mon-Sat: 9:00 AM - 8:00 PM\n\nHow to Reach:\n- Metro: MG Road Metro Station (2 min walk)\n- Bus: Multiple bus routes available\n- Car: Easy access from Ring Road"
);

const callbackTimeMenu = () => ({
  type: 'buttons',
  bodyText: "Perfect! Our team will call you back. What's the best time to reach you?",
  buttons: [
    { id: 'cb_time_morning', title: 'Morning (9 AM - 12 PM)' },
    { id: 'cb_time_afternoon', title: 'Afternoon (12 PM - 4 PM)' },
    { id: 'cb_time_evening', title: 'Evening (4 PM - 8 PM)' }
  ]
});

const callbackDateMenu = () => ({
  type: 'buttons',
  bodyText: 'Great! Please choose a date for the callback or send in the format YYYY-MM-DD.',
  buttons: [
    { id: 'cb_date_today', title: 'Today' },
    { id: 'cb_date_tomorrow', title: 'Tomorrow' },
    { id: 'cb_date_custom', title: 'Enter date (YYYY-MM-DD)' }
  ]
});

function parseDateFromInput(input) {
  const iso = (input.match(/(\d{4})-(\d{2})-(\d{2})/) || [])[0];
  const dmy = (input.match(/(\d{2})[-\/.](\d{2})[-\/.](\d{4})/) || [])[0];
  let d;
  if (iso) d = new Date(iso);
  if (!d && dmy) {
    const [_, dd, mm, yyyy] = input.match(/(\d{2})[-\/.](\d{2})[-\/.](\d{4})/);
    d = new Date(`${yyyy}-${mm}-${dd}`);
  }
  if (d && !isNaN(d.getTime())) return d;
  return null;
}

const aboutMenu = () => ({
  type: 'list',
  bodyText: "Welcome to Sherpa Hyundai! Here's what you'd like to know about us:",
  buttonText: 'Browse',
  sections: [
    {
      title: 'About Us',
      rows: [
        { id: 'about_story', title: 'Our Company Story' },
        { id: 'about_why', title: 'Why Choose Us' },
        { id: 'about_locations', title: 'Our Locations' },
        { id: 'about_services', title: 'Our Services' },
        { id: 'about_awards', title: 'Achievements & Awards' }
      ]
    }
  ]
});

const aboutStory = () => (
  "Here's our journey and what makes Sherpa Hyundai special:\n\nWhere It All Began:\nSherpa Hyundai started with a simple mission — to make car buying and ownership a smooth, honest, and enjoyable experience for every customer.\n\nOur Roots:\nWith over 15 years in the automotive industry, we’ve grown from a single dealership to a trusted name in Bangalore for Hyundai cars — both new and certified pre-owned.\n\nCustomer First Approach:\nWe’ve proudly served 10,000+ happy customers, thanks to our commitment to transparency, value, and after-sales care.\n\nWhat Drives Us:\nOur passion is to help families and individuals find the right vehicle that fits their needs, lifestyle, and budget — while delivering 5-star service at every step.\n\nOur Vision:\nTo be the most loved and recommended Hyundai dealership in South India — trusted for both our people and our processes.\n\nWant to explore more?\n- Why Choose Us\n- Our Locations\n- Our Services\n- Achievements & Awards\n- Back to main menu"
);

const aboutWhyUs = () => (
  "Here's why thousands of customers trust Sherpa Hyundai:\n\nWHY CHOOSE SHERPA HYUNDAI:\n\nQuality Assurance:\n- 200+ point inspection on every car\n- Only certified pre-owned vehicles\n- Complete service history verification\n\nBest Value:\n- Competitive pricing\n- Fair trade-in values\n- Transparent pricing - no hidden costs\n\nTrust & Reliability:\n- 15+ years in automotive industry\n- 10,000+ happy customers\n- Extended warranty options\n\nComplete Service:\n- End-to-end car buying support\n- Financing assistance\n- Insurance & documentation help\n\nAfter-Sales Support:\n- Dedicated service team\n- Genuine spare parts\n- Regular maintenance reminders\n\nWant to know more?\n1. Visit our showroom\n2. Browse Used Cars\n3. Contact Us\n4. Back to main menu"
);

const aboutServices = () => (
  "At Sherpa Hyundai, we offer everything you need — from car buying to servicing — all under one roof!\n\nOUR SERVICES INCLUDE:\n\nNew Car Sales\n- Full range of Hyundai models\n- Expert sales consultation\n- Test drive at your convenience\n\nCertified Pre-Owned Cars\n- Thoroughly inspected & certified\n- Transparent pricing & service history\n- Finance & exchange options\n\nVehicle Servicing & Repairs\n- Hyundai-certified technicians\n- Genuine spare parts\n- Quick turnaround & pickup-drop facility\n\nBodyshop & Insurance Claims\n- Accident repairs & dent-paint services\n- Hassle-free insurance claim assistance\n- Cashless facility with major insurers\n\nFinance & Loan Assistance\n- Tie-ups with top banks & NBFCs\n- Best interest rates & fast approvals\n- On-road pricing breakdown\n\nCar Insurance & Renewals\n- Instant insurance quotes\n- Renewal reminders\n- Claim support from start to finish\n\nRC Transfer & Documentation\n- Ownership transfer assistance\n- RTO support\n- Documentation help for resale or exchange\n\nWant to explore a service in detail?\n1. Book a Service (We will call you back shortly)\n2. Browse Used Cars\n3. Talk to Our Team\n4. Back to main menu"
);

const aboutAwards = () => (
  "We're proud to be recognized for our commitment to excellence!\n\nSherpa Hyundai Achievements:\n- Best Customer Experience Dealer – South India (2023)\n- Top Performer in Certified Pre-Owned Sales (2022)\n- Highest Customer Satisfaction Score – Hyundai India (2021)\n- Hyundai Elite Partner Recognition – 3 Years in a Row\n\nWhat These Awards Mean for You:\n- Transparent & customer-friendly processes\n- Consistent service excellence\n- Trusted by thousands of happy customers\n\nOur real achievement?\nYour trust, referrals, and repeat visits — that’s what drives us every day!"
);

export async function handleDeterministicFlows(userId, text) {
  const input = String(text || '').trim();
  const lower = input.toLowerCase();
  const session = getSession(userId);
  
  // Handle restart/reset commands and greetings - MUST be checked first before any state checks
  // This allows users to restart conversation at any time by saying hi, hello, restart, etc.
  const isRestartCommand = /^(hi|hello|hey|restart|reset|start over)$/i.test(input.trim()) || 
                           lower.includes('restart') || lower.includes('reset') || lower.includes('start over');
  
  if (isRestartCommand) {
    // Preserve language preference before clearing session
    const preservedLang = session.data?.language || 'english';
    
    // Clear session state completely (but preserve language preference)
    session.state = null;
    session.data = { language: preservedLang };
    setSession(userId, session);
    
    // Return greeting based on preserved language
    const greetingMessages = {
      english: 'Hello! Welcome to Sherpa Hyundai! How can I help you today?',
      hinglish: 'Namaste! Sherpa Hyundai mein aapka swagat hai! Aaj main aapki kaise madad kar sakta hun?',
      hindi: 'नमस्ते! शेरपा हुंडई में आपका स्वागत है! आज मैं आपकी कैसे मदद कर सकता हूं?',
      kannada: 'ನಮಸ್ಕಾರ! ಶೆರ್ಪಾ ಹುಂಡೈಗೆ ಸ್ವಾಗತ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      marathi: 'नमस्कार! शेरपा हुंडईमध्ये आपले स्वागत आहे! आज मी तुमची कशी मदत करू शकतो?'
    };
    return greetingMessages[preservedLang] || greetingMessages.english;
  }
  
  // Enhanced context retention - don't restart conversation if user is in middle of a flow
  // IMPORTANT: If user has an active session state, don't treat any input as restart unless explicitly requested
  if (session.state && session.state !== 'null' && 
      !isRestartCommand && 
      !lower.includes('hi') && !lower.includes('hello') && !lower.includes('start over') && 
      !lower.includes('reset') && !lower.includes('restart')) {
    // Continue with existing flow instead of restarting
    // This prevents the bot from restarting conversations unexpectedly
    // All state-specific handlers below will process the input
  }
  
  // Detect language and set user preference using centralized detection
  const detectedLang = detectLanguage(input);
  
  // Set language preference based on detected language
  session.data = session.data || {};
  if (detectedLang !== session.data.language) {
    const tokenCount = (input.trim().match(/\S+/g) || []).length;
    const priorLang = session.data.language;
    // Do not downgrade from Hinglish/Hindi to English on short tokens (e.g., brand names)
    const shouldPreservePrior = (priorLang === 'hinglish' || priorLang === 'hindi') && detectedLang === 'english' && tokenCount <= 2;
    if (!shouldPreservePrior) {
      session.data.language = detectedLang;
      setSession(userId, session);
    }
  }
  
  const userLang = session.data?.language || 'english';
  
  // Direct about us content access (before session state checks)
  if (lower.includes('about_story') || lower.includes('our company story')) {
    return aboutStory();
  }
  if (lower.includes('about_why') || lower.includes('why choose us')) {
    return aboutWhyUs();
  }
  if (lower.includes('about_locations') || lower.includes('our locations')) {
    return showroomLocations();
  }
  if (lower.includes('about_services') || lower.includes('our services')) {
    return aboutServices();
  }
  if (lower.includes('about_awards') || lower.includes('achievements')) {
    return aboutAwards();
  }
  
  // Enhanced car search detection for multiple languages with fuzzy spelling
  const fuzzySpellingMap = {
    'laksh': 'lakh', 'laks': 'lakh', 'lak': 'lakh',
    'bellow': 'below', 'belwo': 'below',
    'hundai': 'hyundai', 'hundi': 'hyundai',
    'maruti suzuki': 'maruti', 'maruti suzuki': 'maruti',
    'tata': 'tata', 'TATA': 'tata'
  };
  
  // Apply fuzzy spelling corrections
  let correctedInput = input;
  for (const [wrong, correct] of Object.entries(fuzzySpellingMap)) {
    correctedInput = correctedInput.replace(new RegExp(wrong, 'gi'), correct);
  }
  
  // Define correctedLower for use throughout the function
  const correctedLower = correctedInput.toLowerCase();
  
  // Helper function to extract budget from message (defined early for use in car buying intent)
  const extractBudgetFromMessage = () => {
    // Handle various lakh patterns with fuzzy spelling
    const lakhs = correctedInput.match(/(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks|laksh)/i);
    const below = /(under|below|upto|up to|less than)\s*(?:₹)?\s*(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks|laksh)/i.exec(correctedLower);
    const belowNumeric = /(under|below|upto|up to|less than)\s*(?:₹)?\s*(\d{5,12})/i.exec(correctedInput.replace(/[,₹\s]/g, ''));
    const numeric = correctedInput.replace(/[,₹\s]/g, '').match(/(\d{5,12})/);
    
    if (below) return Math.round(parseFloat(below[2]) * 100000);
    if (belowNumeric) return Number(belowNumeric[2]);
    if (lakhs) return Math.round(parseFloat(lakhs[1]) * 100000);
    if (numeric) return Number(numeric[1]);
    return null;
  };
  
  if (!session.state && (
    lower.includes('कार खरीदना') || lower.includes('कार खरीद') || lower.includes('कार') ||
    lower.includes('ಕಾರು ಖರೀದಿಸಲು') || lower.includes('ಕಾರು') || lower.includes('ಕಾರು ಹುಡುಕಿ') ||
    lower.includes('कार खरेदी') || lower.includes('गाडी') ||
    lower.includes('buy car') || lower.includes('looking for car') || lower.includes('car search') ||
    // Hinglish patterns
    lower.includes('car khareedna') || lower.includes('second hand car') || lower.includes('car dekh') ||
    lower.includes('car lena') || lower.includes('car chahiye') ||
    // Enhanced patterns for better intent recognition
    lower.includes('need a used car') || lower.includes('looking for a vehicle') || 
    lower.includes('suitable for my family') || lower.includes('family of') ||
    lower.includes('vehicle under') || lower.includes('car under') ||
    lower.includes('used cars under') || lower.includes('cars under') || lower.includes('cars below') ||
    lower.includes('cars around') || lower.includes('show me cars') || lower.includes('can you show') ||
    lower.includes('do you have') && lower.includes('car')
  )) {
    session.data = session.data || {};
    
    // Try to extract budget from the message first
    const extractedBudget = extractBudgetFromMessage();
    if (extractedBudget) {
      session.data.maxPrice = extractedBudget;
      session.data.minPrice = 0;
      session.state = 'browse_pick_type';
      setSession(userId, session);
      
      const typeMessages = {
        english: `Great! Budget up to ₹${extractedBudget.toLocaleString('en-IN')}.\nPick a body type: Hatchback | MPV | SUV | Sedan\nOr type "any type" to see all types.`,
        hinglish: `Bahut badhiya! Budget up to ₹${extractedBudget.toLocaleString('en-IN')}.\nBody type choose karein: Hatchback | MPV | SUV | Sedan\nYa "any type" type karein sabhi types ke liye.`,
        hindi: `बहुत बढ़िया! बजट ₹${extractedBudget.toLocaleString('en-IN')} तक।\nकार का प्रकार चुनें: Hatchback | MPV | SUV | Sedan\nया "any type" टाइप करें सभी प्रकारों के लिए।`,
        kannada: `ಚೆನ್ನಾಗಿದೆ! ಬಜೆಟ್ ₹${extractedBudget.toLocaleString('en-IN')} ವರೆಗೆ।\nಬಾಡಿ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ: Hatchback | MPV | SUV | Sedan\nಅಥವಾ ಎಲ್ಲಾ ಪ್ರಕಾರಗಳಿಗೆ "any type" ಟೈಪ್ ಮಾಡಿ।`,
        marathi: `छान! बजेट ₹${extractedBudget.toLocaleString('en-IN')} पर्यंत।\nकारचा प्रकार निवडा: Hatchback | MPV | SUV | Sedan\nकिंवा सर्व प्रकारांसाठी "any type" टाइप करा।`
      };
      
      return typeMessages[userLang] || typeMessages.english;
    }
    
    // If no budget found, ask for it
    session.state = 'browse_budget';
    setSession(userId, session);
    
    const budgetMessages = {
      english: "What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.",
      hinglish: "Aapka budget kya hai? (Maximum)\nAap values type kar sakte hain jaise '12 lakhs', 'below 20 lakhs', ya number jaise 1200000.",
      hindi: "आपका बजट क्या है? (अधिकतम)\nआप '12 लाख', '20 लाख से कम', या 1200000 जैसी संख्या टाइप कर सकते हैं।",
      kannada: "ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು? (ಗರಿಷ್ಠ)\nನೀವು '12 ಲಕ್ಷ', '20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', ಅಥವಾ 1200000 ನಂತಹ ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.",
      marathi: "तुमचा बजेट किती? (जास्तीत जास्त)\nतुम्ही '12 लाख', '20 लाख खाली', किंवा 1200000 सारख्या संख्या टाइप करू शकता."
    };
    
    return budgetMessages[userLang] || budgetMessages.english;
  }
  
  // Enhanced car comparison flow with multilingual support
  const compareMatch = /\bcompare\b\s+([\w\s-]+)\s+and\s+([\w\s-]+)/i.exec(input);
  const hinglishCompareMatch = /(compare|तुलना|तुलना करना|compare karna|तुलना करें)\s+([\w\s-]+)\s+(aur|and|और|के साथ|और)\s+([\w\s-]+)/i.exec(input);
  const hindiCompareMatch = /([\w\s]+)\s+(और|के साथ)\s+([\w\s]+)\s+(की तुलना|तुलना|compare)/i.exec(input);
  
  if (!session.state && (compareMatch || hinglishCompareMatch || hindiCompareMatch)) {
    let car1, car2;
    
    if (compareMatch) {
      car1 = compareMatch[1].trim();
      car2 = compareMatch[2].trim();
    } else if (hinglishCompareMatch) {
      car1 = hinglishCompareMatch[2].trim();
      car2 = hinglishCompareMatch[4].trim();
    } else if (hindiCompareMatch) {
      car1 = hindiCompareMatch[1].trim();
      car2 = hindiCompareMatch[3].trim();
    }
    
    try {
      const { compareCarsTool } = await import('./tools.js');
      const result = await compareCarsTool({ car1, car2 });
      if (!result.ok) {
        const errorMessages = {
          english: `I couldn't find those in the inventory. Could you check the names?`,
          hindi: `मुझे इन्वेंटरी में ये कारें नहीं मिलीं। कृपया नाम जांचें।`,
          kannada: `ಇನ್ವೆಂಟರಿಯಲ್ಲಿ ಆ ಕಾರುಗಳು ಸಿಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೆಸರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`,
          marathi: `मला इन्व्हेंटरीमध्ये त्या कारा सापडल्या नाहीत. कृपया नावे तपासा.`
        };
        return errorMessages[userLang] || errorMessages.english;
      }
      
      const c1 = result.car1; 
      const c2 = result.car2;
      const line = (c) => c ? `${c.make} ${c.model} • ₹${(c.price||0).toLocaleString('en-IN')} • ${c.fuel||'N/A'} • ${c.mileage||'N/A'} km` : 'N/A';
      
      const comparisonMessages = {
        english: `Here's a quick comparison:\n\n• ${line(c1)}\n• ${line(c2)}\n\nAnything specific you'd like me to compare (price, mileage, features)?`,
        hindi: `यहाँ त्वरित तुलना है:\n\n• ${line(c1)}\n• ${line(c2)}\n\nक्या आप चाहते हैं कि मैं कुछ विशिष्ट चीज़ों की तुलना करूं (कीमत, माइलेज, फीचर्स)?`,
        kannada: `ಇಲ್ಲಿ ತ್ವರಿತ ಹೋಲಿಕೆ:\n\n• ${line(c1)}\n• ${line(c2)}\n\nನೀವು ನಿರ್ದಿಷ್ಟವಾಗಿ ಏನನ್ನಾದರೂ ಹೋಲಿಸಲು ಬಯಸುತ್ತೀರಾ (ಬೆಲೆ, ಮೈಲೇಜ್, ವೈಶಿಷ್ಟ್ಯಗಳು)?`,
        marathi: `येथे त्वरित तुलना आहे:\n\n• ${line(c1)}\n• ${line(c2)}\n\nतुम्हाला काही विशिष्ट गोष्टींची तुलना करायची आहे का (किंमत, माइलेज, फीचर्स)?`
      };
      
      return comparisonMessages[userLang] || comparisonMessages.english;
    } catch (_) {
      // fallthrough to Gemini
    }
  }

  // Enhanced contact information flow with multilingual support
  // IMPORTANT: Only trigger if NOT in test drive flow (test drive location uses "showroom" keyword)
  if (!session.state?.startsWith('testdrive') && 
      (['3', 'contact', 'contact our team', 'contact us', 'team', 'showroom', 'address', 'location', 'phone'].includes(lower) ||
      lower.includes('contact') || (lower.includes('showroom') && !lower.includes('main showroom') && !lower.includes('test drive')) || lower.includes('address') || 
      (lower.includes('location') && !lower.includes('test drive')) || lower.includes('phone') || lower.includes('पता') || 
      lower.includes('संपर्क') || lower.includes('शोरूम') || lower.includes('फोन') ||
      lower.includes('contact janna') || lower.includes('address chahiye') || lower.includes('phone number'))) {
    session.state = 'contact_menu';
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const contactMessages = {
      english: contactMenu(),
      hindi: isHinglish ? 
        `Main aapko hamari team se jodne mein khushi hoga! Aap kaise contact karna chahte hain?\n\n1. **Abhi call karein** - turant sahayata ke liye\n2. **Callback maangein** - hamari team aapko call karegi\n3. **Hamare showroom aayein** - sthan aur samay ki jaankari\n\nKripya 1, 2, ya 3 type karein.` :
        `मैं आपको हमारी टीम से जुड़ने में खुशी होगी! आप कैसे संपर्क करना चाहते हैं?\n\n1. **अभी कॉल करें** - तुरंत सहायता के लिए\n2. **कॉलबैक मांगें** - हमारी टीम आपको कॉल करेगी\n3. **हमारे शोरूम आएं** - स्थान और समय की जानकारी\n\nकृपया 1, 2, या 3 टाइप करें।`,
      kannada: `ನಮ್ಮ ತಂಡದೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಲು ನಾನು ಸಂತೋಷದಿಂದ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ! ನೀವು ಹೇಗೆ ಸಂಪರ್ಕಿಸಲು ಬಯಸುತ್ತೀರಿ?\n\n1. **ಈಗ ಕರೆ ಮಾಡಿ** - ತಕ್ಷಣ ಸಹಾಯಕ್ಕಾಗಿ\n2. **ಕಾಲ್ಬ್ಯಾಕ್ ವಿನಂತಿಸಿ** - ನಮ್ಮ ತಂಡವು ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತದೆ\n3. **ನಮ್ಮ ಶೋರೂಮ್ ಬನ್ನಿ** - ಸ್ಥಳ ಮತ್ತು ಸಮಯದ ಮಾಹಿತಿ\n\nದಯವಿಟ್ಟು 1, 2, ಅಥವಾ 3 ಟೈಪ್ ಮಾಡಿ.`,
      marathi: `मी तुमच्याला आमच्या टीमशी जोडण्यात आनंद होईल! तुम्ही कसे संपर्क साधू इच्छिता?\n\n1. **आत्ता कॉल करा** - त्वरित सहायतेसाठी\n2. **कॉलबॅक मागा** - आमची टीम तुम्हाला कॉल करेल\n3. **आमच्या शोरूमला या** - स्थान आणि वेळेची माहिती\n\nकृपया 1, 2, किंवा 3 टाइप करा.`
    };
    
    return contactMessages[userLang] || contactMessages.english;
  }
  if (['4', 'about', 'about us'].includes(lower) || lower.includes('about') ||
      lower.includes('aapke bare mein') || lower.includes('company ke bare mein') || lower.includes('business ke bare mein') ||
      lower.includes('aapke bare mein batao') || lower.includes('company information') || lower.includes('about us chahiye')) {
    session.state = 'about_menu';
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    if (isHinglish) {
      const aboutMessages = {
        english: aboutMenu(),
        hindi: `Sherpa Hyundai mein aapka swagat hai! Yahan aapko hamare bare mein kya janna hai:\n\n1. **Hamari Company Story** - Hamara safar aur vikas\n2. **Kyun Choose Karen** - Hamare advantages\n3. **Hamare Locations** - Showroom ki jaankari\n4. **Hamare Services** - Kya services dete hain\n5. **Achievements & Awards** - Hamare awards aur recognition\n\nKripya 1, 2, 3, 4, ya 5 type karein.`,
        kannada: `ಶೆರ್ಪಾ ಹುಂಡೈಗೆ ಸ್ವಾಗತ! ನಮ್ಮ ಬಗ್ಗೆ ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ:\n\n1. **ನಮ್ಮ ಕಂಪನಿ ಕಥೆ** - ನಮ್ಮ ಪ್ರಯಾಣ ಮತ್ತು ಬೆಳವಣಿಗೆ\n2. **ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು** - ನಮ್ಮ ಪ್ರಯೋಜನಗಳು\n3. **ನಮ್ಮ ಸ್ಥಳಗಳು** - ಶೋರೂಮ್ ಮಾಹಿತಿ\n4. **ನಮ್ಮ ಸೇವೆಗಳು** - ಯಾವ ಸೇವೆಗಳನ್ನು ನೀಡುತ್ತೇವೆ\n5. **ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಪ್ರಶಸ್ತಿಗಳು** - ನಮ್ಮ ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಗುರುತಿಸುವಿಕೆ\n\nದಯವಿಟ್ಟು 1, 2, 3, 4, ಅಥವಾ 5 ಟೈಪ್ ಮಾಡಿ.`,
        marathi: `शेरपा हुंडईमध्ये आपले स्वागत आहे! आमच्या बद्दल तुम्हाला काय जाणून घ्यायचे आहे:\n\n1. **आमची कंपनी कथा** - आमचा प्रवास आणि विकास\n2. **का निवडावे** - आमचे फायदे\n3. **आमची ठिकाणे** - शोरूम माहिती\n4. **आमच्या सेवा** - कोणत्या सेवा देतो\n5. **पुरस्कार आणि पुरस्कार** - आमचे पुरस्कार आणि ओळख\n\nकृपया 1, 2, 3, 4, किंवा 5 टाइप करा.`
      };
      
      return aboutMessages[userLang] || aboutMessages.english;
    }
    
    return aboutMenu();
  }
  
  // Insurance information flow with multilingual support
  if (['insurance', 'car insurance', 'insurance policy', 'insurance premium', 'insurance quote'].includes(lower) ||
      lower.includes('insurance') || lower.includes('policy') || lower.includes('premium') ||
      lower.includes('बीमा') || lower.includes('इंश्योरेंस') || lower.includes('पॉलिसी') ||
      lower.includes('insurance janna') || lower.includes('policy chahiye') || lower.includes('premium kitna')) {
    session.state = 'insurance_inquiry';
    session.data = {};
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const insuranceMessages = {
      english: `Great! I'll help you with car insurance information. Please provide:\n\n**Vehicle Details:**\n• Car Model: (e.g., Hyundai i20, Maruti Swift)\n• Year of Purchase: (e.g., 2020, 2021)\n• Current Value: (e.g., ₹8,00,000)\n• Previous Claims: (Yes/No)\n\n**Coverage Type:**\n• Comprehensive (Full Coverage)\n• Third Party (Basic Coverage)\n• Zero Depreciation\n\nPlease share all details in one message.`,
      hindi: isHinglish ? 
        `Bahut badhiya! Main aapko car insurance ki jaankari mein madad karunga. Kripya ye details dein:\n\n**Gaadi ki jaankari:**\n• Car Model: (jaise, Hyundai i20, Maruti Swift)\n• Year of Purchase: (jaise, 2020, 2021)\n• Current Value: (jaise, ₹8,00,000)\n• Previous Claims: (Yes/No)\n\n**Coverage Type:**\n• Comprehensive (Full Coverage)\n• Third Party (Basic Coverage)\n• Zero Depreciation\n\nKripya saari jaankari ek saath bhejein.` :
        `बहुत बढ़िया! मैं आपको कार इंश्योरेंस की जानकारी में मदद करूंगा। कृपया जानकारी दें:\n\n**गाड़ी की जानकारी:**\n• कार मॉडल: (जैसे, हुंडई i20, मारुति स्विफ्ट)\n• खरीद का साल: (जैसे, 2020, 2021)\n• वर्तमान मूल्य: (जैसे, ₹8,00,000)\n• पिछले क्लेम: (हाँ/नहीं)\n\n**कवरेज का प्रकार:**\n• कॉम्प्रिहेंसिव (पूर्ण कवरेज)\n• थर्ड पार्टी (बेसिक कवरेज)\n• जीरो डिप्रीसिएशन\n\nकृपया सभी जानकारी एक साथ भेजें।`,
      kannada: `ಚೆನ್ನಾಗಿದೆ! ನಾನು ನಿಮಗೆ ಕಾರ್ ವಿಮೆಯ ಮಾಹಿತಿಯಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಒದಗಿಸಿ:\n\n**ವಾಹನದ ವಿವರಗಳು:**\n• ಕಾರ್ ಮಾಡೆಲ್: (ಉದಾ, ಹುಂಡೈ i20, ಮಾರುತಿ ಸ್ವಿಫ್ಟ್)\n• ಖರೀದಿಯ ವರ್ಷ: (ಉದಾ, 2020, 2021)\n• ಪ್ರಸ್ತುತ ಮೌಲ್ಯ: (ಉದಾ, ₹8,00,000)\n• ಹಿಂದಿನ ಹಕ್ಕುಗಳು: (ಹೌದು/ಇಲ್ಲ)\n\n**ಕವರೇಜ್ ಪ್ರಕಾರ:**\n• ಸಮಗ್ರ (ಪೂರ್ಣ ಕವರೇಜ್)\n• ಮೂರನೇ ಪಕ್ಷ (ಮೂಲಭೂತ ಕವರೇಜ್)\n• ಶೂನ್ಯ ಸವಕಲು\n\nದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಒಂದೇ ಸಂದೇಶದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ.`,
      marathi: `छान! मी तुम्हाला कार विम्याच्या माहितीत मदत करेन. कृपया माहिती द्या:\n\n**गाडीची माहिती:**\n• गाडीचे मॉडेल: (जसे, हुंडई i20, मारुती स्विफ्ट)\n• खरेदीचे वर्ष: (जसे, 2020, 2021)\n• सध्याचे मूल्य: (जसे, ₹8,00,000)\n• मागील दावे: (होय/नाही)\n\n**कव्हरेजचा प्रकार:**\n• व्यापक (पूर्ण कव्हरेज)\n• तृतीय पक्ष (मूलभूत कव्हरेज)\n• शून्य घसारा\n\nकृपया सर्व माहिती एकाच संदेशात सांगा.`
    };
    
    return insuranceMessages[userLang] || insuranceMessages.english;
  }

  // Language switching
  if (lower.includes('language') || lower.includes('भाषा') || lower.includes('ಭಾಷೆ') || lower.includes('भाषा')) {
    session.state = 'language_selection';
    setSession(userId, session);
    return `🌐 **Select Language / भाषा चुनें / ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ / भाषा निवडा**

1. **English** 🇺🇸
2. **Hindi** 🇮🇳 (हिंदी)
3. **Kannada** 🇮🇳 (ಕನ್ನಡ)
4. **Marathi** 🇮🇳 (मराठी)

Please type the number (1-4) or language name.`;
  }

  // Enhanced service booking entry with multilingual support
  if (!session.state && (['book service', 'service booking', 'schedule service', 'book a service', 'service'].includes(lower) || 
      lower.includes('book service') || lower.includes('service booking') || lower.includes('schedule service') ||
      lower.includes('book a service') || lower.includes('सर्विस') || lower.includes('सर्विस बुक') ||
      lower.includes('service karva') || lower.includes('service chahiye') || lower.includes('गाड़ी की सर्विस'))) {
    session.state = 'service_booking';
    session.data = {};
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const serviceMessages = {
      english: `Great! I'll help you book a service for your vehicle. Please provide the following details:\n\n**Vehicle Details:**\n• Make: (e.g., Hyundai, Maruti, Honda)\n• Model: (e.g., i20, Swift, City)\n• Year: (e.g., 2020, 2021)\n• Registration Number: (e.g., KA01AB1234)\n\n**Service Type:**\n• Regular Service\n• Major Service\n• Accident Repair\n• Insurance Claim\n• Other (please specify)\n\nPlease share all details in one message.`,
      hindi: isHinglish ? 
        `Bahut badhiya! Main aapki gaadi ki service book karne mein madad karunga. Kripya ye details dein:\n\n**Gaadi ki jaankari:**\n• Brand: (jaise, Hyundai, Maruti, Honda)\n• Model: (jaise, i20, Swift, City)\n• Saal: (jaise, 2020, 2021)\n• Registration Number: (jaise, KA01AB1234)\n\n**Service ka type:**\n• Regular Service\n• Major Service\n• Accident Repair\n• Insurance Claim\n• Other (kripya batayein)\n\nKripya saari jaankari ek saath bhejein.` :
        `बहुत बढ़िया! मैं आपकी गाड़ी की सर्विस बुक करने में मदद करूंगा। कृपया निम्नलिखित जानकारी दें:\n\n**गाड़ी की जानकारी:**\n• ब्रांड: (जैसे, हुंडई, मारुति, होंडा)\n• मॉडल: (जैसे, i20, स्विफ्ट, सिटी)\n• साल: (जैसे, 2020, 2021)\n• रजिस्ट्रेशन नंबर: (जैसे, KA01AB1234)\n\n**सर्विस का प्रकार:**\n• रेगुलर सर्विस\n• मेजर सर्विस\n• एक्सीडेंट रिपेयर\n• इंश्योरेंस क्लेम\n• अन्य (कृपया बताएं)\n\nकृपया सभी जानकारी एक साथ भेजें।`,
      kannada: `ಚೆನ್ನಾಗಿದೆ! ನಿಮ್ಮ ವಾಹನಕ್ಕಾಗಿ ಸೇವೆಯನ್ನು ಬುಕ್ ಮಾಡಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಈ ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ:\n\n**ವಾಹನದ ವಿವರಗಳು:**\n• ಮೇಕ್: (ಉದಾ, ಹುಂಡೈ, ಮಾರುತಿ, ಹೋಂಡಾ)\n• ಮಾಡೆಲ್: (ಉದಾ, i20, ಸ್ವಿಫ್ಟ್, ಸಿಟಿ)\n• ವರ್ಷ: (ಉದಾ, 2020, 2021)\n• ನೋಂದಣಿ ಸಂಖ್ಯೆ: (ಉದಾ, KA01AB1234)\n\n**ಸೇವೆಯ ಪ್ರಕಾರ:**\n• ನಿಯಮಿತ ಸೇವೆ\n• ಪ್ರಮುಖ ಸೇವೆ\n• ಅಪಘಾತ ದುರಸ್ತಿ\n• ವಿಮೆ ಹಕ್ಕು\n• ಇತರೆ (ದಯವಿಟ್ಟು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ)\n\nದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಒಂದೇ ಸಂದೇಶದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ.`,
      marathi: `छान! मी तुमच्या गाडीची सर्विस बुक करण्यात मदत करेन. कृपया खालील माहिती द्या:\n\n**गाडीची माहिती:**\n• ब्रँड: (जसे, हुंडई, मारुती, होंडा)\n• मॉडेल: (जसे, i20, स्विफ्ट, सिटी)\n• वर्ष: (जसे, 2020, 2021)\n• नोंदणी क्रमांक: (जसे, KA01AB1234)\n\n**सर्विसचा प्रकार:**\n• नियमित सर्विस\n• मुख्य सर्विस\n• अपघात दुरुस्ती\n• विमा दावा\n• इतर (कृपया सांगा)\n\nकृपया सर्व माहिती एकाच संदेशात सांगा.`
    };
    
    return serviceMessages[userLang] || serviceMessages.english;
  }

  // Enhanced budget extraction with fuzzy spelling and better pattern matching
  const extractBudget = () => {
    // Use corrected input for better matching
    
    // Handle various lakh patterns with fuzzy spelling
    const lakhs = correctedInput.match(/(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks|laksh)/i);
    const below = /(under|below|upto|up to|less than)\s+(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks|laksh)/i.exec(correctedLower);
    const numeric = correctedInput.replace(/[,₹\s]/g, '').match(/(\d{5,12})/);
    
    if (lakhs) return Math.round(parseFloat(lakhs[1]) * 100000);
    if (below) return Math.round(parseFloat(below[2]) * 100000);
    if (numeric) return Number(numeric[1]);
    return null;
  };
  const extractType = () => {
    const m = /(hatchback|sedan|suv|mpv)/i.exec(correctedLower);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : undefined;
  };

  // Enhanced brand extraction with better mapping
  const extractBrand = () => {
    const brandMappings = {
      'maruti': 'maruti', 'maruti suzuki': 'maruti', 'maruti-suzuki': 'maruti',
      'tata': 'tata', 'TATA': 'tata', 'tata motors': 'tata',
      'hyundai': 'hyundai', 'hundai': 'hyundai', 'hundi': 'hyundai',
      'honda': 'honda',
      'toyota': 'toyota',
      'ford': 'ford',
      'volkswagen': 'volkswagen', 'vw': 'volkswagen',
      'skoda': 'skoda',
      'renault': 'renault',
      'kia': 'kia',
      'mahindra': 'mahindra'
    };
    
    for (const [inputBrand, mappedBrand] of Object.entries(brandMappings)) {
      if (correctedLower.includes(inputBrand.toLowerCase())) {
        return mappedBrand;
      }
    }
    return null;
  };

  // Enhanced browse flow with better context retention and fuzzy matching
  if (!session.state && (/^(browse|used cars|show cars|i want to buy|looking for a car|search used cars)$/i.test(lower.trim()) ||
      lower.includes('show me cars') || lower.includes('can you show') && lower.includes('car'))) {
    session.data = session.data || {};
    
    // Extract information from current input
      const b = extractBudget();
      const t = extractType();
    const brand = extractBrand();
    
    // Update session data with extracted information
    if (b && !session.data.maxPrice) {
      session.data.maxPrice = b;
      session.data.minPrice = 0;
    }
    if (t && !session.data.type) {
      session.data.type = t;
    }
    if (brand && !session.data.make) {
      session.data.make = brand;
    }
    
    setSession(userId, session);

    // Ask only the missing piece, in order: budget -> type -> brand
    if (!session.data.maxPrice) {
      session.state = 'browse_budget'; 
      setSession(userId, session);
      const budgetMessages = {
        english: "What's your budget (maximum)? You can type '12 lakhs' or a number like 1200000.",
        hinglish: "Aapka budget kya hai? (Maximum) Aap '12 lakhs' ya number jaise 1200000 type kar sakte hain.",
        hindi: "आपका बजट क्या है? (अधिकतम) आप '12 लाख' या 1200000 जैसी संख्या टाइप कर सकते हैं।",
        kannada: "ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು? (ಗರಿಷ್ಠ) ನೀವು '12 ಲಕ್ಷ' ಅಥವಾ 1200000 ನಂತಹ ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.",
        marathi: "तुमचा बजेट किती? (जास्तीत जास्त) तुम्ही '12 लाख' किंवा 1200000 सारख्या संख्या टाइप करू शकता."
      };
      return budgetMessages[userLang] || budgetMessages.english;
    }
    if (!session.data.type) {
      session.state = 'browse_pick_type'; 
      setSession(userId, session);
      return 'Pick a body type: Hatchback | Sedan | SUV | MPV';
    }
    if (!session.data.make) {
      session.state = 'browse_pick_make'; 
      setSession(userId, session);
      try {
        const { listMakesTool } = await import('./tools.js');
        const { makes = [] } = await listMakesTool();
        return `Select a brand (${session.data.type}): ${makes.slice(0,30).join(' | ')}`;
      } catch (_) {
        return 'Please type a brand (make), e.g., Toyota';
      }
    }

    // We have budget + type + brand: show results list to select
    const { searchInventoryTool } = await import('./tools.js');
    const { results } = await searchInventoryTool({ 
      make: session.data.make, 
      type: session.data.type, 
      maxPrice: session.data.maxPrice, 
      minPrice: session.data.minPrice 
    });
    
    if (!results || results.length === 0) {
      return 'No matches found. You can change brand or budget.';
    }
    
    session.state = 'browse_pick_vehicle';
    session.data.vehicles = results.slice(0, 10);
    setSession(userId, session);
    
    const trimTo = (s, n) => {
      const str = String(s || '');
      return str.length <= n ? str : str.slice(0, n - 1) + '…';
    };
    
    const rows = session.data.vehicles.map(v => ({ 
      id: `pick_vehicle:${v.id}`, 
      title: trimTo(`${v.brand || v.make || ''} ${v.model || ''}`.trim(), 24), 
      description: trimTo(`Yr ${v.year || 'NA'} • ${v.fuel_type || v.fuel || 'NA'} • ${(v.transmission||'').toString() || 'NA'} • ${(v.mileage||0).toLocaleString('en-IN')}km • ₹${(v.price||0).toLocaleString('en-IN')}`, 72) 
    }));
    
    return { type: 'list', bodyText: 'Select a car to see details:', buttonText: 'Select', sections: [{ title: 'Results', rows }] };
  }

  // Handle direct body-type mentions like "SUV", "sedan", etc. to start browse funnel
  if (!session.state && /\b(hatchback|sedan|suv|mpv)s?\b/i.test(correctedLower)) {
    const m = /(hatchback|sedan|suv|mpv)/i.exec(correctedLower);
    const type = m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : undefined;
    session.data = { ...(session.data || {}), type };
    
    // Check if budget is already mentioned in the same message
    const budget = extractBudget();
    if (budget) {
      session.data.maxPrice = budget;
      session.data.minPrice = 0;
      session.state = 'browse_pick_make';
      setSession(userId, session);
    try {
      const { listMakesTool } = await import('./tools.js');
      const { makes = [] } = await listMakesTool();
        return `Great! ${type} under ₹${budget.toLocaleString('en-IN')}. Select a brand: ${makes.slice(0,30).join(' | ')}`;
      } catch (_) {
        return `Great! ${type} under ₹${budget.toLocaleString('en-IN')}. Please type a brand (make), e.g., Toyota`;
      }
    }
    
    session.state = 'browse_budget'; 
    setSession(userId, session);
    const budgetMessages = {
      english: "Great! What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.",
      hinglish: "Bahut badhiya! Aapka budget kya hai? (Maximum)\nAap values type kar sakte hain jaise '12 lakhs', 'below 20 lakhs', ya number jaise 1200000.",
      hindi: "बहुत बढ़िया! आपका बजट क्या है? (अधिकतम)\nआप '12 लाख', '20 लाख से कम', या 1200000 जैसी संख्या टाइप कर सकते हैं।",
      kannada: "ಬಹಳ ಚೆನ್ನಾಗಿದೆ! ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು? (ಗರಿಷ್ಠ)\nನೀವು '12 ಲಕ್ಷ', '20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', ಅಥವಾ 1200000 ನಂತಹ ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.",
      marathi: "खूप छान! तुमचा बजेट किती? (जास्तीत जास्त)\nतुम्ही '12 लाख', '20 लाख खाली', किंवा 1200000 सारख्या संख्या टाइप करू शकता."
    };
    return budgetMessages[userLang] || budgetMessages.english;
  }

  // Enhanced brand handling with better pattern matching
  if (!session.state && /^(i want|looking for|show me|find me).*car/i.test(correctedLower.trim())) {
    const brand = extractBrand();
    if (brand) {
      session.data = { ...(session.data || {}), make: brand };
      
      // Check if budget is already mentioned
      const budget = extractBudget();
      if (budget) {
        session.data.maxPrice = budget;
        session.data.minPrice = 0;
        session.state = 'browse_pick_type';
        setSession(userId, session);
        return `Great! ${brand} under ₹${budget.toLocaleString('en-IN')}. Pick a body type: Hatchback | Sedan | SUV | MPV`;
      }
      
      session.state = 'browse_budget'; 
      setSession(userId, session);
      const brandMessages = {
        english: `Great — ${brand} it is. What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.`,
        hinglish: `Bahut badhiya — ${brand} it is. Aapka budget kya hai? (Maximum)\nAap values type kar sakte hain jaise '12 lakhs', 'below 20 lakhs', ya number jaise 1200000.`,
        hindi: `बहुत बढ़िया — ${brand} यह है। आपका बजट क्या है? (अधिकतम)\nआप '12 लाख', '20 लाख से कम', या 1200000 जैसी संख्या टाइप कर सकते हैं।`,
        kannada: `ಬಹಳ ಚೆನ್ನಾಗಿದೆ — ${brand} ಇದು. ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು? (ಗರಿಷ್ಠ)\nನೀವು '12 ಲಕ್ಷ', '20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', ಅಥವಾ 1200000 ನಂತಹ ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.`,
        marathi: `खूप छान — ${brand} हे आहे. तुमचा बजेट किती? (जास्तीत जास्त)\nतुम्ही '12 लाख', '20 लाख खाली', किंवा 1200000 सारख्या संख्या टाइप करू शकता.`
      };
      return brandMessages[userLang] || brandMessages.english;
    }
  }

  // Enhanced contact flow with multilingual support
  if (session.state === 'contact_menu') {
    if (lower.startsWith('1') || lower.includes('call us now') || lower.includes('call') || 
        lower.includes('कॉल') || lower.includes('फोन') || lower.includes('call karna')) {
      session.state = null; setSession(userId, session);
      
      const callMessages = {
        english: contactCallNumbers(),
        hindi: `बिल्कुल! यहाँ हमारे डायरेक्ट कॉन्टैक्ट नंबर हैं तुरंत सहायता के लिए:\n\nसीधे कॉल करें:\nमुख्य शोरूम - बैंगलोर:\n- सेल्स: +91-9876543210\n- सर्विस: +91-9876543211\n- उपलब्ध: सोम-शनि: सुबह 9 - शाम 8, रवि: सुबह 10 - शाम 6\n\nब्रांच - इलेक्ट्रॉनिक सिटी:\n- सेल्स: +91-9876543212\n- उपलब्ध: सोम-शनि: सुबह 9 - शाम 8\n\nइमरजेंसी सपोर्ट:\n- 24/7 हेल्पलाइन: +91-9876543213\n\nप्रो टिप: व्हाट्सऐप के जरिए संपर्क करने का जिक्र करें प्राथमिकता सहायता के लिए!`,
        kannada: `ಸರಿ! ತಕ್ಷಣ ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮ ನೇರ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು ಇಲ್ಲಿವೆ:\n\nನೇರವಾಗಿ ಕರೆ ಮಾಡಿ:\nಮುಖ್ಯ ಶೋರೂಮ್ - ಬೆಂಗಳೂರು:\n- ಮಾರಾಟ: +91-9876543210\n- ಸೇವೆ: +91-9876543211\n- ಲಭ್ಯ: ಸೋಮ-ಶನಿ: ಬೆಳಿಗ್ಗೆ 9 - ಸಂಜೆ 8, ಭಾನು: ಬೆಳಿಗ್ಗೆ 10 - ಸಂಜೆ 6\n\nಶಾಖೆ - ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ:\n- ಮಾರಾಟ: +91-9876543212\n- ಲಭ್ಯ: ಸೋಮ-ಶನಿ: ಬೆಳಿಗ್ಗೆ 9 - ಸಂಜೆ 8\n\nಅತ್ಯವಶ್ಯಕ ಬೆಂಬಲ:\n- 24/7 ಸಹಾಯ ರೇಖೆ: +91-9876543213\n\nಪ್ರೋ ಟಿಪ್: ಪ್ರಾಥಮಿಕತೆ ಸಹಾಯಕ್ಕಾಗಿ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿದ್ದನ್ನು ಉಲ್ಲೇಖಿಸಿ!`,
        marathi: `बिल्कुल! त्वरित सहायतेसाठी आमचे थेट संपर्क क्रमांक येथे आहेत:\n\nथेट कॉल करा:\nमुख्य शोरूम - बंगळूर:\n- विक्री: +91-9876543210\n- सेवा: +91-9876543211\n- उपलब्ध: सोम-शनि: सकाळ 9 - संध्याकाळ 8, रवि: सकाळ 10 - संध्याकाळ 6\n\nशाखा - इलेक्ट्रॉनिक सिटी:\n- विक्री: +91-9876543212\n- उपलब्ध: सोम-शनि: सकाळ 9 - संध्याकाळ 8\n\nआणीबाणी समर्थन:\n- 24/7 मदत रेखा: +91-9876543213\n\nप्रो टिप: प्राधान्य सहायतेसाठी व्हॉट्सऍप मार्गे संपर्क केल्याचा उल्लेख करा!`
      };
      
      return callMessages[userLang] || callMessages.english;
    }
    if (lower.startsWith('2') || lower.includes('request a callback') || lower.includes('callback') ||
        lower.includes('कॉलबैक') || lower.includes('वापस कॉल') || lower.includes('callback chahiye')) {
      session.state = 'contact_callback_time'; setSession(userId, session);
      
      const callbackMessages = {
        english: callbackTimeMenu(),
        hindi: {
          type: 'buttons',
          bodyText: "बिल्कुल! हमारी टीम आपको वापस कॉल करेगी। आपको कब तक पहुंचना है?",
          buttons: [
            { id: 'cb_time_morning', title: 'सुबह (9 AM - 12 PM)' },
            { id: 'cb_time_afternoon', title: 'दोपहर (12 PM - 4 PM)' },
            { id: 'cb_time_evening', title: 'शाम (4 PM - 8 PM)' }
          ]
        },
        kannada: {
          type: 'buttons',
          bodyText: "ಸರಿ! ನಮ್ಮ ತಂಡವು ನಿಮಗೆ ಮರಳಿ ಕರೆ ಮಾಡುತ್ತದೆ. ನಿಮಗೆ ಯಾವಾಗ ತಲುಪಬೇಕು?",
          buttons: [
            { id: 'cb_time_morning', title: 'ಬೆಳಿಗ್ಗೆ (9 AM - 12 PM)' },
            { id: 'cb_time_afternoon', title: 'ಮಧ್ಯಾಹ್ನ (12 PM - 4 PM)' },
            { id: 'cb_time_evening', title: 'ಸಂಜೆ (4 PM - 8 PM)' }
          ]
        },
        marathi: {
          type: 'buttons',
          bodyText: "बिल्कुल! आमची टीम तुम्हाला परत कॉल करेल. तुम्हाला कधी पोहोचायचे आहे?",
          buttons: [
            { id: 'cb_time_morning', title: 'सकाळ (9 AM - 12 PM)' },
            { id: 'cb_time_afternoon', title: 'दुपार (12 PM - 4 PM)' },
            { id: 'cb_time_evening', title: 'संध्याकाळ (4 PM - 8 PM)' }
          ]
        }
      };
      
      return callbackMessages[userLang] || callbackMessages.english;
    }
    if (lower.startsWith('3') || lower.includes('visit our showroom') || lower.includes('showroom') ||
        lower.includes('शोरूम') || lower.includes('पता') || lower.includes('showroom janna')) {
      session.state = null; setSession(userId, session);
      
      const showroomMessages = {
        english: showroomLocations(),
        hindi: `हम आपका स्वागत करना पसंद करेंगे! यहाँ हमारे स्थान हैं:\n\nशेरपा हुंडई स्थान:\n\nमुख्य शोरूम - बैंगलोर:\n- पता: 123 MG रोड, बैंगलोर - 560001\n- फोन: +91-9876543210\n- समय: सोम-शनि: सुबह 9:00 - शाम 8:00, रवि: सुबह 10:00 - शाम 6:00\n- सुविधाएं: मुफ्त पार्किंग, टेस्ट ड्राइव सुविधा, ग्राहक लाउंज\n\nब्रांच - इलेक्ट्रॉनिक सिटी:\n- पता: 456 होसुर रोड, इलेक्ट्रॉनिक सिटी - 560100\n- फोन: +91-9876543211\n- समय: सोम-शनि: सुबह 9:00 - शाम 8:00\n\nकैसे पहुंचें:\n- मेट्रो: MG रोड मेट्रो स्टेशन (2 मिनट पैदल)\n- बस: कई बस रूट उपलब्ध\n- कार: रिंग रोड से आसान पहुंच`,
        kannada: `ನಾವು ನಿಮ್ಮನ್ನು ಸ್ವಾಗತಿಸಲು ಇಷ್ಟಪಡುತ್ತೇವೆ! ನಮ್ಮ ಸ್ಥಳಗಳು ಇಲ್ಲಿವೆ:\n\nಶೆರ್ಪಾ ಹುಂಡೈ ಸ್ಥಳಗಳು:\n\nಮುಖ್ಯ ಶೋರೂಮ್ - ಬೆಂಗಳೂರು:\n- ವಿಳಾಸ: 123 MG ರಸ್ತೆ, ಬೆಂಗಳೂರು - 560001\n- ಫೋನ್: +91-9876543210\n- ಸಮಯ: ಸೋಮ-ಶನಿ: ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 8:00, ಭಾನು: ಬೆಳಿಗ್ಗೆ 10:00 - ಸಂಜೆ 6:00\n- ಸೌಕರ್ಯಗಳು: ಉಚಿತ ಪಾರ್ಕಿಂಗ್, ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಸೌಕರ್ಯ, ಗ್ರಾಹಕ ಲೌಂಜ್\n\nಶಾಖೆ - ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ:\n- ವಿಳಾಸ: 456 ಹೊಸೂರು ರಸ್ತೆ, ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ - 560100\n- ಫೋನ್: +91-9876543211\n- ಸಮಯ: ಸೋಮ-ಶನಿ: ಬೆಳಿಗ್ಗೆ 9:00 - ಸಂಜೆ 8:00\n\nಹೇಗೆ ತಲುಪುವುದು:\n- ಮೆಟ್ರೋ: MG ರಸ್ತೆ ಮೆಟ್ರೋ ನಿಲ್ದಾಣ (2 ನಿಮಿಷ ನಡೆದು)\n- ಬಸ್: ಅನೇಕ ಬಸ್ ಮಾರ್ಗಗಳು ಲಭ್ಯ\n- ಕಾರ: ರಿಂಗ್ ರಸ್ತೆಯಿಂದ ಸುಲಭ ಪ್ರವೇಶ`,
        marathi: `आम्ही तुमचे स्वागत करण्यात आनंद घेऊ! आमची ठिकाणे येथे आहेत:\n\nशेरपा हुंडई ठिकाणे:\n\nमुख्य शोरूम - बंगळूर:\n- पत्ता: 123 MG रोड, बंगळूर - 560001\n- फोन: +91-9876543210\n- वेळ: सोम-शनि: सकाळ 9:00 - संध्याकाळ 8:00, रवि: सकाळ 10:00 - संध्याकाळ 6:00\n- सुविधा: मोफत पार्किंग, टेस्ट ड्राइव सुविधा, ग्राहक लाउंज\n\nशाखा - इलेक्ट्रॉनिक सिटी:\n- पत्ता: 456 होसुर रोड, इलेक्ट्रॉनिक सिटी - 560100\n- फोन: +91-9876543211\n- वेळ: सोम-शनि: सकाळ 9:00 - संध्याकाळ 8:00\n\nकसे पोहोचायचे:\n- मेट्रो: MG रोड मेट्रो स्टेशन (2 मिनिटे चालत)\n- बस: अनेक बस मार्ग उपलब्ध\n- कार: रिंग रोड वरून सोपी प्रवेश`
      };
      
      return showroomMessages[userLang] || showroomMessages.english;
    }
  }

  if (session.state === 'contact_callback_time') {
    if (lower.startsWith('1') || lower.includes('morning')) session.data.preferredTime = 'Morning (9 AM - 12 PM)';
    else if (lower.startsWith('2') || lower.includes('afternoon')) session.data.preferredTime = 'Afternoon (12 PM - 4 PM)';
    else if (lower.startsWith('3') || lower.includes('evening')) session.data.preferredTime = 'Evening (4 PM - 8 PM)';
    else return callbackTimeMenu();

    session.state = 'contact_callback_date'; setSession(userId, session);
    return callbackDateMenu();
  }

  if (session.state === 'contact_callback_date') {
    const today = new Date();
    if (lower.includes('today')) {
      session.data.preferredDate = today.toISOString().slice(0, 10);
    } else if (lower.includes('tomorrow')) {
      const t = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      session.data.preferredDate = t.toISOString().slice(0, 10);
    } else {
      const d = parseDateFromInput(input);
      if (!d) return callbackDateMenu();
      session.data.preferredDate = d.toISOString().slice(0, 10);
    }
    session.state = 'collect_details'; setSession(userId, session);
    return 'Great! Please provide your details in one message:\nName: <your name>\nPhone: <your number>\nQuery: <what do you need help with?>';
  }

  if (session.state === 'collect_details') {
    const nameMatch = input.match(/name\s*:\s*(.*)/i);
    const phoneMatch = input.match(/phone\s*:\s*(\+?\d[\d\s-]{6,})/i);
    const queryMatch = input.match(/query\s*:\s*(.*)/i);
    if (nameMatch) session.data.name = nameMatch[1].trim();
    if (phoneMatch) session.data.phone = phoneMatch[1].replace(/\s|-/g, '');
    if (queryMatch) session.data.query = queryMatch[1].trim();

    if (!session.data.name || !session.data.phone || !session.data.query) {
      setSession(userId, session);
      return 'Please share all three fields as shown:\nName: <your name>\nPhone: <your number>\nQuery: <your query>';
    }

    const out = `Perfect ${session.data.name}! Your callback is scheduled:\n\nCALLBACK SCHEDULED:\n- Name: ${session.data.name}\n- Phone: ${session.data.phone}\n- Preferred Date: ${session.data.preferredDate}\n- Preferred Time: ${session.data.preferredTime}\n- Query: ${session.data.query}\n\nWhat to Expect:\n- Call within 2 hours if during business hours\n- Our expert will discuss: ${session.data.query}\n- Personalized assistance for your needs\n\nBusiness Hours: Mon-Sat: 9 AM - 8 PM\n\nNeed immediate help?\n- Call: +91-9876543210\n- Visit: 123 MG Road, Bangalore\n\nThank you!`;
    session.state = null; session.data = {}; setSession(userId, session);
    return out;
  }

  // About flow
  if (session.state === 'about_menu') {
    if (lower.startsWith('1') || lower.includes('our company story') || lower.includes('about_story')) return aboutStory();
    if (lower.startsWith('2') || lower.includes('why choose us') || lower.includes('about_why')) return aboutWhyUs();
    if (lower.startsWith('3') || lower.includes('our locations') || lower.includes('about_locations')) return showroomLocations();
    if (lower.startsWith('4') || lower.includes('our services') || lower.includes('about_services')) return aboutServices();
    if (lower.startsWith('5') || lower.includes('achievements') || lower.includes('about_awards')) return aboutAwards();
    return aboutMenu();
  }

  // Browse Used Cars entry — always ask budget first (only when not in another flow)
  if (!session.state && (['browse used cars', 'browse cars', 'used cars', '2'].includes(lower) ||
      lower.includes('second hand car') || lower.includes('used car') || lower.includes('pre-owned car') ||
      lower.includes('second hand car dekhna') || lower.includes('used car chahiye') || lower.includes('pre-owned car dekh raha'))) {
    session.state = 'browse_budget'; 
    session.data = session.data || {}; 
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const browseMessages = {
      english: "Great! What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.",
      hindi: isHinglish ? 
        "Bahut badhiya! Aapka budget kitna hai (maximum)?\nAap values type kar sakte hain jaise '12 lakhs', 'below 20 lakhs', ya number jaise 1200000." :
        "बहुत बढ़िया! आपका बजट क्या है (अधिकतम)?\nआप मान टाइप कर सकते हैं जैसे '12 लाख', '20 लाख से कम', या संख्या जैसे 1200000।",
      kannada: "ಚೆನ್ನಾಗಿದೆ! ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು (ಗರಿಷ್ಠ)?\nನೀವು '12 ಲಕ್ಷ', '20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', ಅಥವಾ 1200000 ನಂತಹ ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.",
      marathi: "छान! तुमचा बजेट किती आहे (जास्तीत जास्त)?\nतुम्ही '12 लाख', '20 लाख खाली', किंवा 1200000 सारख्या संख्या टाइप करू शकता."
    };
    
    return browseMessages[userLang] || browseMessages.english;
  }

  // If user says "all type(s)", show all body types (no type filter)
  if ((/\ball\s*types?\b/i.test(input)) && session.state && session.state.startsWith('browse_')) {
    session.data = { ...(session.data || {}), type: undefined };
    session.state = 'browse_pick_make'; setSession(userId, session);
    try {
      const { listMakesTool } = await import('./tools.js');
      const { makes = [] } = await listMakesTool();
      return `Got it. I'll show all body types. Select a brand: ${makes.slice(0,30).join(' | ')}`;
    } catch (_) {
      return 'Got it. Ill show all body types. Please type a brand (make), e.g., Toyota';
    }
  }
  
  // Handle "No" response to brand preference - show cars instead of ending conversation
  if (session.state === 'browse_pick_make' && (lower.includes('no') || lower.includes('any') || lower.includes('all brands') || lower.includes('all type of brand'))) {
    session.data.make = undefined; // Remove brand filter
    session.state = 'browse_show_results';
    setSession(userId, session);
    
    // Show results without brand filter
    const { searchInventoryTool } = await import('./tools.js');
    const { results } = await searchInventoryTool({ 
      type: session.data.type, 
      maxPrice: session.data.maxPrice,
      minPrice: session.data.minPrice
    });
    
    if (!results || results.length === 0) {
      return 'No matches found. You can change type or budget.';
    }
    
    session.state = 'browse_pick_vehicle';
    session.data.vehicles = results.slice(0, 10);
    setSession(userId, session);
    
    const trimTo = (s, n) => {
      const str = String(s || '');
      return str.length <= n ? str : str.slice(0, n - 1) + '…';
    };
    
    const rows = session.data.vehicles.map(v => ({ 
      id: `pick_vehicle:${v.id}`, 
      title: trimTo(`${v.brand || v.make || ''} ${v.model || ''}`.trim(), 24), 
      description: trimTo(`Yr ${v.year || 'NA'} • ${v.fuel_type || v.fuel || 'NA'} • ${(v.transmission||'').toString() || 'NA'} • ${(v.mileage||0).toLocaleString('en-IN')}km • ₹${(v.price||0).toLocaleString('en-IN')}`, 72) 
    }));
    
    return { type: 'list', bodyText: 'Here are cars matching your criteria:', buttonText: 'Select', sections: [{ title: 'Results', rows }] };
  }

  // Parse budget first, then proceed to filters
  if (session.state === 'browse_budget') {
    // Enhanced budget parsing for multiple languages - handle patterns like "I have a budget of ₹5 lakh"
    // Use extractBudgetFromMessage which is already defined and handles more patterns
    const extractedBudget = extractBudgetFromMessage();
    
    let maxVal = null;
    let minVal = null;
    
    if (extractedBudget) {
      maxVal = extractedBudget;
    } else {
      // Fallback to original patterns for backward compatibility
      const lakhs = input.match(/(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks|लाख|ಲಕ್ಷ|लाख)/i);
      const below = /(under|below|upto|up to|less than|से कम|ಕಡಿಮೆ|खाली|तक|रुपये तक|रुपये पर्यंत)\s*(?:₹)?\s*(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks|लाख|ಲಕ್ಷ|लाख)/i.exec(lower);
      const above = /(above|over|more than|greater than|से अधिक|ಹೆಚ್ಚು|वर|से ऊपर|रुपये से अधिक|रुपये वर)/i.exec(lower);
      const numeric = input.replace(/[,₹\s]/g, '').match(/(\d{5,12})/);
      
      if (lakhs) maxVal = Math.round(parseFloat(lakhs[1]) * 100000);
      else if (below) maxVal = Math.round(parseFloat(below[2]) * 100000);
      else if (above) minVal = Math.round(parseFloat(above[2]) * 100000);
      else if (numeric) maxVal = Number(numeric[1]);
    }

    if (!maxVal && !minVal) {
      const budgetErrorMessages = {
        english: "Please share a budget like '12 lakhs', 'below 20 lakhs', 'above 15 lakhs', or a number (e.g., 1200000).",
        hindi: "कृपया बजट बताएं जैसे '12 लाख', '20 लाख से कम', '15 लाख से अधिक', या संख्या (जैसे 1200000)।",
        kannada: "ದಯವಿಟ್ಟು ಬಜೆಟ್ ಹಂಚಿಕೊಳ್ಳಿ '12 ಲಕ್ಷ', '20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', '15 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು', ಅಥವಾ ಸಂಖ್ಯೆ (ಉದಾ 1200000)।",
        marathi: "कृपया बजेट सांगा जसे '12 लाख', '20 लाख खाली', '15 लाख वर', किंवा संख्या (जसे 1200000)।"
      };
      return budgetErrorMessages[userLang] || budgetErrorMessages.english;
    }

    session.data.maxPrice = maxVal; 
    session.data.minPrice = minVal;
    // If type is already known, skip asking type and go to brand
    if (session.data.type) {
      session.state = 'browse_pick_make'; setSession(userId, session);
      try {
        const { listMakesTool } = await import('./tools.js');
        const { makes = [] } = await listMakesTool();
        const budgetText = maxVal ? `up to ₹${maxVal.toLocaleString('en-IN')}` : `above ₹${minVal.toLocaleString('en-IN')}`;
        
        const brandMessages = {
          english: `Got it. Budget ${budgetText}\nSelect a brand (${session.data.type}): ${makes.slice(0,30).join(' | ')}`,
          hinglish: `Samajh gaya. Budget ${budgetText}\nBrand choose karein (${session.data.type}): ${makes.slice(0,30).join(' | ')}`,
          hindi: `ठीक है। बजट ${budgetText}\nब्रांड चुनें (${session.data.type}): ${makes.slice(0,30).join(' | ')}`,
          kannada: `ಸರಿ. ಬಜೆಟ್ ${budgetText}\nಬ್ರಾಂಡ್ ಆಯ್ಕೆಮಾಡಿ (${session.data.type}): ${makes.slice(0,30).join(' | ')}`,
          marathi: `ठीक आहे. बजेट ${budgetText}\nब्रँड निवडा (${session.data.type}): ${makes.slice(0,30).join(' | ')}`
        };
        
        return brandMessages[userLang] || brandMessages.english;
      } catch (_) {
        const budgetText = maxVal ? `up to ₹${maxVal.toLocaleString('en-IN')}` : `above ₹${minVal.toLocaleString('en-IN')}`;
        
        const brandMessages = {
          english: `Got it. Budget ${budgetText}\nPlease type a brand (make), e.g., Toyota`,
          hinglish: `Samajh gaya. Budget ${budgetText}\nKripya brand (make) type karein, jaise Toyota`,
          hindi: `ठीक है। बजट ${budgetText}\nकृपया ब्रांड टाइप करें, जैसे Toyota`,
          kannada: `ಸರಿ. ಬಜೆಟ್ ${budgetText}\nದಯವಿಟ್ಟು ಬ್ರಾಂಡ್ ಟೈಪ್ ಮಾಡಿ, ಉದಾ Toyota`,
          marathi: `ठीक आहे. बजेट ${budgetText}\nकृपया ब्रँड टाइप करा, जसे Toyota`
        };
        
        return brandMessages[userLang] || brandMessages.english;
      }
    }
    session.state = 'browse_pick_type'; setSession(userId, session);
    try {
      const { listTypesTool } = await import('./tools.js');
      const { types = [] } = await listTypesTool();
      const typeList = types.length > 0 ? types.join(' | ') : 'Hatchback | Sedan | SUV | MPV';
      
      const typeMessages = {
        english: `Got it. Budget up to ₹${maxVal.toLocaleString('en-IN')}.\nPick a body type: ${typeList}\nOr type "any type" to see all types.`,
        hinglish: `Samajh gaya. Budget up to ₹${maxVal.toLocaleString('en-IN')}.\nBody type choose karein: ${typeList}\nYa "any type" type karein sabhi types ke liye.`,
        hindi: `ठीक है। बजट ₹${maxVal.toLocaleString('en-IN')} तक।\nकार का प्रकार चुनें: ${typeList}`,
        kannada: `ಸರಿ. ಬಜೆಟ್ ₹${maxVal.toLocaleString('en-IN')} ವರೆಗೆ.\nಕಾರಿನ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ: ${typeList}`,
        marathi: `ठीक आहे. बजेट ₹${maxVal.toLocaleString('en-IN')} पर्यंत.\nकारचा प्रकार निवडा: ${typeList}`
      };
      
      return typeMessages[userLang] || typeMessages.english;
    } catch (_) {
      const typeMessages = {
        english: `Got it. Budget up to ₹${maxVal.toLocaleString('en-IN')}.\nPick a body type: Hatchback | Sedan | SUV | MPV\nOr type "any type" to see all types.`,
        hinglish: `Samajh gaya. Budget up to ₹${maxVal.toLocaleString('en-IN')}.\nBody type choose karein: Hatchback | Sedan | SUV | MPV\nYa "any type" type karein sabhi types ke liye.`,
        hindi: `ठीक है। बजट ₹${maxVal.toLocaleString('en-IN')} तक।\nकार का प्रकार चुनें: Hatchback | Sedan | SUV | MPV`,
        kannada: `ಸರಿ. ಬಜೆಟ್ ₹${maxVal.toLocaleString('en-IN')} ವರೆಗೆ.\nಕಾರಿನ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ: Hatchback | Sedan | SUV | MPV`,
        marathi: `ठीक आहे. बजेट ₹${maxVal.toLocaleString('en-IN')} पर्यंत.\nकारचा प्रकार निवडा: Hatchback | Sedan | SUV | MPV`
      };
      
      return typeMessages[userLang] || typeMessages.english;
    }
  }

  // Handle type selection
  if (session.state === 'browse_pick_type') {
    // Check if user wants all types
    if (/^(any|all|any type|all type|any types|all types)$/i.test(lower.trim())) {
      // Skip type filter and move to brand selection
      session.data.type = null; // Clear type to show all types
      session.state = 'browse_pick_make';
      setSession(userId, session);
      try {
        const { listMakesTool } = await import('./tools.js');
        const { makes = [] } = await listMakesTool();
        return `Great! Showing all types. Select a brand: ${makes.slice(0,30).join(' | ')}`;
      } catch (_) {
        return 'Great! Showing all types. Please type a brand (make), e.g., Toyota';
      }
    }
    
    const type = extractType();
    if (!type) {
      try {
        const { listTypesTool } = await import('./tools.js');
        const { types = [] } = await listTypesTool();
        const typeList = types.length > 0 ? types.join(' | ') : 'Hatchback | Sedan | SUV | MPV';
        return `Please pick a body type: ${typeList}\nOr type "any type" to see all types.`;
      } catch (_) {
        return 'Please pick a body type: Hatchback | Sedan | SUV | MPV\nOr type "any type" to see all types.';
      }
    }
    session.data.type = type;
    // If brand already known, skip brand step and show results
    if (session.data.make) {
      const { searchInventoryTool } = await import('./tools.js');
      const { results } = await searchInventoryTool({ 
        make: session.data.make, 
        type: session.data.type, 
        maxPrice: session.data.maxPrice,
        minPrice: session.data.minPrice
      });
      if (!results || results.length === 0) {
        session.state = 'browse_pick_make'; setSession(userId, session);
        return 'No matches found for that combination. Please pick a different brand.';
      }
      session.state = 'browse_pick_vehicle';
      session.data.vehicles = results.slice(0, 10);
      session.data.carsShown = 0; // Initialize cars shown counter
      setSession(userId, session);
      // Use enhanced formatting from tools
      const { formatMultipleCars } = await import('./tools.js');
      const enhancedFormat = formatMultipleCars(session.data.vehicles, 0, userLang);
      return enhancedFormat;
    }
    // Else ask for brand selection
    session.state = 'browse_pick_make';
    setSession(userId, session);
    try {
      const { listMakesTool } = await import('./tools.js');
      const { makes = [] } = await listMakesTool();
      const typeMessage = type ? `${type} it is.` : 'Showing all types.';
      return `Great! ${typeMessage} Select a brand: ${makes.slice(0,30).join(' | ')}\nOr type "any brand" to see all brands.`;
    } catch (_) {
      const typeMessage = type ? `${type} it is.` : 'Showing all types.';
      return `Great! ${typeMessage} Please type a brand (make), e.g., Toyota. Or type "any brand" to see all brands.`;
    }
  }

  // Handle make selection with improved brand mapping
  if (session.state === 'browse_pick_make') {
    try {
      const { listMakesTool } = await import('./tools.js');
      const result = await listMakesTool();
      const makes = result?.makes || result || [];
      
      // Ensure makes is an array
      if (!Array.isArray(makes) || makes.length === 0) {
        // Fallback to common brands if tool fails
        const commonMakes = ['Hyundai', 'Maruti', 'Tata', 'Mahindra', 'Kia', 'Honda', 'Toyota', 'Ford', 'Volkswagen', 'Skoda', 'Renault'];
        const found = commonMakes.find(m => lower.trim() === m.toLowerCase());
        if (found) {
          session.data.make = found;
          session.state = 'browse_show_results';
          setSession(userId, session);
          const { searchInventoryTool } = await import('./tools.js');
          const { results } = await searchInventoryTool({ 
            make: found, 
            type: session.data.type, 
            maxPrice: session.data.maxPrice,
            minPrice: session.data.minPrice
          });
          if (!results || results.length === 0) {
            return 'No matches found. You can change brand or budget.';
          }
          session.state = 'browse_pick_vehicle';
          session.data.vehicles = results.slice(0, 10);
          session.data.carsShown = 0;
          setSession(userId, session);
          const { formatMultipleCars } = await import('./tools.js');
          return formatMultipleCars(session.data.vehicles, 0, userLang);
        }
        return `Please select a brand: ${commonMakes.join(' | ')}\nOr type "any brand" to see all brands.`;
      }
      
      // Check if user wants all brands
      if (/^(any|all|any brand|all brand|any brands|all brands)$/i.test(lower.trim())) {
        // Skip brand filter and proceed to show results
        session.data.make = null; // Clear brand to show all brands
        session.state = 'browse_show_results';
        setSession(userId, session);
        const { searchInventoryTool } = await import('./tools.js');
        const { results } = await searchInventoryTool({ 
          make: null, 
          type: session.data.type, 
          maxPrice: session.data.maxPrice,
          minPrice: session.data.minPrice
        });
        if (!results || results.length === 0) {
          return 'No matches found. You can change filters or budget.';
        }
        session.state = 'browse_pick_vehicle';
        session.data.vehicles = results.slice(0, 10);
        session.data.carsShown = 0; // Initialize cars shown counter
        setSession(userId, session);
        const { formatMultipleCars } = await import('./tools.js');
        const enhancedFormat = formatMultipleCars(session.data.vehicles, 0, userLang);
        return `Great! Showing all brands. ${enhancedFormat}`;
      }
      
      // Use enhanced brand extraction for better matching
      const brand = extractBrand();
      let found = null;
      
      if (brand) {
        // Try to find exact match first (case-insensitive)
        found = makes.find(m => String(m).toLowerCase().trim() === brand.toLowerCase().trim());
        
        // If not found, try partial match
        if (!found) {
          found = makes.find(m => {
            const mStr = String(m).toLowerCase().trim();
            const bStr = brand.toLowerCase().trim();
            return mStr.includes(bStr) || bStr.includes(mStr);
          });
        }
      }
      
      // Fallback 1: check if input exactly matches a brand name (for single word inputs like "mahindra")
      if (!found && makes.length > 0) {
        const normalizedInput = lower.trim();
        found = makes.find(m => String(m).toLowerCase().trim() === normalizedInput);
      }
      
      // Fallback 2: check if input contains a brand name anywhere
      if (!found) {
        found = makes.find(m => lower.includes(String(m).toLowerCase().trim()));
      }
      
      // Fallback 3: reverse match - check if any brand name contains the input
      if (!found && lower.trim().length > 2) {
        found = makes.find(m => String(m).toLowerCase().trim().includes(lower.trim()));
      }
      
      if (!found) {
        const brandList = makes.length > 0 ? makes.slice(0,30).join(' | ') : 'Hyundai | Maruti | Tata | Mahindra | Kia | Honda | Toyota';
        return `Please select a valid brand: ${brandList}\nOr type "any brand" to see all brands.`;
      }
      session.data.make = found;
      session.state = 'browse_show_results';
      setSession(userId, session);
      
      // Show results
      const { searchInventoryTool } = await import('./tools.js');
      const { results } = await searchInventoryTool({ 
        make: session.data.make, 
        type: session.data.type, 
        maxPrice: session.data.maxPrice,
        minPrice: session.data.minPrice
      });
      if (!results || results.length === 0) {
        return 'No matches found. You can change brand or budget.';
      }
      session.state = 'browse_pick_vehicle';
      session.data.vehicles = results.slice(0, 10);
      session.data.carsShown = 0; // Initialize cars shown counter
      setSession(userId, session);
      // Use enhanced formatting from tools
      const { formatMultipleCars } = await import('./tools.js');
      const enhancedFormat = formatMultipleCars(session.data.vehicles, 0, userLang);
      return enhancedFormat;
    } catch (_) {
      return 'Please type a brand (make), e.g., Toyota. Or type "any brand" to see all brands.';
    }
  }

  // Handle vehicle selection - ONLY when in browse_pick_vehicle state
  if (session.state === 'browse_pick_vehicle') {
    const vehicles = session.data?.vehicles || [];
    
    // Only proceed if we have vehicles to select from
    if (vehicles.length === 0) {
      session.state = null;
      session.data = {};
      setSession(userId, session);
      return 'No vehicles available. Please start a new search.';
    }
    
    
    // Handle "show more" request (support Hinglish/Hindi aliases)
    if (lower.includes('show more') || lower.includes('more cars') || lower.includes('aur dikao') || lower.includes('aur dikhao') || lower.includes('और दिखाओ')) {
      // Track how many cars have been shown so far
      const carsShown = session.data?.carsShown || 5; // Start at 5 since initial display shows 5
      
      if (carsShown >= vehicles.length) {
        return 'No more cars to show. Please select a car from the list above or start a new search.';
      }
      
      // Update the count of shown cars before showing
      session.data.carsShown = carsShown + 5;
      setSession(userId, session);
      
      const { formatMultipleCars } = await import('./tools.js');
      // Pass all vehicles and startIndex to formatMultipleCars
      return formatMultipleCars(vehicles, carsShown, userLang);
    }
    
    let chosen = null;
    
    // Method 1: Direct ID selection (pick_vehicle:ID)
    if (lower.startsWith('pick_vehicle:') || lower.includes('select:')) {
      const id = input.split(':')[1];
      chosen = vehicles.find(v => String(v.id) === String(id));
    }
    
    // Method 2: Car selection (car1, car2, car3, etc.) - handle spaces
    else if (lower.startsWith('car') && /^\d+$/.test(input.trim().substring(3).trim())) {
      const index = parseInt(input.trim().substring(3).trim()) - 1;
      if (index >= 0 && index < vehicles.length) {
        chosen = vehicles[index];
      } else {
        return `Please select a valid car (car1-car${vehicles.length}). Type car1, car2, car3, etc. or "show more" to see additional cars`;
      }
    }
    // Method 2b: Car selection with spaces (car 1, car 2, car 3, etc.)
    else if (lower.includes('car') && /\d+/.test(input)) {
      const numberMatch = input.match(/car\s*(\d+)/i);
      if (numberMatch) {
        const index = parseInt(numberMatch[1]) - 1;
        if (index >= 0 && index < vehicles.length) {
          chosen = vehicles[index];
        } else {
          return `Please select a valid car (car1-car${vehicles.length}). Type car1, car2, car3, etc. or "show more" to see additional cars`;
        }
      }
    }
    
    // Method 3: Simple number selection (1, 2, 3, etc.) - fallback
    else if (/^\d+$/.test(input.trim())) {
      const index = parseInt(input.trim()) - 1;
      if (index >= 0 && index < vehicles.length) {
        chosen = vehicles[index];
      } else {
        return `Please select a valid car (car1-car${vehicles.length}). Type car1, car2, car3, etc. or "show more" to see additional cars`;
      }
    }
    
    // Method 4: Text selection with number (select car 1, choose car 2, etc.)
    else if (lower.includes('select car') || lower.includes('choose car') || lower.includes('pick car')) {
      const numberMatch = input.match(/(\d+)/);
      if (numberMatch) {
        const index = parseInt(numberMatch[1]) - 1;
        if (index >= 0 && index < vehicles.length) {
          chosen = vehicles[index];
        }
      }
    }
    
    // Method 5: Car name selection (only if it matches a car in current list)
    else {
      chosen = vehicles.find(v => {
        const carName = `${v.brand || v.make} ${v.model} ${v.variant || ''}`.toLowerCase().trim();
        return carName.includes(lower) || lower.includes(carName.split(' ')[0]);
      });
    }
    
    if (chosen) {
      // Store selected car and ask about test drive
      session.state = 'car_selected';
      session.data.selectedCar = chosen;
      setSession(userId, session);
      
      const priceStr = chosen.price ? `₹${chosen.price.toLocaleString('en-IN')}` : 'Price: N/A';
      return `🚗 **${chosen.brand || chosen.make} ${chosen.model} ${chosen.variant || chosen.trim || ''}**\n\n📅 **Year:** ${chosen.year || 'N/A'}\n⛽ **Fuel:** ${chosen.fuel_type || chosen.fuel || 'N/A'}\n🔧 **Transmission:** ${chosen.transmission || 'N/A'}\n📏 **Mileage:** ${(chosen.mileage || 0).toLocaleString('en-IN')} km\n🎨 **Color:** ${chosen.color || 'N/A'}\n💰 **Price:** ${priceStr}\n\n❓ **Would you like to book a test drive for this car?** (Yes/No)`;
    } else {
      // Show selection instructions
      return 'Please select a car from the list above. Type car1, car2, car3, etc. or "show more" to see additional cars';
    }
  }

  // Handle car selection response (test drive booking flow)
  if (session.state === 'car_selected') {
    if (lower.includes('yes') || lower.includes('y') || lower.includes('book') || lower.includes('test drive') || lower.includes('haan') || lower.includes('haanji') || lower === 'ha') {
      session.state = 'testdrive_name';
      session.data.testDriveCar = session.data.selectedCar;
      setSession(userId, session);
      return 'Great! Let\'s book your test drive. Please provide your details:\n\n**Name:** (Your full name)';
    } else if (lower.includes('no') || lower.includes('n')) {
      session.state = null;
      session.data = {};
      setSession(userId, session);
      return 'No problem! If you change your mind about the test drive, just let me know. Is there anything else I can help you with?';
    } else {
      return 'Please answer with Yes or No. Would you like to book a test drive for this car?';
    }
  }

  // Handle test drive name collection
  if (session.state === 'testdrive_name') {
    const nameMatch = input.match(/name\s*:\s*(.*)/i);
    const name = nameMatch ? nameMatch[1].trim() : input.trim();
    
    if (name && name.length > 2) {
      session.data.customerName = name;
      session.state = 'testdrive_phone';
      setSession(userId, session);
			const isHinglish = checkIsHinglish(input);
			const messages = {
				english: `Thanks ${name}! Now please provide your **phone number** and confirm if you have a **valid driving license**.\n\nFormat: Phone: [your number], DL: Yes/No`,
				hindi: isHinglish
					? `Thanks ${name}! Ab apna **phone number** aur **driving license (DL)** status batayein.\n\nFormat: Phone: [aapka number], DL: Yes/No`
					: `धन्यवाद ${name}! अब अपना **फोन नंबर** और **ड्राइविंग लाइसेंस (DL)** की स्थिति बताएं।\n\nफॉर्मेट: Phone: [आपका नंबर], DL: Yes/No`,
				kannada: `ಧನ್ಯವಾದಗಳು ${name}! ಈಗ ದಯವಿಟ್ಟು ನಿಮ್ಮ **ಫೋನ್ ಸಂಖ್ಯೆ** ಮತ್ತು **ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್** ಇದ್ದೆಯೇ ಎಂದು ತಿಳಿಸಿ.\n\nಫಾರ್ಮ್ಯಾಟ್: Phone: [ನಿಮ್ಮ ಸಂಖ್ಯೆ], DL: Yes/No`,
				marathi: `धन्यवाद ${name}! आता तुमचा **फोन नंबर** आणि **ड्रायव्हिंग लायसन्स (DL)** आहे का ते सांगा.\n\nफॉरमॅट: Phone: [तुमचा नंबर], DL: Yes/No`
			};
			return messages[userLang] || messages.english;
    } else {
			const isHinglish = checkIsHinglish(input);
			const messages = {
				english: 'Please provide your full name. Format: Name: [Your full name]',
				hindi: isHinglish ? 'Kripya apna poora naam batayein. Format: Name: [aapka poora naam]' : 'कृपया अपना पूरा नाम बताएं। फॉर्मेट: Name: [आपका पूरा नाम]',
				kannada: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನೀಡಿ. ಫಾರ್ಮ್ಯಾಟ್: Name: [ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು]',
				marathi: 'कृपया तुमचे पूर्ण नाव द्या. फॉरमॅट: Name: [तुमचे पूर्ण नाव]'
			};
			return messages[userLang] || messages.english;
    }
  }

  // Handle test drive phone and DL collection
  if (session.state === 'testdrive_phone') {
    // More flexible phone number parsing
    const phoneMatch = input.match(/phone\s*:\s*(\+?\d[\d\s-]{6,})/i) || 
                     input.match(/(\+?\d[\d\s-]{6,})/) ||
                     input.match(/(\d{10})/);
    
    // More flexible DL status parsing
    const dlMatch = input.match(/dl\s*:\s*(yes|no|y|n)/i) ||
                   input.match(/(yes|no|y|n)\s*(?:dl|driving\s*license)/i) ||
                   input.match(/(yes|no|y|n)/i);
    
    if (phoneMatch && dlMatch) {
      const phone = phoneMatch[1].trim().replace(/\s|-/g, '');
      const hasDL = dlMatch[1].toLowerCase().includes('y');
      
      session.data.customerPhone = phone;
      session.data.hasDL = hasDL;
      session.state = 'testdrive_location';
      setSession(userId, session);
			const isHinglish = checkIsHinglish(input);
			const messages = {
				english: `Perfect! Phone: ${phone}, DL: ${hasDL ? 'Yes' : 'No'}\n\nNow please choose your preferred **test drive location**:\n\n1. **Main Showroom** (MG Road)\n2. **Banashankari Branch**\n3. **Whitefield Branch**\n\nType the number (1, 2, or 3) or location name.`,
				hindi: isHinglish
					? `Perfect! Phone: ${phone}, DL: ${hasDL ? 'Yes' : 'No'}\n\nAb apni pasand ka **test drive location** choose karein:\n\n1. **Main Showroom** (MG Road)\n2. **Banashankari Branch**\n3. **Whitefield Branch**\n\nNumber type karein (1, 2, ya 3) ya location ka naam likhein.`
					: `परफेक्ट! फोन: ${phone}, DL: ${hasDL ? 'Yes' : 'No'}\n\nअब अपनी पसंद का **टेस्ट ड्राइव लोकेशन** चुनें:\n\n1. **Main Showroom** (MG Road)\n2. **Banashankari Branch**\n3. **Whitefield Branch**\n\nनंबर टाइप करें (1, 2, या 3) या लोकेशन का नाम लिखें।`,
				kannada: `ಪರಫೆಕ್ಟ್! ಫೋನ್: ${phone}, DL: ${hasDL ? 'Yes' : 'No'}\n\nಈಗ ನಿಮ್ಮ **ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಸ್ಥಳ** ಆಯ್ಕೆಮಾಡಿ:\n\n1. **Main Showroom** (MG Road)\n2. **Banashankari Branch**\n3. **Whitefield Branch**\n\nಸಂಖ್ಯೆ (1, 2, ಅಥವಾ 3) ಅಥವಾ ಸ್ಥಳದ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ.`,
				marathi: `परफेक्ट! फोन: ${phone}, DL: ${hasDL ? 'Yes' : 'No'}\n\nआता तुमचा **टेस्ट ड्राइव लोकेशन** निवडा:\n\n1. **Main Showroom** (MG Road)\n2. **Banashankari Branch**\n3. **Whitefield Branch**\n\nक्रमांक टाईप करा (1, 2, किंवा 3) किंवा लोकेशनचे नाव लिहा.`
			};
			return messages[userLang] || messages.english;
    } else {
			const isHinglish = checkIsHinglish(input);
			const messages = {
				english: 'Please provide both phone number and DL status. Format: Phone: [your number], DL: Yes/No',
				hindi: isHinglish ? 'Kripya phone number aur DL status dono dein. Format: Phone: [aapka number], DL: Yes/No' : 'कृपया फोन नंबर और DL स्थिति दोनों दें। फॉर्मेट: Phone: [आपका नंबर], DL: Yes/No',
				kannada: 'ದಯವಿಟ್ಟು ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು DL ಸ್ಥಿತಿ ಎರಡನ್ನೂ ನೀಡಿ. ಫಾರ್ಮ್ಯಾಟ್: Phone: [ನಿಮ್ಮ ಸಂಖ್ಯೆ], DL: Yes/No',
				marathi: 'कृपया फोन नंबर आणि DL स्टेटस दोन्ही द्या. फॉरमॅट: Phone: [तुमचा नंबर], DL: Yes/No'
			};
			return messages[userLang] || messages.english;
    }
  }

  // Handle test drive location selection
  if (session.state === 'testdrive_location') {
    let location = '';
    if (lower.includes('1') || lower.includes('main') || lower.includes('mg road')) {
      location = 'Main Showroom (MG Road)';
    } else if (lower.includes('2') || lower.includes('banashankari')) {
      location = 'Banashankari Branch';
    } else if (lower.includes('3') || lower.includes('whitefield')) {
      location = 'Whitefield Branch';
    } else {
			const isHinglish = checkIsHinglish(input);
			const messages = {
				english: 'Please select a location. Type 1, 2, or 3, or mention the location name.',
				hindi: isHinglish ? 'Kripya location select karein. 1, 2, ya 3 type karein, ya location ka naam likhein.' : 'कृपया लोकेशन चुनें। 1, 2, या 3 टाइप करें, या लोकेशन का नाम लिखें।',
				kannada: 'ದಯವಿಟ್ಟು ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ. 1, 2, ಅಥವಾ 3 ಅನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಸ್ಥಳದ ಹೆಸರು ಬರೆಯಿರಿ.',
				marathi: 'कृपया लोकेशन निवडा. 1, 2, किंवा 3 टाइप करा, किंवा लोकेशनचे नाव लिहा.'
			};
			return messages[userLang] || messages.english;
    }
    
    session.data.testDriveLocation = location;
    session.state = 'testdrive_confirmation';
    setSession(userId, session);
    
    // Generate confirmation details
    const car = session.data.testDriveCar;
    const carName = `${car.brand || car.make} ${car.model} ${car.variant || ''}`.trim();
    const confirmationId = `TD-${Date.now().toString().slice(-6)}`;
		const isHinglish = checkIsHinglish(input);
		const messages = {
			english: `🎉 **Test Drive Confirmed!**\n\n📋 **Booking Details:**\n• **Car:** ${carName}\n• **Customer:** ${session.data.customerName}\n• **Phone:** ${session.data.customerPhone}\n• **Location:** ${location}\n• **Confirmation ID:** ${confirmationId}\n• **Date:** Tomorrow (11:00 AM - 12:00 PM)\n\n✅ **You'll receive a confirmation message shortly!**\n\nIs there anything else I can help you with?`,
			hindi: isHinglish
				? `🎉 Test Drive confirm ho gaya!\n\n📋 Booking Details:\n• Car: ${carName}\n• Customer: ${session.data.customerName}\n• Phone: ${session.data.customerPhone}\n• Location: ${location}\n• Confirmation ID: ${confirmationId}\n• Date: Kal (11:00 AM - 12:00 PM)\n\n✅ Jaldi hi aapko confirmation message mil jayega!\n\nKya aur kisi cheez mein madad karun?`
				: `🎉 **टेस्ट ड्राइव कन्फर्म हो गया!**\n\n📋 **बुकिंग विवरण:**\n• **कार:** ${carName}\n• **ग्राहक:** ${session.data.customerName}\n• **फोन:** ${session.data.customerPhone}\n• **लोकेशन:** ${location}\n• **कन्फर्मेशन ID:** ${confirmationId}\n• **तारीख:** कल (11:00 AM - 12:00 PM)\n\n✅ **आपको जल्द ही कन्फर्मेशन संदेश मिल जाएगा!**\n\nक्या मैं और किसी तरह मदद कर सकता हूं?`,
			kannada: `🎉 **ಟೆಸ್ಟ್ ಡ್ರೈವ್ ದೃಢಪಡಿಸಲಾಗಿದೆ!**\n\n📋 **ಬುಕಿಂಗ್ ವಿವರಗಳು:**\n• **ಕಾರ್:** ${carName}\n• **ಗ್ರಾಹಕ:** ${session.data.customerName}\n• **ಫೋನ್:** ${session.data.customerPhone}\n• **ಸ್ಥಳ:** ${location}\n• **ದೃಢೀಕರಣ ID:** ${confirmationId}\n• **ದಿನಾಂಕ:** ನಾಳೆ (11:00 AM - 12:00 PM)\n\n✅ **ತಕ್ಷಣವೇ ನಿಮಗೆ ದೃಢೀಕರಣ ಸಂದೇಶ ಬರುತ್ತದೆ!**\n\nಇನ್ನೇನಾದರೂ ಸಹಾಯ ಬೇಕೆ?`,
			marathi: `🎉 **टेस्ट ड्राइव कन्फर्म झाले!**\n\n📋 **बुकिंग डिटेल्स:**\n• **कार:** ${carName}\n• **कस्टमर:** ${session.data.customerName}\n• **फोन:** ${session.data.customerPhone}\n• **लोकेशन:** ${location}\n• **कन्फर्मेशन ID:** ${confirmationId}\n• **तारीख:** उद्या (11:00 AM - 12:00 PM)\n\n✅ **लवकरच तुम्हाला कन्फर्मेशन मेसेज मिळेल!**\n\nआणखी काही मदत करू का?`
		};
		return messages[userLang] || messages.english;
  }

  // Enhanced Test Drive Booking entry with multilingual support
  if (['book test drive', 'test drive', 'book a test drive', 'schedule test drive'].includes(lower) || 
      lower.includes('book test drive') || lower.includes('test drive for') || 
      lower.includes('टेस्ट ड्राइव') || lower.includes('test drive lena') || 
      lower.includes('test drive book') || lower.includes('ड्राइव लेना')) {
    session.state = 'testdrive_car'; 
    session.data = {}; 
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const testDriveMessages = {
      english: 'Great! I\'ll help you book a test drive. Which car are you interested in? Please mention the car name (e.g., "Tata Nexon", "Honda City", "Hyundai Creta").',
      hindi: isHinglish ? 
        'Bahut badhiya! Main aapke liye test drive book karne mein madad karunga. Aap kaun si car mein ruchi rakhte hain? Kripya car ka naam batayein (jaise, "Tata Nexon", "Honda City", "Hyundai Creta").' :
        'बहुत बढ़िया! मैं आपके लिए टेस्ट ड्राइव बुक करने में मदद करूंगा। आप कौन सी कार में रुचि रखते हैं? कृपया कार का नाम बताएं (जैसे, "टाटा नेक्सन", "होंडा सिटी", "हुंडई क्रेटा")।',
      kannada: 'ಚೆನ್ನಾಗಿದೆ! ನಿಮಗಾಗಿ ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಬುಕ್ ಮಾಡಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನೀವು ಯಾವ ಕಾರಿನಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ? ದಯವಿಟ್ಟು ಕಾರಿನ ಹೆಸರನ್ನು ಹೇಳಿ (ಉದಾ, "ಟಾಟಾ ನೆಕ್ಸನ್", "ಹೋಂಡಾ ಸಿಟಿ", "ಹುಂಡೈ ಕ್ರೆಟಾ").',
      marathi: 'छान! मी तुमच्यासाठी टेस्ट ड्राइव बुक करण्यात मदत करेन. तुम्हाला कोणत्या कारमध्ये रस आहे? कृपया कारचे नाव सांगा (जसे, "टाटा नेक्सन", "होंडा सिटी", "हुंडई क्रेटा").'
    };
    
    return testDriveMessages[userLang] || testDriveMessages.english;
  }

  // Test Drive Management entries
  if (['my test drive', 'check my test drive', 'test drive status', 'test drive booking'].includes(lower) || lower.includes('my test drive')) {
    session.state = 'testdrive_check'; session.data = {}; setSession(userId, session);
		const isHinglish = checkIsHinglish(input);
		const messages = {
			english: 'I can help you check your test drive booking. Please provide your phone number or booking ID.',
			hindi: isHinglish ? 'Main aapki test drive booking check kar deta hoon. Kripya apna phone number ya booking ID dein.' : 'मैं आपकी टेस्ट ड्राइव बुकिंग चेक कर सकता हूं। कृपया अपना फोन नंबर या बुकिंग ID दें।',
			kannada: 'ನಾನು ನಿಮ್ಮ ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಬುಕಿಂಗ್ ಪರಿಶೀಲಿಸಲು ಸಹಾಯ ಮಾಡಬಹುದು. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಬುಕಿಂಗ್ ID ನೀಡಿ.',
			marathi: 'मी तुमची टेस्ट ड्राइव बुकिंग तपासू शकतो. कृपया तुमचा फोन नंबर किंवा बुकिंग ID द्या.'
		};
		return messages[userLang] || messages.english;
  }

  if (['cancel test drive', 'cancel my test drive', 'cancel booking'].includes(lower) || lower.includes('cancel test drive')) {
    session.state = 'testdrive_cancel'; session.data = {}; setSession(userId, session);
		const isHinglish = checkIsHinglish(input);
		const messages = {
			english: 'I can help you cancel your test drive booking. Please provide your phone number or booking ID.',
			hindi: isHinglish ? 'Main aapki test drive booking cancel karne mein madad karunga. Kripya phone number ya booking ID dein.' : 'मैं आपकी टेस्ट ड्राइव बुकिंग रद्द करने में मदद कर सकता हूं। कृपया फोन नंबर या बुकिंग ID दें।',
			kannada: 'ನಾನು ನಿಮ್ಮ ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಬುಕಿಂಗ್ ರದ್ದುಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಬುಕಿಂಗ್ ID ನೀಡಿ.',
			marathi: 'मी तुमची टेस्ट ड्राइव बुकिंग रद्द करण्यात मदत करेन. कृपया फोन नंबर किंवा बुकिंग ID द्या.'
		};
		return messages[userLang] || messages.english;
  }

  // Enhanced test drive booking with car selection
  if (['book test drive for', 'test drive for', 'schedule test drive for'].some(phrase => lower.includes(phrase))) {
    // Extract car name from the message
    const carMatch = input.match(/(?:for|of|the)\s+([^,]+)/i) || input.match(/([A-Za-z\s]+(?:i20|creta|city|verna|baleno|swift|nexon|seltos|venue|xuv|scorpio|tiago|jazz|elevate|virtus|kushaq))/i);
    const carName = carMatch ? carMatch[1].trim() : input.replace(/(?:book|test drive|schedule)/gi, '').trim();
    
    if (carName && carName.length > 3) {
      session.state = 'testdrive_car';
      session.data = { carName };
      setSession(userId, session);
      
      // Try to find the car in inventory
      try {
        const { searchInventoryTool } = await import('./tools.js');
        const { results } = await searchInventoryTool({ model: carName });
        
        if (results && results.length > 0) {
          session.data.selectedCar = results[0];
          session.state = 'testdrive_date';
          setSession(userId, session);
          
          const today = new Date();
          const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
          
          return `Perfect! I found ${carName} in our inventory. 

🚗 **Car Details:**
• Brand: ${results[0].brand || results[0].make || 'N/A'}
• Model: ${results[0].model || 'N/A'}
• Year: ${results[0].year || 'N/A'}
• Price: ₹${(results[0].price || 0).toLocaleString('en-IN')}

Available dates:
• Today (${today.toLocaleDateString('en-IN')})
• Tomorrow (${tomorrow.toLocaleDateString('en-IN')})
• Day after tomorrow (${dayAfter.toLocaleDateString('en-IN')})

Please choose a date or type "custom" for a specific date.`;
        } else {
          return `I couldn't find "${carName}" in our current inventory. Please check the car name or browse our available cars first.`;
        }
      } catch (error) {
        console.error('Error finding car:', error);
        return 'I had trouble checking our inventory. Please try again or contact our team directly.';
      }
    } else {
      session.state = 'testdrive_car';
      session.data = {};
      setSession(userId, session);
      return 'Great! I\'ll help you book a test drive. Which car are you interested in? Please mention the car name (e.g., "Tata Nexon", "Honda City", "Hyundai Creta").';
    }
  }

  // Car availability check - should be checked BEFORE financing flow
  // This handles questions like "Is the white Toyota Innova currently available?"
  // Allow this check even if in another flow (e.g., user wants to check availability while in financing flow)
  if (lower.includes('available') || lower.includes('availability') || lower.includes('in stock') || 
      (lower.includes('have') && (lower.includes('toyota') || lower.includes('hyundai') || lower.includes('maruti') || 
       lower.includes('honda') || lower.includes('kia') || lower.includes('mahindra') || lower.includes('tata')))) {
    // Extract car name from the question
    const carBrands = ['toyota', 'hyundai', 'maruti', 'honda', 'kia', 'mahindra', 'tata', 'ford', 'renault', 'volkswagen', 'skoda', 'mg'];
    const carModels = ['innova', 'creta', 'i20', 'swift', 'city', 'seltos', 'thar', 'nexon', 'venue', 'brezza', 'verna', 'santafe', 'tucson'];
    
    let carName = null;
    for (const brand of carBrands) {
      if (lower.includes(brand)) {
        const modelMatch = input.match(new RegExp(`${brand}\\s+([a-z0-9]+)`, 'i'));
        if (modelMatch) {
          carName = `${brand} ${modelMatch[1]}`;
        } else {
          // Try to find model separately
          for (const model of carModels) {
            if (lower.includes(model)) {
              carName = `${brand} ${model}`;
              break;
            }
          }
          if (!carName) carName = brand;
        }
        break;
      }
    }
    
    // If car name found, search inventory
    if (carName) {
      try {
        const { searchInventoryTool } = await import('./tools.js');
        const searchResults = await searchInventoryTool({ model: carName });
        
        if (searchResults.results && searchResults.results.length > 0) {
          const availabilityMessages = {
            english: `Yes! We have ${searchResults.results.length} ${carName} car${searchResults.results.length > 1 ? 's' : ''} available in our inventory. Would you like to see the details?`,
            hinglish: `Haanji! Humare paas ${searchResults.results.length} ${carName} car${searchResults.results.length > 1 ? 's' : ''} available ${searchResults.results.length > 1 ? 'hain' : 'hai'}. Kya aap details dekhna chahenge?`,
            hindi: `हाँ! हमारे पास ${searchResults.results.length} ${carName} कार उपलब्ध है। क्या आप विवरण देखना चाहेंगे?`,
            kannada: `ಹೌದು! ನಮ್ಮ ಸ್ಟಾಕ್ನಲ್ಲಿ ${searchResults.results.length} ${carName} ಕಾರುಗಳು ಲಭ್ಯವಿದೆ. ನೀವು ವಿವರಗಳನ್ನು ನೋಡಲು ಬಯಸುವಿರಾ?`,
            marathi: `होय! आमच्याकडे ${searchResults.results.length} ${carName} गाडी उपलब्ध आहे. तुम्हाला तपशील पाहायचे आहेत का?`
          };
          return availabilityMessages[userLang] || availabilityMessages.english;
        } else {
          const notAvailableMessages = {
            english: `I'm sorry, we don't currently have "${carName}" available in our inventory. Would you like to search for similar cars or be notified when it becomes available?`,
            hinglish: `Maaf kijiye, filhaal humare paas "${carName}" available nahi hai. Kya aap similar cars dekhna chahenge ya jab available ho toh notification chahiye?`,
            hindi: `क्षमा करें, वर्तमान में हमारे पास "${carName}" उपलब्ध नहीं है। क्या आप समान कारें देखना चाहेंगे या उपलब्ध होने पर सूचना चाहिए?`,
            kannada: `ಕ್ಷಮಿಸಿ, ಪ್ರಸ್ತುತ ನಮ್ಮ ಸ್ಟಾಕ್ನಲ್ಲಿ "${carName}" ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಇದೇ ರೀತಿಯ ಕಾರುಗಳನ್ನು ನೋಡಲು ಬಯಸುವಿರಾ ಅಥವಾ ಲಭ್ಯವಾದಾಗ ಅಧಿಸೂಚನೆಯನ್ನು ಬಯಸುವಿರಾ?`,
            marathi: `माफ करा, सध्या आमच्याकडे "${carName}" उपलब्ध नाही. तुम्ही समान गाड्या पाहू इच्छिता किंवा त्या उपलब्ध झाल्यावर सूचना हवी आहे का?`
          };
          return notAvailableMessages[userLang] || notAvailableMessages.english;
        }
      } catch (error) {
        console.error('Error checking car availability:', error);
        // Fall through to Gemini if search fails
      }
    }
  }

  // Enhanced EMI/Financing flow with multilingual support
  if (['emi', 'financing', 'loan', 'car loan', 'emi options', 'financing options', 'loan options'].includes(lower) ||
      lower.includes('emi') || lower.includes('loan') || lower.includes('financing') || 
      lower.includes('कर्ज') || lower.includes('लोन') || lower.includes('EMI') ||
      lower.includes('emi janna') || lower.includes('loan chahiye') || lower.includes('financing options')) {
    session.state = 'financing_inquiry';
    session.data = {};
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const financingMessages = {
      english: `Great! I'll help you with financing options. Please provide:\n\n**Car Details:**\n• Car Model: (e.g., Hyundai i20, Maruti Swift)\n• Car Price: (e.g., ₹8,00,000)\n• Down Payment: (e.g., ₹2,00,000)\n• Loan Tenure: (e.g., 3, 4, 5 years)\n\n**Your Details:**\n• Monthly Income: (e.g., ₹50,000)\n• Employment Type: (Salaried/Self-employed)\n\nPlease share all details in one message.`,
      hindi: isHinglish ? 
        `Bahut badhiya! Main aapko financing options mein madad karunga. Kripya ye details dein:\n\n**Car ki jaankari:**\n• Car Model: (jaise, Hyundai i20, Maruti Swift)\n• Car Price: (jaise, ₹8,00,000)\n• Down Payment: (jaise, ₹2,00,000)\n• Loan Tenure: (jaise, 3, 4, 5 saal)\n\n**Aapki jaankari:**\n• Monthly Income: (jaise, ₹50,000)\n• Employment Type: (Salaried/Self-employed)\n\nKripya saari jaankari ek saath bhejein.` :
        `बहुत बढ़िया! मैं आपको फाइनेंसिंग ऑप्शन्स में मदद करूंगा। कृपया जानकारी दें:\n\n**कार की जानकारी:**\n• कार मॉडल: (जैसे, हुंडई i20, मारुति स्विफ्ट)\n• कार की कीमत: (जैसे, ₹8,00,000)\n• डाउन पेमेंट: (जैसे, ₹2,00,000)\n• लोन टेन्योर: (जैसे, 3, 4, 5 साल)\n\n**आपकी जानकारी:**\n• मासिक आय: (जैसे, ₹50,000)\n• रोजगार का प्रकार: (सैलरीड/सेल्फ एम्प्लॉयड)\n\nकृपया सभी जानकारी एक साथ भेजें।`,
      kannada: `ಚೆನ್ನಾಗಿದೆ! ನಾನು ನಿಮಗೆ ಹಣಕಾಸು ಆಯ್ಕೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಒದಗಿಸಿ:\n\n**ಕಾರಿನ ವಿವರಗಳು:**\n• ಕಾರ್ ಮಾಡೆಲ್: (ಉದಾ, ಹುಂಡೈ i20, ಮಾರುತಿ ಸ್ವಿಫ್ಟ್)\n• ಕಾರ್ ಬೆಲೆ: (ಉದಾ, ₹8,00,000)\n• ಡೌನ್ ಪೇಮೆಂಟ್: (ಉದಾ, ₹2,00,000)\n• ಲೋನ್ ಅವಧಿ: (ಉದಾ, 3, 4, 5 ವರ್ಷಗಳು)\n\n**ನಿಮ್ಮ ವಿವರಗಳು:**\n• ಮಾಸಿಕ ಆದಾಯ: (ಉದಾ, ₹50,000)\n• ಉದ್ಯೋಗದ ಪ್ರಕಾರ: (ಸಂಬಳ/ಸ್ವ-ಉದ್ಯೋಗಿ)\n\nದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಒಂದೇ ಸಂದೇಶದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ.`,
      marathi: `छान! मी तुम्हाला फायनान्सिंग ऑप्शन्समध्ये मदत करेन. कृपया माहिती द्या:\n\n**गाडीची माहिती:**\n• गाडीचे मॉडेल: (जसे, हुंडई i20, मारुती स्विफ्ट)\n• गाडीची किंमत: (जसे, ₹8,00,000)\n• डाउन पेमेंट: (जसे, ₹2,00,000)\n• लोन टेन्योर: (जसे, 3, 4, 5 वर्षे)\n\n**तुमची माहिती:**\n• मासिक उत्पन्न: (जसे, ₹50,000)\n• रोजगाराचा प्रकार: (पगारी/स्व-रोजगारी)\n\nकृपया सर्व माहिती एकाच संदेशात सांगा.`
    };
    
    return financingMessages[userLang] || financingMessages.english;
  }

  // Car Valuation entry
  if (['get car valuation', 'valuation', 'car valuation'].includes(lower) ||
      lower.includes('car valuation') || lower.includes('car ka price') || lower.includes('gaadi ka value') ||
      lower.includes('car valuation karva') || lower.includes('car ka price kitna') || lower.includes('gaadi ka value janna')) {
    session.state = 'valuation_collect'; 
    session.data = {}; 
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const valuationMessages = {
      english: 'To estimate your car value, please share:\nMake: \nModel: \nYear: \nKilometers: \nCondition (excellent/good/fair): \nCity:',
      hindi: isHinglish ? 
        'Aapki car ka value estimate karne ke liye, kripya ye details share karein:\nMake: \nModel: \nYear: \nKilometers: \nCondition (excellent/good/fair): \nCity:' :
        'आपकी कार का मूल्य अनुमान लगाने के लिए, कृपया ये विवरण साझा करें:\nMake: \nModel: \nYear: \nKilometers: \nCondition (excellent/good/fair): \nCity:',
      kannada: 'ನಿಮ್ಮ ಕಾರಿನ ಮೌಲ್ಯವನ್ನು ಅಂದಾಜು ಮಾಡಲು, ದಯವಿಟ್ಟು ಹಂಚಿಕೊಳ್ಳಿ:\nMake: \nModel: \nYear: \nKilometers: \nCondition (excellent/good/fair): \nCity:',
      marathi: 'तुमच्या गाडीचे मूल्य अंदाज लावण्यासाठी, कृपया ही माहिती सामायिक करा:\nMake: \nModel: \nYear: \nKilometers: \nCondition (excellent/good/fair): \nCity:'
    };
    
    return valuationMessages[userLang] || valuationMessages.english;
  }

  // Test Drive Booking Flow
  if (session.state === 'testdrive_car') {
    // Extract car name from input - improved pattern matching
    const carMatch = input.match(/(?:for|of|the|test drive)\s+([^,]+)/i) || 
                     input.match(/([A-Za-z\s]+(?:nexon|creta|city|verna|i20|swift|baleno|fortuner|innova|seltos|venue|xuv|scorpio|tiago|jazz|elevate|virtus|kushaq|thar|scorpio|altroz|glanza|jazz|amaze|ciaz|vitara|brezza|s-presso|wagon|r|ignis|ciaz|swift|baleno|dzire|s-presso|vitara|brezza|eeco|omni|gypsy))/i) ||
                     input.match(/(hyundai|tata|maruti|mahindra|honda|toyota|ford|kia|renault|volkswagen|skoda|mg|nissan|jeep|volvo|bmw|mercedes|audi)\s+([a-z0-9\s]+)/i);
    
    let carName = carMatch ? (carMatch[2] ? `${carMatch[1]} ${carMatch[2]}`.trim() : carMatch[1].trim()) : input.trim();
    
    // Normalize car name - handle case variations and common patterns
    carName = carName.trim();
    
    if (!carName || carName.length < 3) {
      return 'Please specify the car name clearly. Examples: "Tata Nexon", "Honda City", "Hyundai Creta"';
    }
    
    // Validate car exists in inventory - improved search strategy
    try {
      const { searchInventoryTool } = await import('./tools.js');
      
      // Try multiple search strategies for better matching
      // Strategy 1: Normalize car name for better matching
      const normalizedCarName = carName.trim();
      
      // Strategy 2: Search by full model name (case-insensitive via ILIKE in DB)
      let searchResults = await searchInventoryTool({ model: normalizedCarName });
      
      // Strategy 3: If no results, try splitting brand and model
      if (!searchResults.results || searchResults.results.length === 0) {
        const words = normalizedCarName.split(/\s+/);
        if (words.length >= 2) {
          const brand = words[0];
          const model = words.slice(1).join(' ');
          searchResults = await searchInventoryTool({ brand: brand, model: model });
        }
      }
      
      // Strategy 4: If still no results, try with just model (common case: "Hyundai creta" -> "creta")
      if (!searchResults.results || searchResults.results.length === 0) {
        const modelWords = normalizedCarName.split(/\s+/);
        const modelOnly = modelWords.length > 1 ? modelWords.slice(1).join(' ') : normalizedCarName;
        searchResults = await searchInventoryTool({ model: modelOnly });
      }
      
      // Strategy 5: Try brand-only search if model-only didn't work
      if (!searchResults.results || searchResults.results.length === 0) {
        const words = normalizedCarName.split(/\s+/);
        if (words.length >= 2) {
          const brand = words[0];
          searchResults = await searchInventoryTool({ brand: brand });
        }
      }
      
      if (!searchResults.results || searchResults.results.length === 0) {
        return `I couldn't find "${carName}" in our current inventory. Please check the car name or browse our available cars first.`;
      }
      
      // Store the first matching car for test drive
      session.data.carName = carName;
      session.data.selectedCar = searchResults.results[0];
      session.state = 'testdrive_date';
      setSession(userId, session);
      
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      
      const carInfo = searchResults.results[0];
      const priceStr = carInfo.price ? `₹${carInfo.price.toLocaleString('en-IN')}` : 'Price: N/A';
    
    return `Perfect! You want to test drive: **${carName}**

🚗 **Car Details:**
• Brand: ${carInfo.brand || carInfo.make || 'N/A'}
• Model: ${carInfo.model || 'N/A'}
• Year: ${carInfo.year || 'N/A'}
• Price: ${priceStr}

Available dates:
• Today (${today.toLocaleDateString('en-IN')})
• Tomorrow (${tomorrow.toLocaleDateString('en-IN')})
• Day after tomorrow (${dayAfter.toLocaleDateString('en-IN')})

Please choose a date or type "custom" for a specific date.`;
    } catch (error) {
      console.error('Error validating car:', error);
      return 'I had trouble checking our inventory. Please try again or contact our team directly.';
    }
  }

  if (session.state === 'testdrive_date') {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    let selectedDate;
    if (lower.includes('today')) {
      selectedDate = today;
    } else if (lower.includes('tomorrow')) {
      selectedDate = tomorrow;
    } else if (lower.includes('day after') || lower.includes('day after tomorrow')) {
      selectedDate = dayAfter;
    } else if (lower.includes('custom')) {
      session.state = 'testdrive_custom_date';
      setSession(userId, session);
      return 'Please enter the date in DD-MM-YYYY format (e.g., 15-01-2024)';
    } else {
      // Try to parse date from input
      const dateMatch = input.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        selectedDate = new Date(year, month - 1, day);
      } else {
        return `Please choose from available dates:
• Today (${today.toLocaleDateString('en-IN')})
• Tomorrow (${tomorrow.toLocaleDateString('en-IN')})
• Day after tomorrow (${dayAfter.toLocaleDateString('en-IN')})
• Or type "custom" for a specific date`;
      }
    }
    
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      session.data.testDate = selectedDate.toISOString().split('T')[0];
      session.state = 'testdrive_time';
      setSession(userId, session);
      
      return `Great! Date selected: **${selectedDate.toLocaleDateString('en-IN')}**

Available time slots:
• 9:00 AM - 10:00 AM
• 10:00 AM - 11:00 AM  
• 11:00 AM - 12:00 PM
• 2:00 PM - 3:00 PM
• 3:00 PM - 4:00 PM
• 4:00 PM - 5:00 PM

Please choose a time slot.`;
    }
    
    return 'Invalid date. Please choose from the available options.';
  }

  if (session.state === 'testdrive_custom_date') {
    const dateMatch = input.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (!dateMatch) {
      return 'Please enter date in DD-MM-YYYY format (e.g., 15-01-2024)';
    }
    
    const [, day, month, year] = dateMatch;
    const selectedDate = new Date(year, month - 1, day);
    
    if (isNaN(selectedDate.getTime()) || selectedDate < new Date()) {
      return 'Invalid date or past date. Please enter a valid future date in DD-MM-YYYY format.';
    }
    
    session.data.testDate = selectedDate.toISOString().split('T')[0];
    session.state = 'testdrive_time';
    setSession(userId, session);
    
    return `Great! Date selected: **${selectedDate.toLocaleDateString('en-IN')}**

Available time slots:
• 9:00 AM - 10:00 AM
• 10:00 AM - 11:00 AM  
• 11:00 AM - 12:00 PM
• 2:00 PM - 3:00 PM
• 3:00 PM - 4:00 PM
• 4:00 PM - 5:00 PM

Please choose a time slot.`;
  }

  if (session.state === 'testdrive_time') {
    const timeSlots = {
      '9:00': '9:00 AM - 10:00 AM',
      '10:00': '10:00 AM - 11:00 AM',
      '11:00': '11:00 AM - 12:00 PM',
      '2:00': '2:00 PM - 3:00 PM',
      '3:00': '3:00 PM - 4:00 PM',
      '4:00': '4:00 PM - 5:00 PM'
    };
    
    let selectedTime;
    for (const [key, value] of Object.entries(timeSlots)) {
      if (lower.includes(key) || lower.includes(value.toLowerCase())) {
        selectedTime = value;
        break;
      }
    }
    
    if (!selectedTime) {
      return `Please choose a time slot:
• 9:00 AM - 10:00 AM
• 10:00 AM - 11:00 AM  
• 11:00 AM - 12:00 PM
• 2:00 PM - 3:00 PM
• 3:00 PM - 4:00 PM
• 4:00 PM - 5:00 PM`;
    }
    
    session.data.testTime = selectedTime;
    session.state = 'testdrive_location';
    setSession(userId, session);
    
    return `Perfect! Time selected: **${selectedTime}**

Available locations:
• Main Showroom - MG Road, Bangalore
• Branch - Electronic City, Bangalore
• Home Visit (within 20km of Bangalore)

Please choose your preferred location.`;
  }

  if (session.state === 'testdrive_location') {
    let location;
    if (lower.includes('main') || lower.includes('mg road')) {
      location = 'Main Showroom - MG Road, Bangalore';
    } else if (lower.includes('electronic') || lower.includes('branch')) {
      location = 'Branch - Electronic City, Bangalore';
    } else if (lower.includes('home') || lower.includes('visit')) {
      location = 'Home Visit (within 20km of Bangalore)';
    } else {
      return `Please choose a location:
• Main Showroom - MG Road, Bangalore
• Branch - Electronic City, Bangalore
• Home Visit (within 20km of Bangalore)`;
    }
    
    session.data.testLocation = location;
    session.state = 'testdrive_contact';
    setSession(userId, session);
    
    return `Excellent! Location selected: **${location}**

Now please provide your contact details:
• Your Name:
• Phone Number:
• Email (optional):

Please share all details in one message.`;
  }

  if (session.state === 'testdrive_contact') {
    const nameMatch = input.match(/name\s*:\s*(.*)/i);
    const phoneMatch = input.match(/phone\s*:\s*(\+?\d[\d\s-]{6,})/i);
    const emailMatch = input.match(/email\s*:\s*([^\s]+@[^\s]+\.[^\s]+)/i);
    
    if (nameMatch) session.data.customerName = nameMatch[1].trim();
    if (phoneMatch) session.data.customerPhone = phoneMatch[1].replace(/\s|-/g, '');
    if (emailMatch) session.data.customerEmail = emailMatch[1].trim();
    
    if (!session.data.customerName || !session.data.customerPhone) {
      setSession(userId, session);
      return 'Please provide at least your Name and Phone Number:\n• Your Name:\n• Phone Number:\n• Email (optional):';
    }
    
    // Use the enhanced scheduleTestDriveTool
    try {
      const { scheduleTestDriveTool } = await import('./tools.js');
      const result = await scheduleTestDriveTool({
        vehicleId: session.data.selectedCar?.id || session.data.carName,
        date: session.data.testDate,
        time: session.data.testTime,
        name: session.data.customerName,
        phone: session.data.customerPhone,
        email: session.data.customerEmail,
        location: session.data.testLocation,
        carName: session.data.carName
      });
      
      if (!result.ok) {
        return `❌ **Booking Failed:** ${result.message}\n\nPlease try selecting a different time slot or contact us directly at +91-9876543210.`;
      }
      
    const testDate = new Date(session.data.testDate).toLocaleDateString('en-IN');
      
      // Send confirmation notification
      try {
        const { sendTestDriveNotificationTool } = await import('./tools.js');
        await sendTestDriveNotificationTool({
          bookingId: result.confirmationId,
          type: 'confirmation'
        });
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Continue with booking even if notification fails
      }
    
    const confirmation = `🎉 **TEST DRIVE BOOKED SUCCESSFULLY!**

📋 **Booking Details:**
• Booking ID: ${result.confirmationId}
• Car: ${session.data.carName}
• Date: ${testDate}
• Time: ${session.data.testTime}
• Location: ${session.data.testLocation}
• Customer: ${session.data.customerName}
• Phone: ${session.data.customerPhone}${session.data.customerEmail ? `\n• Email: ${session.data.customerEmail}` : ''}

📞 **Next Steps:**
• Our team will call you within 2 hours to confirm
• Please bring a valid driving license
• Test drive duration: 30 minutes
• Free pickup/drop available (if home visit selected)
• Confirmation email/SMS sent to your contact details

**Contact:** +91-9876543210 for any changes

Thank you for choosing AutoSherpa Motors! 🚗`;

    session.state = null; 
    session.data = {}; 
    setSession(userId, session);
    return confirmation;
    } catch (error) {
      console.error('Error booking test drive:', error);
      return 'I encountered an error while booking your test drive. Please contact us directly at +91-9876543210 for assistance.';
    }
  }

  // Enhanced service booking completion handler
  if (session.state === 'service_booking') {
    const makeMatch = input.match(/make\s*:\s*(.*)/i) || input.match(/brand\s*:\s*(.*)/i) || input.match(/ब्रांड\s*:\s*(.*)/i);
    const modelMatch = input.match(/model\s*:\s*(.*)/i) || input.match(/मॉडल\s*:\s*(.*)/i);
    const yearMatch = input.match(/year\s*:\s*(\d{4})/i) || input.match(/साल\s*:\s*(\d{4})/i);
    const regMatch = input.match(/registration\s*(?:number)?\s*:\s*([A-Z]{2}\d{2}[A-Z]{2}\d{4})/i);
    const serviceMatch = input.match(/service\s*(?:type)?\s*:\s*(.*)/i) || input.match(/सर्विस\s*:\s*(.*)/i);
    
    if (makeMatch) session.data.make = makeMatch[1].trim();
    if (modelMatch) session.data.model = modelMatch[1].trim();
    if (yearMatch) session.data.year = yearMatch[1];
    if (regMatch) session.data.registration = regMatch[1];
    if (serviceMatch) session.data.serviceType = serviceMatch[1].trim();
    
    // Check if we have all required details
    if (!session.data.make || !session.data.model || !session.data.year || !session.data.serviceType) {
      setSession(userId, session);
      
      const errorMessages = {
        english: 'Please provide all required details:\n\n**Vehicle Details:**\n• Make: (e.g., Hyundai, Maruti, Honda)\n• Model: (e.g., i20, Swift, City)\n• Year: (e.g., 2020, 2021)\n• Registration Number: (e.g., KA01AB1234)\n\n**Service Type:**\n• Regular Service\n• Major Service\n• Accident Repair\n• Insurance Claim\n• Other (please specify)',
        hindi: 'कृपया सभी आवश्यक जानकारी दें:\n\n**गाड़ी की जानकारी:**\n• ब्रांड: (जैसे, हुंडई, मारुति, होंडा)\n• मॉडल: (जैसे, i20, स्विफ्ट, सिटी)\n• साल: (जैसे, 2020, 2021)\n• रजिस्ट्रेशन नंबर: (जैसे, KA01AB1234)\n\n**सर्विस का प्रकार:**\n• रेगुलर सर्विस\n• मेजर सर्विस\n• एक्सीडेंट रिपेयर\n• इंश्योरेंस क्लेम\n• अन्य (कृपया बताएं)',
        kannada: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ:\n\n**ವಾಹನದ ವಿವರಗಳು:**\n• ಮೇಕ್: (ಉದಾ, ಹುಂಡೈ, ಮಾರುತಿ, ಹೋಂಡಾ)\n• ಮಾಡೆಲ್: (ಉದಾ, i20, ಸ್ವಿಫ್ಟ್, ಸಿಟಿ)\n• ವರ್ಷ: (ಉದಾ, 2020, 2021)\n• ನೋಂದಣಿ ಸಂಖ್ಯೆ: (ಉದಾ, KA01AB1234)\n\n**ಸೇವೆಯ ಪ್ರಕಾರ:**\n• ನಿಯಮಿತ ಸೇವೆ\n• ಪ್ರಮುಖ ಸೇವೆ\n• ಅಪಘಾತ ದುರಸ್ತಿ\n• ವಿಮೆ ಹಕ್ಕು\n• ಇತರೆ (ದಯವಿಟ್ಟು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ)',
        marathi: 'कृपया सर्व आवश्यक माहिती द्या:\n\n**गाडीची माहिती:**\n• ब्रँड: (जसे, हुंडई, मारुती, होंडा)\n• मॉडेल: (जसे, i20, स्विफ्ट, सिटी)\n• वर्ष: (जसे, 2020, 2021)\n• नोंदणी क्रमांक: (जसे, KA01AB1234)\n\n**सर्विसचा प्रकार:**\n• नियमित सर्विस\n• मुख्य सर्विस\n• अपघात दुरुस्ती\n• विमा दावा\n• इतर (कृपया सांगा)'
      };
      
      return errorMessages[userLang] || errorMessages.english;
    }
    
    // Generate service booking confirmation
    const bookingId = `SB-${Date.now().toString().slice(-6)}`;
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const confirmationMessages = {
      english: `🔧 **SERVICE BOOKING CONFIRMED!**\n\n📋 **Booking Details:**\n• **Booking ID:** ${bookingId}\n• **Vehicle:** ${session.data.make} ${session.data.model} (${session.data.year})\n• **Registration:** ${session.data.registration || 'Not provided'}\n• **Service Type:** ${session.data.serviceType}\n• **Preferred Date:** Tomorrow (${tomorrow.toLocaleDateString('en-IN')})\n• **Time Slot:** 10:00 AM - 12:00 PM\n\n📍 **Service Center:**\n• **Main Service Center** - MG Road, Bangalore\n• **Address:** 123 MG Road, Bangalore - 560001\n• **Phone:** +91-9876543210\n\n📞 **Next Steps:**\n• Our service team will call you within 2 hours to confirm\n• Please bring your vehicle RC, insurance papers, and service history\n• Free pickup/drop available within 20km\n• Service duration: 2-4 hours (depending on service type)\n\n**Contact:** +91-9876543210 for any changes\n\nThank you for choosing Sherpa Hyundai Service! 🚗`,
      hindi: `🔧 **सर्विस बुकिंग कन्फर्म!**\n\n📋 **बुकिंग की जानकारी:**\n• **बुकिंग आईडी:** ${bookingId}\n• **गाड़ी:** ${session.data.make} ${session.data.model} (${session.data.year})\n• **रजिस्ट्रेशन:** ${session.data.registration || 'नहीं दिया गया'}\n• **सर्विस का प्रकार:** ${session.data.serviceType}\n• **पसंदीदा तारीख:** कल (${tomorrow.toLocaleDateString('en-IN')})\n• **समय:** 10:00 AM - 12:00 PM\n\n📍 **सर्विस सेंटर:**\n• **मुख्य सर्विस सेंटर** - MG रोड, बैंगलोर\n• **पता:** 123 MG रोड, बैंगलोर - 560001\n• **फोन:** +91-9876543210\n\n📞 **अगले कदम:**\n• हमारी सर्विस टीम 2 घंटे में कॉन्फर्म करने के लिए कॉल करेगी\n• कृपया अपनी गाड़ी का RC, इंश्योरेंस पेपर्स और सर्विस हिस्ट्री लाएं\n• 20km के अंदर मुफ्त पिकअप/ड्रॉप उपलब्ध\n• सर्विस की अवधि: 2-4 घंटे (सर्विस के प्रकार के अनुसार)\n\n**संपर्क:** कोई बदलाव के लिए +91-9876543210\n\nशेरपा हुंडई सर्विस चुनने के लिए धन्यवाद! 🚗`,
      kannada: `🔧 **ಸೇವೆ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!**\n\n📋 **ಬುಕಿಂಗ್ ವಿವರಗಳು:**\n• **ಬುಕಿಂಗ್ ID:** ${bookingId}\n• **ವಾಹನ:** ${session.data.make} ${session.data.model} (${session.data.year})\n• **ನೋಂದಣಿ:** ${session.data.registration || 'ಒದಗಿಸಲಾಗಿಲ್ಲ'}\n• **ಸೇವೆಯ ಪ್ರಕಾರ:** ${session.data.serviceType}\n• **ಆದ್ಯತೆಯ ದಿನಾಂಕ:** ನಾಳೆ (${tomorrow.toLocaleDateString('en-IN')})\n• **ಸಮಯ:** 10:00 AM - 12:00 PM\n\n📍 **ಸೇವಾ ಕೇಂದ್ರ:**\n• **ಮುಖ್ಯ ಸೇವಾ ಕೇಂದ್ರ** - MG ರಸ್ತೆ, ಬೆಂಗಳೂರು\n• **ವಿಳಾಸ:** 123 MG ರಸ್ತೆ, ಬೆಂಗಳೂರು - 560001\n• **ಫೋನ್:** +91-9876543210\n\n📞 **ಮುಂದಿನ ಹಂತಗಳು:**\n• ನಮ್ಮ ಸೇವಾ ತಂಡವು 2 ಗಂಟೆಗಳಲ್ಲಿ ದೃಢೀಕರಿಸಲು ಕರೆ ಮಾಡುತ್ತದೆ\n• ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಾಹನದ RC, ವಿಮೆ ಪತ್ರಗಳು ಮತ್ತು ಸೇವಾ ಇತಿಹಾಸವನ್ನು ತರಿ\n• 20km ಒಳಗೆ ಉಚಿತ ಪಿಕಪ್/ಡ್ರಾಪ್ ಲಭ್ಯ\n• ಸೇವಾ ಅವಧಿ: 2-4 ಗಂಟೆಗಳು (ಸೇವೆಯ ಪ್ರಕಾರವನ್ನು ಅವಲಂಬಿಸಿ)\n\n**ಸಂಪರ್ಕ:** ಯಾವುದೇ ಬದಲಾವಣೆಗಳಿಗಾಗಿ +91-9876543210\n\nಶೆರ್ಪಾ ಹುಂಡೈ ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! 🚗`,
      marathi: `🔧 **सर्विस बुकिंग कन्फर्म!**\n\n📋 **बुकिंगची माहिती:**\n• **बुकिंग ID:** ${bookingId}\n• **गाडी:** ${session.data.make} ${session.data.model} (${session.data.year})\n• **नोंदणी:** ${session.data.registration || 'दिले नाही'}\n• **सर्विसचा प्रकार:** ${session.data.serviceType}\n• **पसंतीची तारीख:** उद्या (${tomorrow.toLocaleDateString('en-IN')})\n• **वेळ:** 10:00 AM - 12:00 PM\n\n📍 **सर्विस सेंटर:**\n• **मुख्य सर्विस सेंटर** - MG रोड, बंगळूर\n• **पत्ता:** 123 MG रोड, बंगळूर - 560001\n• **फोन:** +91-9876543210\n\n📞 **पुढचे पाऊल:**\n• आमची सर्विस टीम 2 तासांत कन्फर्म करण्यासाठी कॉल करेल\n• कृपया आपल्या गाडीचे RC, विमा कागदपत्रे आणि सर्विस इतिहास आणा\n• 20km आत मोफत पिकअप/ड्रॉप उपलब्ध\n• सर्विसचा कालावधी: 2-4 तास (सर्विसच्या प्रकारावर अवलंबून)\n\n**संपर्क:** कोणत्याही बदलांसाठी +91-9876543210\n\nशेरपा हुंडई सर्विस निवडल्याबद्दल धन्यवाद! 🚗`
    };
    
    session.state = null;
    session.data = {};
    setSession(userId, session);
    return confirmationMessages[userLang] || confirmationMessages.english;
  }

  if (session.state === 'valuation_collect') {
    const make = (input.match(/make\s*:\s*(.*)/i) || [])[1];
    const model = (input.match(/model\s*:\s*(.*)/i) || [])[1];
    const year = (input.match(/year\s*:\s*(\d{4})/i) || [])[1];
    const kilometers = (input.match(/kilometers\s*:\s*(\d+)/i) || [])[1];
    const condition = (input.match(/condition\s*:\s*(excellent|good|fair)/i) || [])[1];
    const city = (input.match(/city\s*:\s*(.*)/i) || [])[1];
    session.data = { ...session.data, make, model, year, kilometers, condition, city };
    if (!session.data.make || !session.data.model || !session.data.year) {
      setSession(userId, session);
      return 'Please include at least Make, Model, and Year.';
    }
    const { carValuationTool } = await import('./tools.js');
    const result = await carValuationTool(session.data);
    session.state = null; session.data = {}; setSession(userId, session);
    if (!result.ok) return 'Could not compute valuation. Please check your inputs.';
    const range = result.estimateRangeInInr;
    return `Estimated resale value for ${result.make} ${result.model} (${result.year}):\n₹${range.low.toLocaleString('en-IN')} - ₹${range.high.toLocaleString('en-IN')}\n(Condition: ${result.condition}, KMs: ${result.kilometers}${result.city ? `, City: ${result.city}` : ''})`;
  }

  // Test Drive Management Flows
  if (session.state === 'testdrive_check') {
    const phoneMatch = input.match(/(\+?\d[\d\s-]{6,})/);
    const bookingIdMatch = input.match(/(TD-\d+)/i);
    
    if (!phoneMatch && !bookingIdMatch) {
      return 'Please provide your phone number (e.g., 9876543210) or booking ID (e.g., TD-123456).';
    }
    
    try {
      const { getTestDriveBookingsTool } = await import('./tools.js');
      const result = await getTestDriveBookingsTool({
        phone: phoneMatch ? phoneMatch[1].replace(/\s|-/g, '') : null,
        confirmationId: bookingIdMatch ? bookingIdMatch[1] : null
      });
      
      if (!result.ok) {
        return `❌ Error: ${result.message}`;
      }
      
      if (!result.bookings || result.bookings.length === 0) {
        session.state = null; session.data = {}; setSession(userId, session);
        return 'No test drive bookings found. Please check your phone number or booking ID.';
      }
      
      const bookings = result.bookings;
      const bookingDetails = bookings.map(booking => {
        const date = new Date(booking.booking_date).toLocaleDateString('en-IN');
        const status = booking.status === 'confirmed' ? '✅ Confirmed' : 
                     booking.status === 'cancelled' ? '❌ Cancelled' :
                     booking.status === 'completed' ? '✅ Completed' : '❓ Unknown';
        
        return `📋 **Booking ID:** ${booking.confirmation_id}
🚗 **Car:** ${booking.car_name || 'N/A'}
📅 **Date:** ${date}
⏰ **Time:** ${booking.time_slot}
📍 **Location:** ${booking.location || 'N/A'}
👤 **Customer:** ${booking.customer_name || 'N/A'}
📞 **Phone:** ${booking.customer_phone || 'N/A'}
📧 **Email:** ${booking.customer_email || 'N/A'}
📊 **Status:** ${status}`;
      }).join('\n\n---\n\n');
      
      session.state = null; session.data = {}; setSession(userId, session);
      return `🔍 **Your Test Drive Bookings:**\n\n${bookingDetails}\n\nNeed to make changes? Contact us at +91-9876543210`;
    } catch (error) {
      console.error('Error checking test drive bookings:', error);
      session.state = null; session.data = {}; setSession(userId, session);
      return 'I encountered an error while checking your bookings. Please contact us directly at +91-9876543210.';
    }
  }

  if (session.state === 'testdrive_cancel') {
    const phoneMatch = input.match(/(\+?\d[\d\s-]{6,})/);
    const bookingIdMatch = input.match(/(TD-\d+)/i);
    
    if (!phoneMatch && !bookingIdMatch) {
      return 'Please provide your phone number (e.g., 9876543210) or booking ID (e.g., TD-123456).';
    }
    
    try {
      const { cancelTestDriveTool } = await import('./tools.js');
      const result = await cancelTestDriveTool({
        phone: phoneMatch ? phoneMatch[1].replace(/\s|-/g, '') : null,
        confirmationId: bookingIdMatch ? bookingIdMatch[1] : null
      });
      
      if (!result.ok) {
        session.state = null; session.data = {}; setSession(userId, session);
        return `❌ **Cancellation Failed:** ${result.message}\n\nPlease contact us directly at +91-9876543210 for assistance.`;
      }
      
      // Send cancellation notification
      try {
        const { sendTestDriveNotificationTool } = await import('./tools.js');
        await sendTestDriveNotificationTool({
          bookingId: phoneMatch ? phoneMatch[1].replace(/\s|-/g, '') : bookingIdMatch[1],
          type: 'cancellation'
        });
      } catch (notificationError) {
        console.error('Error sending cancellation notification:', notificationError);
        // Continue with cancellation even if notification fails
      }
      
      session.state = null; session.data = {}; setSession(userId, session);
      return `✅ **Test Drive Cancelled Successfully!**

Your test drive booking has been cancelled. You can book a new test drive anytime by saying "book test drive".

**Contact:** +91-9876543210 for any assistance

Thank you for choosing AutoSherpa Motors! 🚗`;
    } catch (error) {
      console.error('Error cancelling test drive:', error);
      session.state = null; session.data = {}; setSession(userId, session);
      return 'I encountered an error while cancelling your booking. Please contact us directly at +91-9876543210.';
    }
  }

  // Service booking flow
  if (session.state === 'service_booking') {
    const makeMatch = input.match(/make\s*:\s*(.*)/i);
    const modelMatch = input.match(/model\s*:\s*(.*)/i);
    const yearMatch = input.match(/year\s*:\s*(\d{4})/i);
    const regMatch = input.match(/registration\s*(?:number)?\s*:\s*([A-Z]{2}\d{2}[A-Z]{2}\d{4})/i);
    const serviceMatch = input.match(/service\s*(?:type)?\s*:\s*(.*)/i);
    
    if (makeMatch) session.data.make = makeMatch[1].trim();
    if (modelMatch) session.data.model = modelMatch[1].trim();
    if (yearMatch) session.data.year = yearMatch[1];
    if (regMatch) session.data.registration = regMatch[1];
    if (serviceMatch) session.data.serviceType = serviceMatch[1].trim();
    
    // Check if we have all required details
    if (!session.data.make || !session.data.model || !session.data.year || !session.data.serviceType) {
      setSession(userId, session);
      return 'Please provide all required details:\n\n**Vehicle Details:**\n• Make: (e.g., Hyundai, Maruti, Honda)\n• Model: (e.g., i20, Swift, City)\n• Year: (e.g., 2020, 2021)\n• Registration Number: (e.g., KA01AB1234)\n\n**Service Type:**\n• Regular Service\n• Major Service\n• Accident Repair\n• Insurance Claim\n• Other (please specify)';
    }
    
    // Generate service booking confirmation
    const bookingId = `SB-${Date.now().toString().slice(-6)}`;
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const confirmation = `🔧 **SERVICE BOOKING CONFIRMED!**

📋 **Booking Details:**
• **Booking ID:** ${bookingId}
• **Vehicle:** ${session.data.make} ${session.data.model} (${session.data.year})
• **Registration:** ${session.data.registration || 'Not provided'}
• **Service Type:** ${session.data.serviceType}
• **Preferred Date:** Tomorrow (${tomorrow.toLocaleDateString('en-IN')})
• **Time Slot:** 10:00 AM - 12:00 PM

📍 **Service Center:**
• **Main Service Center** - MG Road, Bangalore
• **Address:** 123 MG Road, Bangalore - 560001
• **Phone:** +91-9876543210

📞 **Next Steps:**
• Our service team will call you within 2 hours to confirm
• Please bring your vehicle RC, insurance papers, and service history
• Free pickup/drop available within 20km
• Service duration: 2-4 hours (depending on service type)

**Contact:** +91-9876543210 for any changes

Thank you for choosing Sherpa Hyundai Service! 🚗`;

    session.state = null;
    session.data = {};
    setSession(userId, session);
    return confirmation;
  }

  // Appointment booking flow with multilingual support
  if (['appointment', 'book appointment', 'schedule appointment', 'meeting', 'consultation'].includes(lower) ||
      lower.includes('appointment') || lower.includes('meeting') || lower.includes('consultation') ||
      lower.includes('अपॉइंटमेंट') || lower.includes('मीटिंग') || lower.includes('सलाह') ||
      lower.includes('appointment book') || lower.includes('meeting chahiye') || lower.includes('consultation lena')) {
    session.state = 'appointment_booking';
    session.data = {};
    setSession(userId, session);
    
    // Check if input is Hinglish using proper detection
    const isHinglish = checkIsHinglish(input);
    
    const appointmentMessages = {
      english: `Great! I'll help you book an appointment. Please provide:\n\n**Appointment Details:**\n• Purpose: (e.g., Car Consultation, Test Drive, Service)\n• Preferred Date: (e.g., Tomorrow, Next Week, Specific Date)\n• Preferred Time: (e.g., Morning, Afternoon, Evening)\n• Duration: (e.g., 30 minutes, 1 hour)\n\n**Your Details:**\n• Name:\n• Phone Number:\n• Email (optional):\n\nPlease share all details in one message.`,
      hindi: isHinglish ? 
        `Bahut badhiya! Main aapke liye appointment book karne mein madad karunga. Kripya ye details dein:\n\n**Appointment ki jaankari:**\n• Purpose: (jaise, Car Consultation, Test Drive, Service)\n• Preferred Date: (jaise, Tomorrow, Next Week, Specific Date)\n• Preferred Time: (jaise, Morning, Afternoon, Evening)\n• Duration: (jaise, 30 minutes, 1 hour)\n\n**Aapki jaankari:**\n• Name:\n• Phone Number:\n• Email (optional):\n\nKripya saari jaankari ek saath bhejein.` :
        `बहुत बढ़िया! मैं आपके लिए अपॉइंटमेंट बुक करने में मदद करूंगा। कृपया जानकारी दें:\n\n**अपॉइंटमेंट की जानकारी:**\n• उद्देश्य: (जैसे, कार कंसल्टेशन, टेस्ट ड्राइव, सर्विस)\n• पसंदीदा तारीख: (जैसे, कल, अगले सप्ताह, विशिष्ट तारीख)\n• पसंदीदा समय: (जैसे, सुबह, दोपहर, शाम)\n• अवधि: (जैसे, 30 मिनट, 1 घंटा)\n\n**आपकी जानकारी:**\n• नाम:\n• फोन नंबर:\n• ईमेल (वैकल्पिक):\n\nकृपया सभी जानकारी एक साथ भेजें।`,
      kannada: `ಚೆನ್ನಾಗಿದೆ! ನಾನು ನಿಮಗಾಗಿ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಒದಗಿಸಿ:\n\n**ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿವರಗಳು:**\n• ಉದ್ದೇಶ: (ಉದಾ, ಕಾರ್ ಸಲಹೆ, ಟೆಸ್ಟ್ ಡ್ರೈವ್, ಸೇವೆ)\n• ಆದ್ಯತೆಯ ದಿನಾಂಕ: (ಉದಾ, ನಾಳೆ, ಮುಂದಿನ ವಾರ, ನಿರ್ದಿಷ್ಟ ದಿನಾಂಕ)\n• ಆದ್ಯತೆಯ ಸಮಯ: (ಉದಾ, ಬೆಳಿಗ್ಗೆ, ಮಧ್ಯಾಹ್ನ, ಸಂಜೆ)\n• ಅವಧಿ: (ಉದಾ, 30 ನಿಮಿಷ, 1 ಗಂಟೆ)\n\n**ನಿಮ್ಮ ವಿವರಗಳು:**\n• ಹೆಸರು:\n• ಫೋನ್ ನಂಬರ್:\n• ಇಮೇಲ್ (ಐಚ್ಛಿಕ):\n\nದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಒಂದೇ ಸಂದೇಶದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ.`,
      marathi: `छान! मी तुमच्यासाठी अपॉइंटमेंट बुक करण्यात मदत करेन. कृपया माहिती द्या:\n\n**अपॉइंटमेंटची माहिती:**\n• हेतू: (जसे, कार सल्लागार, टेस्ट ड्राइव, सर्विस)\n• पसंतीची तारीख: (जसे, उद्या, पुढचा आठवडा, विशिष्ट तारीख)\n• पसंतीचा वेळ: (जसे, सकाळ, दुपार, संध्याकाळ)\n• कालावधी: (जसे, 30 मिनिटे, 1 तास)\n\n**तुमची माहिती:**\n• नाव:\n• फोन नंबर:\n• ईमेल (पर्यायी):\n\nकृपया सर्व माहिती एकाच संदेशात सांगा.`
    };
    
    return appointmentMessages[userLang] || appointmentMessages.english;
  }

  // Enhanced financing completion handler
  // Only continue financing flow if user is actually providing financing details or explicitly asking about financing
  // Don't treat unrelated questions (like car availability) as part of financing flow
  if (session.state === 'financing_inquiry') {
    // Handle financing-related questions
    const isFinancingQuestion = lower.includes('100%') || lower.includes('down payment') || lower.includes('interest rate') || 
                                lower.includes('emi') || lower.includes('loan tenure') || lower.includes('instant loan') ||
                                lower.includes('zero down') || lower.includes('banks') || lower.includes('approval');
    
    // Allow user to exit financing flow if they ask about something else (but allow financing questions)
    if (!isFinancingQuestion) {
      const isCarAvailabilityQuestion = lower.includes('available') || lower.includes('availability') || 
                                         (lower.includes('have') && lower.includes('car'));
      const isCarSearchQuestion = lower.includes('looking for') || lower.includes('search') || 
                                  lower.includes('show me') || lower.includes('find');
      
      if (isCarAvailabilityQuestion || isCarSearchQuestion) {
        // Reset session to allow new flow
        session.state = null;
        session.data = session.data || {};
        setSession(userId, session);
        // Let it fall through to handle the car search/availability question
        // The availability check above will handle it
      }
    }
    
    // Handle financing questions directly
    if (isFinancingQuestion) {
      const financingQAMessages = {
        english: 'For used cars, typically banks offer 70-90% financing. Down payment requirements vary (usually 10-30% of car value). Interest rates for used cars range from 8-15% p.a. We work with multiple banks for quick approvals. Would you like me to calculate EMI for a specific car?',
        hinglish: 'Used cars ke liye, typically banks 70-90% financing dete hain. Down payment requirements vary hoti hain (usually 10-30% of car value). Interest rates used cars ke liye 8-15% p.a. tak range karti hain. Hum multiple banks ke saath kaam karte hain quick approvals ke liye. Kya aap chahenge ki main kisi specific car ke liye EMI calculate karun?',
        hindi: 'पुरानी कारों के लिए, आमतौर पर बैंक 70-90% वित्तपोषण देते हैं। डाउन पेमेंट की आवश्यकताएं अलग-अलग होती हैं (आमतौर पर कार मूल्य का 10-30%)। पुरानी कारों के लिए ब्याज दरें 8-15% प्रति वर्ष तक होती हैं। हम त्वरित अनुमोदन के लिए कई बैंकों के साथ काम करते हैं। क्या आप चाहेंगे कि मैं किसी विशिष्ट कार के लिए EMI की गणना करूं?'
      };
      return financingQAMessages[userLang] || financingQAMessages.english;
    }
    
    const carModelMatch = input.match(/car\s*model\s*:\s*(.*)/i) || input.match(/कार\s*मॉडल\s*:\s*(.*)/i);
    const carPriceMatch = input.match(/car\s*price\s*:\s*₹?([\d,]+)/i) || input.match(/कार\s*कीमत\s*:\s*₹?([\d,]+)/i);
    const downPaymentMatch = input.match(/down\s*payment\s*:\s*₹?([\d,]+)/i) || input.match(/डाउन\s*पेमेंट\s*:\s*₹?([\d,]+)/i);
    const tenureMatch = input.match(/tenure\s*:\s*(\d+)/i) || input.match(/अवधि\s*:\s*(\d+)/i);
    const incomeMatch = input.match(/income\s*:\s*₹?([\d,]+)/i) || input.match(/आय\s*:\s*₹?([\d,]+)/i);
    const employmentMatch = input.match(/employment\s*:\s*(.*)/i) || input.match(/रोजगार\s*:\s*(.*)/i);
    
    if (carModelMatch) session.data.carModel = carModelMatch[1].trim();
    if (carPriceMatch) session.data.carPrice = parseInt(carPriceMatch[1].replace(/,/g, ''));
    if (downPaymentMatch) session.data.downPayment = parseInt(downPaymentMatch[1].replace(/,/g, ''));
    if (tenureMatch) session.data.tenure = parseInt(tenureMatch[1]);
    if (incomeMatch) session.data.income = parseInt(incomeMatch[1].replace(/,/g, ''));
    if (employmentMatch) session.data.employment = employmentMatch[1].trim();
    
    // Check if we have all required details
    if (!session.data.carModel || !session.data.carPrice || !session.data.downPayment || !session.data.tenure || !session.data.income) {
      setSession(userId, session);
      
      const errorMessages = {
        english: 'Please provide all required details:\n\n**Car Details:**\n• Car Model: (e.g., Hyundai i20, Maruti Swift)\n• Car Price: (e.g., ₹8,00,000)\n• Down Payment: (e.g., ₹2,00,000)\n• Loan Tenure: (e.g., 3, 4, 5 years)\n\n**Your Details:**\n• Monthly Income: (e.g., ₹50,000)\n• Employment Type: (Salaried/Self-employed)',
        hindi: 'कृपया सभी आवश्यक जानकारी दें:\n\n**कार की जानकारी:**\n• कार मॉडल: (जैसे, हुंडई i20, मारुति स्विफ्ट)\n• कार की कीमत: (जैसे, ₹8,00,000)\n• डाउन पेमेंट: (जैसे, ₹2,00,000)\n• लोन टेन्योर: (जैसे, 3, 4, 5 साल)\n\n**आपकी जानकारी:**\n• मासिक आय: (जैसे, ₹50,000)\n• रोजगार का प्रकार: (सैलरीड/सेल्फ एम्प्लॉयड)',
        kannada: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ:\n\n**ಕಾರಿನ ವಿವರಗಳು:**\n• ಕಾರ್ ಮಾಡೆಲ್: (ಉದಾ, ಹುಂಡೈ i20, ಮಾರುತಿ ಸ್ವಿಫ್ಟ್)\n• ಕಾರ್ ಬೆಲೆ: (ಉದಾ, ₹8,00,000)\n• ಡೌನ್ ಪೇಮೆಂಟ್: (ಉದಾ, ₹2,00,000)\n• ಲೋನ್ ಅವಧಿ: (ಉದಾ, 3, 4, 5 ವರ್ಷಗಳು)\n\n**ನಿಮ್ಮ ವಿವರಗಳು:**\n• ಮಾಸಿಕ ಆದಾಯ: (ಉದಾ, ₹50,000)\n• ಉದ್ಯೋಗದ ಪ್ರಕಾರ: (ಸಂಬಳ/ಸ್ವ-ಉದ್ಯೋಗಿ)',
        marathi: 'कृपया सर्व आवश्यक माहिती द्या:\n\n**गाडीची माहिती:**\n• गाडीचे मॉडेल: (जसे, हुंडई i20, मारुती स्विफ्ट)\n• गाडीची किंमत: (जसे, ₹8,00,000)\n• डाउन पेमेंट: (जसे, ₹2,00,000)\n• लोन टेन्योर: (जसे, 3, 4, 5 वर्षे)\n\n**तुमची माहिती:**\n• मासिक उत्पन्न: (जसे, ₹50,000)\n• रोजगाराचा प्रकार: (पगारी/स्व-रोजगारी)'
      };
      
      return errorMessages[userLang] || errorMessages.english;
    }
    
    // Calculate EMI and provide financing options
    const loanAmount = session.data.carPrice - session.data.downPayment;
    const interestRate = 8.5; // 8.5% annual interest rate
    const monthlyRate = interestRate / 12 / 100;
    const tenureMonths = session.data.tenure * 12;
    const emi = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1));
    
    const financingMessages = {
      english: `💰 **FINANCING OPTIONS AVAILABLE!**\n\n📋 **Loan Details:**\n• **Car Model:** ${session.data.carModel}\n• **Car Price:** ₹${session.data.carPrice.toLocaleString('en-IN')}\n• **Down Payment:** ₹${session.data.downPayment.toLocaleString('en-IN')}\n• **Loan Amount:** ₹${loanAmount.toLocaleString('en-IN')}\n• **Interest Rate:** ${interestRate}% p.a.\n• **Tenure:** ${session.data.tenure} years\n\n💳 **EMI Calculation:**\n• **Monthly EMI:** ₹${emi.toLocaleString('en-IN')}\n• **Total Interest:** ₹${((emi * tenureMonths) - loanAmount).toLocaleString('en-IN')}\n• **Total Amount:** ₹${(emi * tenureMonths).toLocaleString('en-IN')}\n\n📞 **Next Steps:**\n• Our finance team will call you within 2 hours\n• Document verification and approval process\n• Quick disbursal within 24-48 hours\n\n**Contact:** +91-9876543210 for immediate assistance\n\nThank you for choosing Sherpa Hyundai Finance! 🚗`,
      hindi: `💰 **फाइनेंसिंग ऑप्शन्स उपलब्ध!**\n\n📋 **लोन की जानकारी:**\n• **कार मॉडल:** ${session.data.carModel}\n• **कार की कीमत:** ₹${session.data.carPrice.toLocaleString('en-IN')}\n• **डाउन पेमेंट:** ₹${session.data.downPayment.toLocaleString('en-IN')}\n• **लोन राशि:** ₹${loanAmount.toLocaleString('en-IN')}\n• **ब्याज दर:** ${interestRate}% वार्षिक\n• **अवधि:** ${session.data.tenure} साल\n\n💳 **EMI कैलकुलेशन:**\n• **मासिक EMI:** ₹${emi.toLocaleString('en-IN')}\n• **कुल ब्याज:** ₹${((emi * tenureMonths) - loanAmount).toLocaleString('en-IN')}\n• **कुल राशि:** ₹${(emi * tenureMonths).toLocaleString('en-IN')}\n\n📞 **अगले कदम:**\n• हमारी फाइनेंस टीम 2 घंटे में कॉल करेगी\n• डॉक्यूमेंट वेरिफिकेशन और अप्रूवल प्रोसेस\n• 24-48 घंटे में त्वरित डिसबर्सल\n\n**संपर्क:** तुरंत सहायता के लिए +91-9876543210\n\nशेरपा हुंडई फाइनेंस चुनने के लिए धन्यवाद! 🚗`,
      kannada: `💰 **ಹಣಕಾಸು ಆಯ್ಕೆಗಳು ಲಭ್ಯ!**\n\n📋 **ಸಾಲದ ವಿವರಗಳು:**\n• **ಕಾರ್ ಮಾಡೆಲ್:** ${session.data.carModel}\n• **ಕಾರ್ ಬೆಲೆ:** ₹${session.data.carPrice.toLocaleString('en-IN')}\n• **ಡೌನ್ ಪೇಮೆಂಟ್:** ₹${session.data.downPayment.toLocaleString('en-IN')}\n• **ಸಾಲದ ಮೊತ್ತ:** ₹${loanAmount.toLocaleString('en-IN')}\n• **ಬಡ್ಡಿ ದರ:** ${interestRate}% ವಾರ್ಷಿಕ\n• **ಅವಧಿ:** ${session.data.tenure} ವರ್ಷಗಳು\n\n💳 **EMI ಲೆಕ್ಕಾಚಾರ:**\n• **ಮಾಸಿಕ EMI:** ₹${emi.toLocaleString('en-IN')}\n• **ಒಟ್ಟು ಬಡ್ಡಿ:** ₹${((emi * tenureMonths) - loanAmount).toLocaleString('en-IN')}\n• **ಒಟ್ಟು ಮೊತ್ತ:** ₹${(emi * tenureMonths).toLocaleString('en-IN')}\n\n📞 **ಮುಂದಿನ ಹಂತಗಳು:**\n• ನಮ್ಮ ಹಣಕಾಸು ತಂಡವು 2 ಗಂಟೆಗಳಲ್ಲಿ ಕರೆ ಮಾಡುತ್ತದೆ\n• ದಾಖಲೆ ಪರಿಶೀಲನೆ ಮತ್ತು ಅನುಮೋದನೆ ಪ್ರಕ್ರಿಯೆ\n• 24-48 ಗಂಟೆಗಳಲ್ಲಿ ತ್ವರಿತ ವಿತರಣೆ\n\n**ಸಂಪರ್ಕ:** ತಕ್ಷಣ ಸಹಾಯಕ್ಕಾಗಿ +91-9876543210\n\nಶೆರ್ಪಾ ಹುಂಡೈ ಹಣಕಾಸನ್ನು ಆಯ್ಕೆಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! 🚗`,
      marathi: `💰 **फायनान्सिंग ऑप्शन्स उपलब्ध!**\n\n📋 **लोनची माहिती:**\n• **गाडीचे मॉडेल:** ${session.data.carModel}\n• **गाडीची किंमत:** ₹${session.data.carPrice.toLocaleString('en-IN')}\n• **डाउन पेमेंट:** ₹${session.data.downPayment.toLocaleString('en-IN')}\n• **लोन रक्कम:** ₹${loanAmount.toLocaleString('en-IN')}\n• **व्याज दर:** ${interestRate}% वार्षिक\n• **कालावधी:** ${session.data.tenure} वर्षे\n\n💳 **EMI गणना:**\n• **मासिक EMI:** ₹${emi.toLocaleString('en-IN')}\n• **एकूण व्याज:** ₹${((emi * tenureMonths) - loanAmount).toLocaleString('en-IN')}\n• **एकूण रक्कम:** ₹${(emi * tenureMonths).toLocaleString('en-IN')}\n\n📞 **पुढचे पाऊल:**\n• आमची फायनान्स टीम 2 तासांत कॉल करेल\n• दस्तऐवज सत्यापन आणि मंजुरी प्रक्रिया\n• 24-48 तासांत त्वरित वितरण\n\n**संपर्क:** त्वरित सहायतेसाठी +91-9876543210\n\nशेरपा हुंडई फायनान्स निवडल्याबद्दल धन्यवाद! 🚗`
    };
    
    session.state = null;
    session.data = {};
    setSession(userId, session);
    return financingMessages[userLang] || financingMessages.english;
  }

  // Enhanced insurance completion handler
  if (session.state === 'insurance_inquiry') {
    const carModelMatch = input.match(/car\s*model\s*:\s*(.*)/i) || input.match(/कार\s*मॉडल\s*:\s*(.*)/i);
    const yearMatch = input.match(/year\s*:\s*(\d{4})/i) || input.match(/साल\s*:\s*(\d{4})/i);
    const valueMatch = input.match(/value\s*:\s*₹?([\d,]+)/i) || input.match(/मूल्य\s*:\s*₹?([\d,]+)/i);
    const claimsMatch = input.match(/claims\s*:\s*(yes|no)/i) || input.match(/क्लेम\s*:\s*(हाँ|नहीं)/i);
    const coverageMatch = input.match(/coverage\s*:\s*(.*)/i) || input.match(/कवरेज\s*:\s*(.*)/i);
    
    if (carModelMatch) session.data.carModel = carModelMatch[1].trim();
    if (yearMatch) session.data.year = yearMatch[1];
    if (valueMatch) session.data.value = parseInt(valueMatch[1].replace(/,/g, ''));
    if (claimsMatch) session.data.claims = claimsMatch[1].toLowerCase();
    if (coverageMatch) session.data.coverage = coverageMatch[1].trim();
    
    // Check if we have all required details
    if (!session.data.carModel || !session.data.year || !session.data.value || !session.data.coverage) {
      setSession(userId, session);
      
      const errorMessages = {
        english: 'Please provide all required details:\n\n**Vehicle Details:**\n• Car Model: (e.g., Hyundai i20, Maruti Swift)\n• Year of Purchase: (e.g., 2020, 2021)\n• Current Value: (e.g., ₹8,00,000)\n• Previous Claims: (Yes/No)\n\n**Coverage Type:**\n• Comprehensive (Full Coverage)\n• Third Party (Basic Coverage)\n• Zero Depreciation',
        hindi: 'कृपया सभी आवश्यक जानकारी दें:\n\n**गाड़ी की जानकारी:**\n• कार मॉडल: (जैसे, हुंडई i20, मारुति स्विफ्ट)\n• खरीद का साल: (जैसे, 2020, 2021)\n• वर्तमान मूल्य: (जैसे, ₹8,00,000)\n• पिछले क्लेम: (हाँ/नहीं)\n\n**कवरेज का प्रकार:**\n• कॉम्प्रिहेंसिव (पूर्ण कवरेज)\n• थर्ड पार्टी (बेसिक कवरेज)\n• जीरो डिप्रीसिएशन',
        kannada: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ:\n\n**ವಾಹನದ ವಿವರಗಳು:**\n• ಕಾರ್ ಮಾಡೆಲ್: (ಉದಾ, ಹುಂಡೈ i20, ಮಾರುತಿ ಸ್ವಿಫ್ಟ್)\n• ಖರೀದಿಯ ವರ್ಷ: (ಉದಾ, 2020, 2021)\n• ಪ್ರಸ್ತುತ ಮೌಲ್ಯ: (ಉದಾ, ₹8,00,000)\n• ಹಿಂದಿನ ಹಕ್ಕುಗಳು: (ಹೌದು/ಇಲ್ಲ)\n\n**ಕವರೇಜ್ ಪ್ರಕಾರ:**\n• ಸಮಗ್ರ (ಪೂರ್ಣ ಕವರೇಜ್)\n• ಮೂರನೇ ಪಕ್ಷ (ಮೂಲಭೂತ ಕವರೇಜ್)\n• ಶೂನ್ಯ ಸವಕಲು',
        marathi: 'कृपया सर्व आवश्यक माहिती द्या:\n\n**गाडीची माहिती:**\n• गाडीचे मॉडेल: (जसे, हुंडई i20, मारुती स्विफ्ट)\n• खरेदीचे वर्ष: (जसे, 2020, 2021)\n• सध्याचे मूल्य: (जसे, ₹8,00,000)\n• मागील दावे: (होय/नाही)\n\n**कव्हरेजचा प्रकार:**\n• व्यापक (पूर्ण कव्हरेज)\n• तृतीय पक्ष (मूलभूत कव्हरेज)\n• शून्य घसारा'
      };
      
      return errorMessages[userLang] || errorMessages.english;
    }
    
    // Calculate insurance premium
    const basePremium = session.data.value * 0.03; // 3% of vehicle value
    const noClaimsDiscount = session.data.claims === 'no' ? 0.1 : 0; // 10% discount for no claims
    const finalPremium = Math.round(basePremium * (1 - noClaimsDiscount));
    
    const insuranceMessages = {
      english: `🛡️ **INSURANCE QUOTE READY!**\n\n📋 **Policy Details:**\n• **Car Model:** ${session.data.carModel}\n• **Year:** ${session.data.year}\n• **Current Value:** ₹${session.data.value.toLocaleString('en-IN')}\n• **Coverage Type:** ${session.data.coverage}\n• **Previous Claims:** ${session.data.claims === 'yes' ? 'Yes' : 'No'}\n\n💰 **Premium Calculation:**\n• **Base Premium:** ₹${Math.round(basePremium).toLocaleString('en-IN')}\n• **No Claims Discount:** ${noClaimsDiscount * 100}%\n• **Final Premium:** ₹${finalPremium.toLocaleString('en-IN')}\n• **Policy Validity:** 1 Year\n\n📞 **Next Steps:**\n• Our insurance team will call you within 2 hours\n• Policy documentation and payment\n• Instant policy activation\n\n**Contact:** +91-9876543210 for immediate assistance\n\nThank you for choosing Sherpa Hyundai Insurance! 🚗`,
      hindi: `🛡️ **इंश्योरेंस क्वोट तैयार!**\n\n📋 **पॉलिसी की जानकारी:**\n• **कार मॉडल:** ${session.data.carModel}\n• **साल:** ${session.data.year}\n• **वर्तमान मूल्य:** ₹${session.data.value.toLocaleString('en-IN')}\n• **कवरेज का प्रकार:** ${session.data.coverage}\n• **पिछले क्लेम:** ${session.data.claims === 'yes' ? 'हाँ' : 'नहीं'}\n\n💰 **प्रीमियम कैलकुलेशन:**\n• **बेस प्रीमियम:** ₹${Math.round(basePremium).toLocaleString('en-IN')}\n• **नो क्लेम डिस्काउंट:** ${noClaimsDiscount * 100}%\n• **फाइनल प्रीमियम:** ₹${finalPremium.toLocaleString('en-IN')}\n• **पॉलिसी वैधता:** 1 साल\n\n📞 **अगले कदम:**\n• हमारी इंश्योरेंस टीम 2 घंटे में कॉल करेगी\n• पॉलिसी डॉक्यूमेंटेशन और पेमेंट\n• तुरंत पॉलिसी एक्टिवेशन\n\n**संपर्क:** तुरंत सहायता के लिए +91-9876543210\n\nशेरपा हुंडई इंश्योरेंस चुनने के लिए धन्यवाद! 🚗`,
      kannada: `🛡️ **ವಿಮೆ ಉಲ್ಲೇಖ ಸಿದ್ಧ!**\n\n📋 **ಪಾಲಿಸಿ ವಿವರಗಳು:**\n• **ಕಾರ್ ಮಾಡೆಲ್:** ${session.data.carModel}\n• **ವರ್ಷ:** ${session.data.year}\n• **ಪ್ರಸ್ತುತ ಮೌಲ್ಯ:** ₹${session.data.value.toLocaleString('en-IN')}\n• **ಕವರೇಜ್ ಪ್ರಕಾರ:** ${session.data.coverage}\n• **ಹಿಂದಿನ ಹಕ್ಕುಗಳು:** ${session.data.claims === 'yes' ? 'ಹೌದು' : 'ಇಲ್ಲ'}\n\n💰 **ಪ್ರೀಮಿಯಂ ಲೆಕ್ಕಾಚಾರ:**\n• **ಬೇಸ್ ಪ್ರೀಮಿಯಂ:** ₹${Math.round(basePremium).toLocaleString('en-IN')}\n• **ನೋ ಕ್ಲೇಮ್ಸ್ ರಿಯಾಯಿತಿ:** ${noClaimsDiscount * 100}%\n• **ಅಂತಿಮ ಪ್ರೀಮಿಯಂ:** ₹${finalPremium.toLocaleString('en-IN')}\n• **ಪಾಲಿಸಿ ಸಿಂಧುತೆ:** 1 ವರ್ಷ\n\n📞 **ಮುಂದಿನ ಹಂತಗಳು:**\n• ನಮ್ಮ ವಿಮೆ ತಂಡವು 2 ಗಂಟೆಗಳಲ್ಲಿ ಕರೆ ಮಾಡುತ್ತದೆ\n• ಪಾಲಿಸಿ ದಾಖಲೆ ಮತ್ತು ಪಾವತಿ\n• ತತ್ಕ್ಷಣ ಪಾಲಿಸಿ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ\n\n**ಸಂಪರ್ಕ:** ತಕ್ಷಣ ಸಹಾಯಕ್ಕಾಗಿ +91-9876543210\n\nಶೆರ್ಪಾ ಹುಂಡೈ ವಿಮೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! 🚗`,
      marathi: `🛡️ **विमा कोट तयार!**\n\n📋 **पॉलिसीची माहिती:**\n• **गाडीचे मॉडेल:** ${session.data.carModel}\n• **वर्ष:** ${session.data.year}\n• **सध्याचे मूल्य:** ₹${session.data.value.toLocaleString('en-IN')}\n• **कव्हरेजचा प्रकार:** ${session.data.coverage}\n• **मागील दावे:** ${session.data.claims === 'yes' ? 'होय' : 'नाही'}\n\n💰 **प्रीमियम गणना:**\n• **बेस प्रीमियम:** ₹${Math.round(basePremium).toLocaleString('en-IN')}\n• **नो क्लेम सूट:** ${noClaimsDiscount * 100}%\n• **अंतिम प्रीमियम:** ₹${finalPremium.toLocaleString('en-IN')}\n• **पॉलिसी वैधता:** 1 वर्ष\n\n📞 **पुढचे पाऊल:**\n• आमची विमा टीम 2 तासांत कॉल करेल\n• पॉलिसी दस्तऐवज आणि पेमेंट\n• त्वरित पॉलिसी सक्रियता\n\n**संपर्क:** त्वरित सहायतेसाठी +91-9876543210\n\nशेरपा हुंडई विमा निवडल्याबद्दल धन्यवाद! 🚗`
    };
    
    session.state = null;
    session.data = {};
    setSession(userId, session);
    return insuranceMessages[userLang] || insuranceMessages.english;
  }

  // Enhanced appointment completion handler
  if (session.state === 'appointment_booking') {
    const purposeMatch = input.match(/purpose\s*:\s*(.*)/i) || input.match(/उद्देश्य\s*:\s*(.*)/i);
    const dateMatch = input.match(/date\s*:\s*(.*)/i) || input.match(/तारीख\s*:\s*(.*)/i);
    const timeMatch = input.match(/time\s*:\s*(.*)/i) || input.match(/समय\s*:\s*(.*)/i);
    const durationMatch = input.match(/duration\s*:\s*(.*)/i) || input.match(/अवधि\s*:\s*(.*)/i);
    const nameMatch = input.match(/name\s*:\s*(.*)/i) || input.match(/नाम\s*:\s*(.*)/i);
    const phoneMatch = input.match(/phone\s*:\s*(\+?\d[\d\s-]{6,})/i) || input.match(/फोन\s*:\s*(\+?\d[\d\s-]{6,})/i);
    const emailMatch = input.match(/email\s*:\s*([^\s]+@[^\s]+\.[^\s]+)/i);
    
    if (purposeMatch) session.data.purpose = purposeMatch[1].trim();
    if (dateMatch) session.data.date = dateMatch[1].trim();
    if (timeMatch) session.data.time = timeMatch[1].trim();
    if (durationMatch) session.data.duration = durationMatch[1].trim();
    if (nameMatch) session.data.name = nameMatch[1].trim();
    if (phoneMatch) session.data.phone = phoneMatch[1].replace(/\s|-/g, '');
    if (emailMatch) session.data.email = emailMatch[1].trim();
    
    // Check if we have all required details
    if (!session.data.purpose || !session.data.date || !session.data.time || !session.data.name || !session.data.phone) {
      setSession(userId, session);
      
      const errorMessages = {
        english: 'Please provide all required details:\n\n**Appointment Details:**\n• Purpose: (e.g., Car Consultation, Test Drive, Service)\n• Preferred Date: (e.g., Tomorrow, Next Week, Specific Date)\n• Preferred Time: (e.g., Morning, Afternoon, Evening)\n• Duration: (e.g., 30 minutes, 1 hour)\n\n**Your Details:**\n• Name:\n• Phone Number:\n• Email (optional):',
        hindi: 'कृपया सभी आवश्यक जानकारी दें:\n\n**अपॉइंटमेंट की जानकारी:**\n• उद्देश्य: (जैसे, कार कंसल्टेशन, टेस्ट ड्राइव, सर्विस)\n• पसंदीदा तारीख: (जैसे, कल, अगले सप्ताह, विशिष्ट तारीख)\n• पसंदीदा समय: (जैसे, सुबह, दोपहर, शाम)\n• अवधि: (जैसे, 30 मिनट, 1 घंटा)\n\n**आपकी जानकारी:**\n• नाम:\n• फोन नंबर:\n• ईमेल (वैकल्पिक):',
        kannada: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ:\n\n**ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿವರಗಳು:**\n• ಉದ್ದೇಶ: (ಉದಾ, ಕಾರ್ ಸಲಹೆ, ಟೆಸ್ಟ್ ಡ್ರೈವ್, ಸೇವೆ)\n• ಆದ್ಯತೆಯ ದಿನಾಂಕ: (ಉದಾ, ನಾಳೆ, ಮುಂದಿನ ವಾರ, ನಿರ್ದಿಷ್ಟ ದಿನಾಂಕ)\n• ಆದ್ಯತೆಯ ಸಮಯ: (ಉದಾ, ಬೆಳಿಗ್ಗೆ, ಮಧ್ಯಾಹ್ನ, ಸಂಜೆ)\n• ಅವಧಿ: (ಉದಾ, 30 ನಿಮಿಷ, 1 ಗಂಟೆ)\n\n**ನಿಮ್ಮ ವಿವರಗಳು:**\n• ಹೆಸರು:\n• ಫೋನ್ ನಂಬರ್:\n• ಇಮೇಲ್ (ಐಚ್ಛಿಕ):',
        marathi: 'कृपया सर्व आवश्यक माहिती द्या:\n\n**अपॉइंटमेंटची माहिती:**\n• हेतू: (जसे, कार सल्लागार, टेस्ट ड्राइव, सर्विस)\n• पसंतीची तारीख: (जसे, उद्या, पुढचा आठवडा, विशिष्ट तारीख)\n• पसंतीचा वेळ: (जसे, सकाळ, दुपार, संध्याकाळ)\n• कालावधी: (जसे, 30 मिनिटे, 1 तास)\n\n**तुमची माहिती:**\n• नाव:\n• फोन नंबर:\n• ईमेल (पर्यायी):'
      };
      
      return errorMessages[userLang] || errorMessages.english;
    }
    
    // Generate appointment confirmation
    const appointmentId = `AP-${Date.now().toString().slice(-6)}`;
    
    const appointmentMessages = {
      english: `📅 **APPOINTMENT BOOKED SUCCESSFULLY!**\n\n📋 **Appointment Details:**\n• **Appointment ID:** ${appointmentId}\n• **Purpose:** ${session.data.purpose}\n• **Date:** ${session.data.date}\n• **Time:** ${session.data.time}\n• **Duration:** ${session.data.duration || '1 hour'}\n• **Customer:** ${session.data.name}\n• **Phone:** ${session.data.phone}${session.data.email ? `\n• **Email:** ${session.data.email}` : ''}\n\n📍 **Location:**\n• **Main Showroom** - MG Road, Bangalore\n• **Address:** 123 MG Road, Bangalore - 560001\n• **Phone:** +91-9876543210\n\n📞 **Next Steps:**\n• Our team will call you within 2 hours to confirm\n• Please arrive 10 minutes before your appointment\n• Free parking available\n• Refreshments will be provided\n\n**Contact:** +91-9876543210 for any changes\n\nThank you for choosing Sherpa Hyundai! 🚗`,
      hindi: `📅 **अपॉइंटमेंट सफलतापूर्वक बुक!**\n\n📋 **अपॉइंटमेंट की जानकारी:**\n• **अपॉइंटमेंट आईडी:** ${appointmentId}\n• **उद्देश्य:** ${session.data.purpose}\n• **तारीख:** ${session.data.date}\n• **समय:** ${session.data.time}\n• **अवधि:** ${session.data.duration || '1 घंटा'}\n• **ग्राहक:** ${session.data.name}\n• **फोन:** ${session.data.phone}${session.data.email ? `\n• **ईमेल:** ${session.data.email}` : ''}\n\n📍 **स्थान:**\n• **मुख्य शोरूम** - MG रोड, बैंगलोर\n• **पता:** 123 MG रोड, बैंगलोर - 560001\n• **फोन:** +91-9876543210\n\n📞 **अगले कदम:**\n• हमारी टीम 2 घंटे में कॉन्फर्म करने के लिए कॉल करेगी\n• कृपया अपॉइंटमेंट से 10 मिनट पहले पहुंचें\n• मुफ्त पार्किंग उपलब्ध\n• रिफ्रेशमेंट प्रदान किया जाएगा\n\n**संपर्क:** कोई बदलाव के लिए +91-9876543210\n\nशेरपा हुंडई चुनने के लिए धन्यवाद! 🚗`,
      kannada: `📅 **ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಯಶಸ್ವಿಯಾಗಿ ಬುಕ್!**\n\n📋 **ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿವರಗಳು:**\n• **ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ID:** ${appointmentId}\n• **ಉದ್ದೇಶ:** ${session.data.purpose}\n• **ದಿನಾಂಕ:** ${session.data.date}\n• **ಸಮಯ:** ${session.data.time}\n• **ಅವಧಿ:** ${session.data.duration || '1 ಗಂಟೆ'}\n• **ಗ್ರಾಹಕ:** ${session.data.name}\n• **ಫೋನ್:** ${session.data.phone}${session.data.email ? `\n• **ಇಮೇಲ್:** ${session.data.email}` : ''}\n\n📍 **ಸ್ಥಳ:**\n• **ಮುಖ್ಯ ಶೋರೂಮ್** - MG ರಸ್ತೆ, ಬೆಂಗಳೂರು\n• **ವಿಳಾಸ:** 123 MG ರಸ್ತೆ, ಬೆಂಗಳೂರು - 560001\n• **ಫೋನ್:** +91-9876543210\n\n📞 **ಮುಂದಿನ ಹಂತಗಳು:**\n• ನಮ್ಮ ತಂಡವು 2 ಗಂಟೆಗಳಲ್ಲಿ ದೃಢೀಕರಿಸಲು ಕರೆ ಮಾಡುತ್ತದೆ\n• ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಕ್ಕೆ 10 ನಿಮಿಷ ಮುಂಚೆ ಬನ್ನಿ\n• ಉಚಿತ ಪಾರ್ಕಿಂಗ್ ಲಭ್ಯ\n• ತಾಜಾ ಪಾನೀಯಗಳನ್ನು ಒದಗಿಸಲಾಗುತ್ತದೆ\n\n**ಸಂಪರ್ಕ:** ಯಾವುದೇ ಬದಲಾವಣೆಗಳಿಗಾಗಿ +91-9876543210\n\nಶೆರ್ಪಾ ಹುಂಡೈ ಆಯ್ಕೆಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! 🚗`,
      marathi: `📅 **अपॉइंटमेंट यशस्वीरित्या बुक!**\n\n📋 **अपॉइंटमेंटची माहिती:**\n• **अपॉइंटमेंट ID:** ${appointmentId}\n• **हेतू:** ${session.data.purpose}\n• **तारीख:** ${session.data.date}\n• **वेळ:** ${session.data.time}\n• **कालावधी:** ${session.data.duration || '1 तास'}\n• **ग्राहक:** ${session.data.name}\n• **फोन:** ${session.data.phone}${session.data.email ? `\n• **ईमेल:** ${session.data.email}` : ''}\n\n📍 **स्थान:**\n• **मुख्य शोरूम** - MG रोड, बंगळूर\n• **पत्ता:** 123 MG रोड, बंगळूर - 560001\n• **फोन:** +91-9876543210\n\n📞 **पुढचे पाऊल:**\n• आमची टीम 2 तासांत कन्फर्म करण्यासाठी कॉल करेल\n• कृपया आपल्या अपॉइंटमेंटपूर्वी 10 मिनिटे आधी या\n• मोफत पार्किंग उपलब्ध\n• ताजे पेय प्रदान केले जाईल\n\n**संपर्क:** कोणत्याही बदलांसाठी +91-9876543210\n\nशेरपा हुंडई निवडल्याबद्दल धन्यवाद! 🚗`
    };
    
    session.state = null;
    session.data = {};
    setSession(userId, session);
    return appointmentMessages[userLang] || appointmentMessages.english;
  }

  // Language selection flow
  if (session.state === 'language_selection') {
    let selectedLang = 'english';
    
    if (lower.includes('1') || lower.includes('english') || lower.includes('अंग्रेजी')) {
      selectedLang = 'english';
    } else if (lower.includes('2') || lower.includes('hindi') || lower.includes('हिंदी')) {
      selectedLang = 'hindi';
    } else if (lower.includes('3') || lower.includes('kannada') || lower.includes('ಕನ್ನಡ')) {
      selectedLang = 'kannada';
    } else if (lower.includes('4') || lower.includes('marathi') || lower.includes('मराठी')) {
      selectedLang = 'marathi';
    } else {
      return `Please select a valid language option (1-4) or type the language name.`;
    }
    
    session.data.language = selectedLang;
    session.state = null;
    setSession(userId, session);
    
    const langMessages = {
      english: 'Language changed to English! How can I help you today?',
      hindi: 'भाषा हिंदी में बदल गई! आज मैं आपकी कैसे मदद कर सकता हूं?',
      kannada: 'ಭಾಷೆ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿತು! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      marathi: 'भाषा मराठीमध्ये बदलली! आज मी तुमची कशी मदत करू शकतो?'
    };
    
    return langMessages[selectedLang];
  }

  return null;
}




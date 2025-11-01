/**
 * Multilingual Support for Hindi, Kannada, and Marathi
 */

// Language detection patterns
const LANGUAGE_PATTERNS = {
  hindi: [
    'हिंदी', 'है', 'हैं', 'में', 'का', 'की', 'के', 'को', 'से', 'पर', 'तो', 'भी', 'नहीं', 'क्या', 'कैसे', 'कब', 'कहाँ', 'कौन', 'क्यों',
    'नमस्ते', 'सर', 'मैं', 'आप', 'कर', 'चाहता', 'चाहती', 'हूँ', 'हैं', 'देख', 'रहा', 'रही', 'लगभग', 'के', 'बीच', 'पेट्रोल', 'डीज़ल',
    'ज़रूर', 'बहुत', 'बढ़िया', 'चुनाव', 'बजट', 'कितना', 'रेंज', 'मॉडल', 'उपलब्ध', 'वेरिएंट', 'बिल्कुल', 'टेस्ट', 'ड्राइव', 'पहले',
    'दिखा', 'दीजिए', 'तुरंत', 'गाड़ी', 'तैयार', 'करवाता', 'वैसे', 'ड्राइविंग', 'लाइसेंस', 'आइए', 'रही', 'बाद', 'ऑफ़र', 'जानकारी',
    'दे', 'दूँगा', 'ठीक', 'धन्यवाद', 'स्वागत', 'हाँ', 'जी', 'ज़रूर', 'पेट्रोल', 'ही', 'चाहिए', 'दिखा', 'दीजिए'
  ],
  hinglish: [
    // Hinglish patterns (Hindi words in English script)
    'namaste', 'main', 'ek', 'khareedna', 'chahta', 'hoon', 'haan', 'dekh', 'raha', 'tha',
    'lagbhag', 'se', 'lakh', 'ke', 'ka', 'ki', 'ko', 'beech', 'petrol', 'hi', 'chahiye', 'zaroor', 'pehle', 'dikha', 'dijiye',
    'ji', 'hai', 'hain', 'theek', 'dhanyavaad', 'swagat', 'sir', 'aapka', 'madad', 'kar', 'sakta', 'kya', 'mann',
    'koi', 'khaas', 'brand', 'ya', 'model', 'bahut', 'badhiya', 'chunaav', 'budget', 'kitna', 'range',
    'hamare', 'paas', 'model', 'dono', 'uplabdh', 'variant', 'chahte', 'bilkul', 'test', 'drive', 'lena',
    'chahenge', 'turant', 'gaadi', 'tayyar', 'karwata', 'waise', 'driving', 'license', 'aaiye', 'rahi',
    'baad', 'emi', 'offer', 'poori', 'jankari', 'de', 'doonga', 'aap', 'hain', 'hun', 'rahi', 'liye', 'tak',
    'batao', 'batayein', 'deta', 'deti', 'hoga', 'hogi', 'hogey', 'details', 'mujhe', 'apni', 'apna', 'apne'
  ],
  kannada: [
    'ಕನ್ನಡ', 'ನಾನು', 'ನೀವು', 'ಅವರು', 'ಅವಳು', 'ಅದು', 'ಇದು', 'ಅಲ್ಲಿ', 'ಇಲ್ಲಿ', 'ಅವರ', 'ಅವಳ', 'ಅದರ', 'ಇದರ', 'ಅವರಿಗೆ', 'ಅವಳಿಗೆ', 'ಅದಕ್ಕೆ', 'ಇದಕ್ಕೆ', 'ಕಾರು', 'ಖರೀದಿಸಲು', 'ಬಯಸುತ್ತೇನೆ', 'ಬಯಸುತ್ತೀರಿ', 'ಆಗಿದೆ', 'ಆಗುತ್ತದೆ', 'ಆಗುತ್ತೇನೆ', 'ಆಗುತ್ತೀರಿ', 'ಎಷ್ಟು', 'ಎಲ್ಲಿ', 'ಎಂದು', 'ಏನು', 'ಹೇಗೆ', 'ಯಾವುದು', 'ಯಾರು', 'ಏಕೆ'
  ],
  marathi: [
    'मराठी', 'आहे', 'आहेत', 'मध्ये', 'चा', 'ची', 'चे', 'ला', 'पासून', 'वर', 'तर', 'ही', 'नाही', 'काय', 'कसे', 'कधी', 'कुठे', 'कोण', 'का'
  ]
};

// Basic translations for common responses
const TRANSLATIONS = {
  hindi: {
    welcome: 'नमस्ते! शेरपा हुंडई में आपका स्वागत है! आज मैं आपकी कैसे मदद कर सकता हूं?',
    car_search: 'कार खोजें',
    test_drive: 'टेस्ट ड्राइव बुक करें',
    service: 'सर्विस बुक करें',
    contact: 'संपर्क करें',
    about: 'हमारे बारे में',
    budget_question: 'आपका बजट क्या है? (अधिकतम)',
    select_car: 'कार चुनें',
    book_test_drive: 'क्या आप इस कार के लिए टेस्ट ड्राइव बुक करना चाहते हैं?',
    yes: 'हाँ',
    no: 'नहीं',
    name: 'नाम',
    phone: 'फोन नंबर',
    location: 'स्थान',
    car_type_question: 'कार का प्रकार चुनें',
    brand_question: 'ब्रांड चुनें',
    budget_confirmed: 'ठीक है। बजट',
    budget_error: 'कृपया बजट बताएं जैसे \'12 लाख\', \'20 लाख से कम\', \'15 लाख से अधिक\', या संख्या (जैसे 1200000)।',
    petrol: 'पेट्रोल',
    diesel: 'डीज़ल',
    hatchback: 'हैचबैक',
    sedan: 'सेडान',
    suv: 'एसयूवी',
    mpv: 'एमपीवी',
    second_hand_car: 'सेकंड हैंड कार',
    buy_car: 'कार खरीदना',
    looking_for_car: 'कार देख रहा',
    test_drive_question: 'क्या आप टेस्ट ड्राइव लेना चाहेंगे?',
    driving_license: 'ड्राइविंग लाइसेंस',
    show_car: 'कार दिखाएं',
    prepare_car: 'गाड़ी तैयार करें',
    emi_offers: 'EMI और ऑफ़र की जानकारी',
    thank_you: 'धन्यवाद',
    welcome_again: 'स्वागत है सर!'
  },
  hinglish: {
    welcome: 'Namaste! Sherpa Hyundai mein aapka swagat hai! Aaj main aapki kaise madad kar sakta hun?',
    car_search: 'Car search karein',
    test_drive: 'Test drive book karein',
    service: 'Service book karein',
    contact: 'Contact karein',
    about: 'Hamare baare mein',
    budget_question: 'Aapka budget kya hai? (Maximum)\nAap values type kar sakte hain jaise \'12 lakhs\', \'below 20 lakhs\', ya number jaise 1200000.',
    select_car: 'Car choose karein',
    book_test_drive: 'Kya aap is car ke liye test drive book karna chahte hain?',
    yes: 'Haan',
    no: 'Nahi',
    name: 'Naam',
    phone: 'Phone number',
    location: 'Location',
    car_type_question: 'Car ka type choose karein',
    brand_question: 'Brand choose karein',
    budget_confirmed: 'Theek hai. Budget',
    budget_error: 'Kripya budget batayein jaise \'12 lakhs\', \'20 lakhs se kam\', \'15 lakhs se zyada\', ya number (jaise 1200000).',
    petrol: 'Petrol',
    diesel: 'Diesel',
    hatchback: 'Hatchback',
    sedan: 'Sedan',
    suv: 'SUV',
    mpv: 'MPV',
    second_hand_car: 'Second hand car',
    buy_car: 'Car kharidna',
    looking_for_car: 'Car dekh raha',
    test_drive_question: 'Kya aap test drive lena chahenge?',
    driving_license: 'Driving license',
    show_car: 'Car dikhayein',
    prepare_car: 'Gaadi tayyar karein',
    emi_offers: 'EMI aur offer ki jaankari',
    thank_you: 'Dhanyavaad',
    welcome_again: 'Swagat hai sir!',
    // Common Hinglish phrases
    great: 'Bahut badhiya!',
    perfect: 'Perfect!',
    got_it: 'Samajh gaya.',
    found_cars: 'Aapke criteria ke hisaab se cars mili hain:',
    car_details: 'Car ka details:',
    would_you_like: 'Kya aap chahenge:',
    book_test_drive_option: 'Test drive book karein',
    get_financing: 'Financing options dekhein',
    see_more_details: 'Aur details dekhein',
    compare_cars: 'Cars compare karein'
  },
  kannada: {
    welcome: 'ನಮಸ್ಕಾರ! ಶೆರ್ಪಾ ಹುಂಡೈಗೆ ಸುಸ್ವಾಗತ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    car_search: 'ಕಾರು ಹುಡುಕಿ',
    test_drive: 'ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಬುಕ್ ಮಾಡಿ',
    service: 'ಸೇವೆ ಬುಕ್ ಮಾಡಿ',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    budget_question: 'ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು? (ಗರಿಷ್ಠ)\nನೀವು \'12 ಲಕ್ಷ\', \'20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ\', ಅಥವಾ 1200000 ನಂತಹ ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.',
    select_car: 'ಕಾರು ಆಯ್ಕೆಮಾಡಿ',
    book_test_drive: 'ಈ ಕಾರಿಗೆ ಟೆಸ್ಟ್ ಡ್ರೈವ್ ಬುಕ್ ಮಾಡಲು ಬಯಸುತ್ತೀರಾ?',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',
    name: 'ಹೆಸರು',
    phone: 'ಫೋನ್ ನಂಬರ್',
    location: 'ಸ್ಥಳ',
    budget_confirmed: 'ಸರಿ. ಬಜೆಟ್',
    car_type_question: 'ಕಾರಿನ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ',
    brand_question: 'ಬ್ರಾಂಡ್ ಆಯ್ಕೆಮಾಡಿ',
    budget_error: 'ದಯವಿಟ್ಟು ಬಜೆಟ್ ಹಂಚಿಕೊಳ್ಳಿ \'12 ಲಕ್ಷ\', \'20 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ\', \'15 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು\', ಅಥವಾ ಸಂಖ್ಯೆ (ಉದಾ 1200000).'
  },
  marathi: {
    welcome: 'नमस्कार! शेरपा हुंडई मध्ये आपले स्वागत! आज मी तुमची कशी मदत करू शकतो?',
    car_search: 'कार शोधा',
    test_drive: 'टेस्ट ड्राइव बुक करा',
    service: 'सेवा बुक करा',
    contact: 'संपर्क करा',
    about: 'आमच्या बद्दल',
    budget_question: 'तुमचा बजेट किती? (जास्तीत जास्त)',
    select_car: 'कार निवडा',
    book_test_drive: 'या कारसाठी टेस्ट ड्राइव बुक करायचे आहे का?',
    yes: 'होय',
    no: 'नाही',
    name: 'नाव',
    phone: 'फोन नंबर',
    location: 'स्थान'
  }
};

/**
 * Check if text contains Hinglish patterns
 */
export function isHinglish(text) {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase();
  
  // Use word boundary matching to avoid false positives (e.g., "se" in "used")
  const hinglishPatterns = LANGUAGE_PATTERNS.hinglish.filter(pattern => {
    // For short patterns (1-2 chars), require word boundaries to avoid substring matches
    if (pattern.length <= 2) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      return regex.test(text);
    }
    // For longer patterns, substring matching is OK
    return lowerText.includes(pattern);
  });
  const hinglishMatches = hinglishPatterns.length;
  
  // Check for mixed script (English letters + Hindi words)
  const hasEnglishLetters = /[a-zA-Z]/.test(text);
  const hasDevanagari = /[हिंदीकन्नडमराठी]/.test(text);
  
  // If Devanagari script is present, it's Hindi, not Hinglish
  if (hasDevanagari) return false;
  
  // Check for clear English phrases that indicate English
  const englishPhrases = [
    'i need', 'i want', 'i have', 'i am', 'do you have', 'do you', 'looking for',
    'used car', 'used cars', 'budget of', 'budget is', 'test drive', 'thank you',
    'can you', 'could you', 'what are', 'which', 'how much'
  ];
  const hasEnglishPhrase = englishPhrases.some(phrase => lowerText.includes(phrase));
  const englishPhraseCount = englishPhrases.filter(phrase => lowerText.includes(phrase)).length;
  
  // If multiple English phrases present, it's definitely English
  if (englishPhraseCount >= 2) {
    return false;
  }
  
  // If clear English phrases present and low Hinglish matches, it's English
  if (hasEnglishPhrase && hinglishMatches < 3) {
    return false;
  }
  
  // Require at least 3 Hinglish patterns to be confident it's Hinglish
  // This prevents false positives from English sentences
  const hasHinglishPatterns = hinglishMatches >= 3;
  
  return hasEnglishLetters && hasHinglishPatterns;
}

/**
 * Detect language from input text
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'english';
  
  const lowerText = text.toLowerCase();
  let maxMatches = 0;
  let detectedLang = 'english';
  
  // Check for explicit language indicators first
  if (lowerText.includes('हिंदी') || lowerText.includes('hindi')) {
    return 'hindi';
  }
  if (lowerText.includes('ಕನ್ನಡ') || lowerText.includes('kannada')) {
    return 'kannada';
  }
  if (lowerText.includes('मराठी') || lowerText.includes('marathi')) {
    return 'marathi';
  }
  
  // Enhanced Hinglish detection - check for mixed Hindi-English patterns
  // Use word boundary matching to avoid false positives (e.g., "se" in "used")
  const hinglishPatterns = LANGUAGE_PATTERNS.hinglish.filter(pattern => {
    // For short patterns (1-2 chars), require word boundaries to avoid substring matches
    if (pattern.length <= 2) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      return regex.test(text);
    }
    // For longer patterns, substring matching is OK
    return lowerText.includes(pattern);
  });
  const hinglishMatches = hinglishPatterns.length;
  
  // Check for common English phrases FIRST - these should always be English
  // This prevents false positives from Hinglish pattern matching
  const englishPhrases = [
    'i need', 'i want', 'i have', 'i am', 'i would', 'i can', 'i will',
    'looking for', 'show me', 'find me', 'help me', 'do you have', 'do you',
    'family of', 'members', 'used car', 'new car', 'used cars', 'budget of', 'budget is',
    'test drive', 'book', 'contact', 'about', 'service', 'financing',
    'what are', 'which', 'how much', 'can you', 'could you', 'please',
    'are there', 'is there', 'thank you', 'thanks', 'hello', 'hi', 'under ₹', 'under ₹'
  ];
  
  const hasEnglishPhrase = englishPhrases.some(phrase => lowerText.includes(phrase));
  const englishPhraseCount = englishPhrases.filter(phrase => lowerText.includes(phrase)).length;
  
  // If clear English phrases are present and no Devanagari script, prioritize English
  // Multiple English phrases strongly indicate English
  const hasDevanagari = /[हिंदीकन्नडमराठी]/.test(text);
  if (hasEnglishPhrase && !hasDevanagari) {
    // If we have multiple English phrases, it's definitely English
    if (englishPhraseCount >= 2) {
      return 'english';
    }
    // Single English phrase with low Hinglish matches (< 3) is English
    if (hinglishMatches < 3) {
      return 'english';
    }
  }
  
  // If we have significant Hinglish patterns (3+ for stricter detection), prioritize Hinglish
  if (hinglishMatches >= 3) {
    detectedLang = 'hinglish';
    maxMatches = hinglishMatches;
  }
  
  // Count matches for each language
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    if (lang === 'hinglish') continue; // Already handled above
    const matches = patterns.filter(pattern => lowerText.includes(pattern)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedLang = lang;
    }
  }
  
  // Require minimum threshold for non-English detection
  // This prevents false positives with common English words
  if (detectedLang !== 'english' && maxMatches < 1) {
    return 'english';
  }
  
  // If we already detected Hinglish with high confidence, return it
  if (detectedLang === 'hinglish' && hinglishMatches >= 3) {
    return 'hinglish';
  }
  
  // If text is mostly English words, default to English
  const englishWords = lowerText.split(/\s+/).filter(word => 
    /^[a-z]+$/.test(word) && word.length > 2 && !LANGUAGE_PATTERNS.hinglish.includes(word)
  );
  const totalWords = lowerText.split(/\s+/).filter(word => word.length > 0);
  
  if (totalWords.length > 0 && englishWords.length / totalWords.length > 0.7) {
    // High ratio of English words - return English unless strong Hinglish signals
    if (hinglishMatches < 3 || hasDevanagari) {
      return 'english';
    }
  }
  
  // Final check: if English phrases present but low Hinglish matches, it's English
  if (hasEnglishPhrase && hinglishMatches < 3) {
    return 'english';
  }
  
  return detectedLang;
}

/**
 * Get translation for a key in specified language
 */
export function getTranslation(key, language = 'english') {
  if (language === 'english' || !TRANSLATIONS[language]) {
    return key; // Return key as fallback
  }
  
  return TRANSLATIONS[language][key] || key;
}

/**
 * Translate common phrases
 */
export function translatePhrase(phrase, language = 'english') {
  const commonPhrases = {
    'welcome': 'welcome',
    'car search': 'car_search',
    'test drive': 'test_drive',
    'service': 'service',
    'contact': 'contact',
    'about': 'about',
    'budget question': 'budget_question',
    'select car': 'select_car',
    'book test drive': 'book_test_drive',
    'yes': 'yes',
    'no': 'no',
    'name': 'name',
    'phone': 'phone',
    'location': 'location'
  };
  
  const key = commonPhrases[phrase.toLowerCase()];
  if (key) {
    return getTranslation(key, language);
  }
  
  return phrase; // Return original if no translation found
}

/**
 * Get user's preferred language from session
 */
export function getUserLanguage(userId) {
  // This would typically be stored in user session or database
  // For now, return 'english' as default
  return 'english';
}

/**
 * Set user's preferred language
 */
export function setUserLanguage(userId, language) {
  // This would typically be stored in user session or database
  // For now, just return true
  return true;
}

/**
 * Translate response based on user's language preference
 */
export function translateResponse(response, userId) {
  const userLang = getUserLanguage(userId);
  if (userLang === 'english') {
    return response;
  }
  
  // For now, return the response with basic translations
  // In a full implementation, this would use a proper translation service
  return response;
}

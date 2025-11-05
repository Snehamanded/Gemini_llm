import { getSession, setSession } from './session.js';

// Known brand list for simple brand/model splitting
const KNOWN_BRANDS = [
  'hyundai','maruti suzuki','maruti','tata','mahindra','kia','honda','toyota','ford','volkswagen','skoda','renault','nissan','mg','jeep'
];

function splitBrandModel(rawName) {
  const name = String(rawName || '').toLowerCase().trim();
  let brand = null;
  let model = name;
  for (const b of KNOWN_BRANDS) {
    if (name.startsWith(b + ' ')) {
      brand = b === 'maruti suzuki' ? 'maruti' : b;
      model = name.substring(b.length).trim();
      break;
    }
  }
  if (!brand) {
    for (const b of KNOWN_BRANDS) {
      if (name.includes(' ' + b + ' ')) {
        brand = b === 'maruti suzuki' ? 'maruti' : b;
        model = name.replace(b, '').trim();
        break;
      }
    }
  }
  if (!brand) {
    brand = null;
    model = name;
  }
  return { brand, model };
}

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
  "Here's our journey and what makes Sherpa Hyundai special:\n\nWhere It All Began:\nSherpa Hyundai started with a simple mission — to make car buying and ownership a smooth, honest, and enjoyable experience for every customer.\n\nOur Roots:\nWith over 15 years in the automotive industry, we've grown from a single dealership to a trusted name in Bangalore for Hyundai cars — both new and certified pre-owned.\n\nCustomer First Approach:\nWe've proudly served 10,000+ happy customers, thanks to our commitment to transparency, value, and after-sales care.\n\nWhat Drives Us:\nOur passion is to help families and individuals find the right vehicle that fits their needs, lifestyle, and budget — while delivering 5-star service at every step.\n\nOur Vision:\nTo be the most loved and recommended Hyundai dealership in South India — trusted for both our people and our processes.\n\nWant to explore more?\n- Why Choose Us\n- Our Locations\n- Our Services\n- Achievements & Awards\n- Back to main menu"
);

const aboutWhyUs = () => (
  "Here's why thousands of customers trust Sherpa Hyundai:\n\nWHY CHOOSE SHERPA HYUNDAI:\n\nQuality Assurance:\n- 200+ point inspection on every car\n- Only certified pre-owned vehicles\n- Complete service history verification\n\nBest Value:\n- Competitive pricing\n- Fair trade-in values\n- Transparent pricing - no hidden costs\n\nTrust & Reliability:\n- 15+ years in automotive industry\n- 10,000+ happy customers\n- Extended warranty options\n\nComplete Service:\n- End-to-end car buying support\n- Financing assistance\n- Insurance & documentation help\n\nAfter-Sales Support:\n- Dedicated service team\n- Genuine spare parts\n- Regular maintenance reminders\n\nWant to know more?\n1. Visit our showroom\n2. Browse Used Cars\n3. Contact Us\n4. Back to main menu"
);

const aboutServices = () => (
  "At Sherpa Hyundai, we offer everything you need — from car buying to servicing — all under one roof!\n\nOUR SERVICES INCLUDE:\n\nNew Car Sales\n- Full range of Hyundai models\n- Expert sales consultation\n- Test drive at your convenience\n\nCertified Pre-Owned Cars\n- Thoroughly inspected & certified\n- Transparent pricing & service history\n- Finance & exchange options\n\nVehicle Servicing & Repairs\n- Hyundai-certified technicians\n- Genuine spare parts\n- Quick turnaround & pickup-drop facility\n\nBodyshop & Insurance Claims\n- Accident repairs & dent-paint services\n- Hassle-free insurance claim assistance\n- Cashless facility with major insurers\n\nFinance & Loan Assistance\n- Tie-ups with top banks & NBFCs\n- Best interest rates & fast approvals\n- On-road pricing breakdown\n\nCar Insurance & Renewals\n- Instant insurance quotes\n- Renewal reminders\n- Claim support from start to finish\n\nRC Transfer & Documentation\n- Ownership transfer assistance\n- RTO support\n- Documentation help for resale or exchange\n\nWant to explore a service in detail?\n1. Book a Service (We will call you back shortly)\n2. Browse Used Cars\n3. Talk to Our Team\n4. Back to main menu"
);

const aboutAwards = () => (
  "We're proud to be recognized for our commitment to excellence!\n\nSherpa Hyundai Achievements:\n- Best Customer Experience Dealer – South India (2023)\n- Top Performer in Certified Pre-Owned Sales (2022)\n- Highest Customer Satisfaction Score – Hyundai India (2021)\n- Hyundai Elite Partner Recognition – 3 Years in a Row\n\nWhat These Awards Mean for You:\n- Transparent & customer-friendly processes\n- Consistent service excellence\n- Trusted by thousands of happy customers\n\nOur real achievement?\nYour trust, referrals, and repeat visits — that's what drives us every day!"
);

export async function handleDeterministicFlows(userId, text) {
  const input = String(text || '').trim();
  const lower = input.toLowerCase();
  const session = getSession(userId);
  
  // Early intents: financing/EMI (stateful)
  if (/\b(emi|financ(ing|e))\b/i.test(input) || session.state === 'financing') {
    // Enter financing state
    session.state = 'financing';
    session.data = session.data || {};
    // Extract budget and term, store in session
    const lakhMatch = input.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs)/i);
    const numMatch = input.replace(/[,₹]/g, '').match(/\b(\d{5,9})\b/);
    const yearsMatch = input.match(/(\d+)\s*(years|year|yrs|yr)/i);
    const monthsMatch = input.match(/(\d+)\s*(months|month|mth|m)/i);
    if (lakhMatch) session.data.emiBudget = Math.round(parseFloat(lakhMatch[1]) * 100000);
    else if (numMatch) session.data.emiBudget = parseInt(numMatch[1], 10);
    if (yearsMatch) session.data.emiTermMonths = parseInt(yearsMatch[1], 10) * 12;
    else if (monthsMatch) session.data.emiTermMonths = parseInt(monthsMatch[1], 10);
    setSession(userId, session);
    // If we have enough info, compute immediately
    const vehiclePrice = session.data.emiBudget;
    const termMonths = session.data.emiTermMonths || 60;
    if (vehiclePrice) {
      try {
        const { financingQuoteTool } = await import('./tools.js');
        const quote = await financingQuoteTool({ vehiclePrice, termMonths });
        return `For ~₹${vehiclePrice.toLocaleString('en-IN')} over ${termMonths} months: \n• Estimated EMI: ₹${quote.monthlyPayment.toLocaleString('en-IN')}\n• Total Interest: ₹${quote.totalInterest.toLocaleString('en-IN')}\n• Total Amount: ₹${quote.totalAmount.toLocaleString('en-IN')}\n\nWant to change tenure or down payment?`;
      } catch (_) {
        // fallback below
      }
    }
    // Ask for missing piece minimally
    if (!session.data.emiBudget) {
      return 'Please share the approximate car price or budget (e.g., 10 lakhs) so I can compute EMI options.';
    }
    if (!session.data.emiTermMonths) {
      return 'For how long do you want the loan? (e.g., 5 years or 60 months)';
    }
  }

  // Global greeting/reset: hi/hello/hey/restart should reset flow and greet
  if (/^(hi|hello|hey|restart|reset)\b/i.test(input)) {
    session.state = null;
    session.data = {};
    setSession(userId, session);
    return 'Hello! Welcome to Sherpa Hyundai! How can I help you today?';
  }

  // Global compare intent: allow comparing even when in other states (e.g., after selecting a car)
  {
    const hasCompare = /\bcompare\b/.test(lower);
    // Also support patterns like "Car A vs Car B" or "Car A and Car B"
    const genericPairMatch = input.match(/([^,]+?)\s+(?:vs\.?|versus|and|&|with)\s+([^?]+)/i);
    if (hasCompare || genericPairMatch) {
      // Try to extract two cars or one 'other' car if a selection exists
      const withMatch = input.match(/compare\s+(?:it|this|car)?\s*with\s+([^?]+)/i);
      const biMatch = input.match(/compare\s+([^\s].*?)\s+(?:and|with|vs\.?|versus)\s+([^?]+)/i) || genericPairMatch;
      let car1 = null; let car2 = null;
      if (biMatch) {
        car1 = biMatch[1].trim();
        car2 = biMatch[2].trim();
      } else if (withMatch && session?.data?.selectedCar) {
        const sel = session.data.selectedCar;
        car1 = `${sel.brand || sel.make || ''} ${sel.model || ''} ${sel.variant || sel.trim || ''}`.trim();
        car2 = withMatch[1].trim();
      }
      if (car1 && car2) {
        try {
          const { compareCarsTool } = await import('./tools.js');
          const result = await compareCarsTool({ car1, car2 });
          if (result.ok) {
            // Attempt secondary lookup if one side missing
            if (!result.car1 || !result.car2) {
              try {
                const missing = !result.car1 ? car1 : car2;
                const tokens = missing.split(/\s+/);
                const brandGuess = tokens[0];
                const modelGuess = tokens.slice(1).join(' ');
                const { getCarDetailsTool } = await import('./tools.js');
                const alt = await getCarDetailsTool({ make: brandGuess, model: modelGuess || undefined });
                if (alt.ok && alt.cars && alt.cars.length > 0) {
                  if (!result.car1) result.car1 = alt.cars[0]; else result.car2 = alt.cars[0];
                }
              } catch (_) {}
            }
            const c1 = result.car1; const c2 = result.car2;
            const line = (c) => c ? `${c.brand || c.make} ${c.model}${c.variant ? ' ' + c.variant : ''} • ₹${(c.price||0).toLocaleString('en-IN')} • ${c.fuel_type || c.fuel || 'N/A'} • ${(c.mileage||0).toLocaleString('en-IN')} km` : 'N/A';
            return [
              `Here is a quick comparison:`,
              `• ${line(c1)}`,
              `• ${line(c2)}`,
              `\nWhich one would you like to proceed with?`
            ].join('\n');
          }
        } catch (_) {}
      }
    }
  }

  // Features/specifications intent
  if (/\b(feature|features|spec|specs|specification|specifications)\b/.test(lower)) {
    // 1) If a car is already selected in session, show its details
    const sel = session?.data?.selectedCar;
    if (sel) {
      const priceStr = sel.price ? `₹${sel.price.toLocaleString('en-IN')}` : 'Price: N/A';
      const powerStr = sel.power_bhp ? `${sel.power_bhp} BHP` : 'N/A';
      const engineStr = sel.engine_cc ? `${sel.engine_cc} cc` : 'N/A';
      const seatsStr = sel.seats ? `${sel.seats}` : 'N/A';
      return `Here are the key features of ${sel.brand || sel.make} ${sel.model} ${sel.variant || sel.trim || ''}:

• Year: ${sel.year || 'N/A'}
• Fuel: ${sel.fuel_type || sel.fuel || 'N/A'}
• Transmission: ${sel.transmission || 'N/A'}
• Mileage: ${(sel.mileage || 0).toLocaleString('en-IN')} km
• Color: ${sel.color || 'N/A'}
• Engine: ${engineStr}
• Power: ${powerStr}
• Seats: ${seatsStr}
• Price: ${priceStr}

Would you like to book a test drive or see financing options?`;
    }

    // 2) Try to extract a car name from the message (e.g., "features of Maruti Alto LXi")
    const ofMatch = input.match(/features?\s+of\s+(.+)/i) || input.match(/specs?\s+of\s+(.+)/i);
    const queryName = ofMatch ? ofMatch[1].trim() : '';

    // 2a) If vehicles are in session, try to match against them
    if (queryName && Array.isArray(session?.data?.vehicles) && session.data.vehicles.length > 0) {
      const found = session.data.vehicles.find(v => {
        const name = `${v.brand || v.make} ${v.model} ${v.variant || v.trim || ''}`.toLowerCase();
        return name.includes(queryName.toLowerCase());
      });
      if (found) {
        const priceStr = found.price ? `₹${found.price.toLocaleString('en-IN')}` : 'Price: N/A';
        const powerStr = found.power_bhp ? `${found.power_bhp} BHP` : 'N/A';
        const engineStr = found.engine_cc ? `${found.engine_cc} cc` : 'N/A';
        const seatsStr = found.seats ? `${found.seats}` : 'N/A';
        return `Here are the key features of ${found.brand || found.make} ${found.model} ${found.variant || found.trim || ''}:

• Year: ${found.year || 'N/A'}
• Fuel: ${found.fuel_type || found.fuel || 'N/A'}
• Transmission: ${found.transmission || 'N/A'}
• Mileage: ${(found.mileage || 0).toLocaleString('en-IN')} km
• Color: ${found.color || 'N/A'}
• Engine: ${engineStr}
• Power: ${powerStr}
• Seats: ${seatsStr}
• Price: ${priceStr}

Would you like to book a test drive or see financing options?`;
      }
    }

    // 3) Query DB for details if we have a name hint
    try {
      const { getCarDetailsTool } = await import('./tools.js');
      if (queryName) {
        const parts = queryName.split(/\s+/);
        const brandGuess = parts[0];
        const modelGuess = parts.slice(1).join(' ');
        const res = await getCarDetailsTool({ make: brandGuess, model: modelGuess || undefined });
        if (res.ok && res.cars && res.cars.length > 0) {
          const car = res.cars[0];
          const priceStr = car.price ? `₹${car.price.toLocaleString('en-IN')}` : 'Price: N/A';
          const powerStr = car.power_bhp ? `${car.power_bhp} BHP` : 'N/A';
          const engineStr = car.engine_cc ? `${car.engine_cc} cc` : 'N/A';
          const seatsStr = car.seats ? `${car.seats}` : 'N/A';
          return `Here are the key features of ${car.make} ${car.model} ${car.trim || ''}:

• Year: ${car.year || 'N/A'}
• Fuel: ${car.fuel || 'N/A'}
• Transmission: ${car.transmission || 'N/A'}
• Mileage: ${(car.mileage || 0).toLocaleString('en-IN')} km
• Color: ${car.color || 'N/A'}
• Engine: ${engineStr}
• Power: ${powerStr}
• Seats: ${seatsStr}
• Price: ${priceStr}

Would you like to book a test drive or see financing options?`;
        }
      }
    } catch (_) {}

    return 'Could you please specify the car model for which you want features? For example: "features of Hyundai i20"';
  }

  // Simple Hinglish used-car entry
  if (/(second hand|used car|pre[-\s]?owned)/i.test(input)) {
      session.state = 'browse_budget';
      setSession(userId, session);
      return "Great — what budget are you comfortable with (maximum)? You can say '6 lakhs', 'under 8 lakhs', or share a number like 800000.";
  }

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
  
  // Deterministic compare flow: "compare X and Y"
  const compareMatch = /\bcompare\b\s+([\w\s-]+)\s+and\s+([\w\s-]+)/i.exec(input);
  if (!session.state && compareMatch) {
    const car1 = compareMatch[1].trim();
    const car2 = compareMatch[2].trim();
    try {
      const { compareCarsTool } = await import('./tools.js');
      const result = await compareCarsTool({ car1, car2 });
      if (!result.ok) return `I couldn't find those in the inventory. Could you check the names?`;
      const c1 = result.car1; const c2 = result.car2;
      const line = (c) => c ? `${c.make} ${c.model} • ₹${(c.price||0).toLocaleString('en-IN')} • ${c.fuel||'N/A'} • ${c.mileage||'N/A'} km` : 'N/A';
      return `Here's a quick comparison:\n\n• ${line(c1)}\n• ${line(c2)}\n\nAnything specific you'd like me to compare (price, mileage, features)?`;
    } catch (_) {
      // fallthrough to Gemini
    }
  }

  // Entry commands
  if (['3', 'contact', 'contact our team', 'contact us', 'team'].includes(lower)) {
    session.state = 'contact_menu';
    setSession(userId, session);
    return contactMenu();
  }
  if (['4', 'about', 'about us'].includes(lower) || lower.includes('about')) {
    session.state = 'about_menu';
    setSession(userId, session);
    return aboutMenu();
  }
  
  // Service booking entry
  if (['book service', 'service booking', 'schedule service', 'book a service', 'service'].includes(lower) || 
      lower.includes('book service') || lower.includes('service booking') || lower.includes('schedule service') ||
      lower.includes('book a service')) {
    session.state = 'service_booking';
    session.data = {};
    setSession(userId, session);
    return `Great! I'll help you book a service for your vehicle. Please provide the following details:\n\n**Vehicle Details:**\n• Make: (e.g., Hyundai, Maruti, Honda)\n• Model: (e.g., i20, Swift, City)\n• Year: (e.g., 2020, 2021)\n• Registration Number: (e.g., KA01AB1234)\n\n**Service Type:**\n• Regular Service\n• Major Service\n• Accident Repair\n• Insurance Claim\n• Other (please specify)\n\nPlease share all details in one message.`;
  }

  // Lightweight intent capture for browse: normalize budget/type/brand from any phrase
  const extractBudget = () => {
    const lakhs = input.match(/(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks)/i);
    const below = /(under|below|upto|up to|less than)\s+(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks)/i.exec(lower);
    const numeric = input.replace(/[,₹\s]/g, '').match(/(\d{5,12})/);
    if (lakhs) return Math.round(parseFloat(lakhs[1]) * 100000);
    if (below) return Math.round(parseFloat(below[2]) * 100000);
    if (numeric) return Number(numeric[1]);
    return null;
  };
  const extractType = () => {
    const m = /(hatchback|sedan|suv|mpv)/i.exec(lower);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : undefined;
  };

  // Only handle simple browse requests, not complex queries
  if (!session.state && /^(browse|used cars|show cars|i want to buy|looking for a car)$/i.test(lower.trim())) {
    session.data = session.data || {};
    if (!session.data.maxPrice) {
      const b = extractBudget();
      if (b) session.data.maxPrice = b; session.data.minPrice = 0;
    }
    if (!session.data.type) {
      const t = extractType();
      if (t) session.data.type = t;
    }
    if (!session.data.make) {
      try {
        const { listMakesTool } = await import('./tools.js');
        const { makes = [] } = await listMakesTool();
        const found = makes.find(m => lower.includes(String(m).toLowerCase()));
        if (found) session.data.make = found;
      } catch (_) {}
    }
    setSession(userId, session);

    // Ask only the missing piece, in order: budget -> type -> brand
    if (!session.data.maxPrice) {
      session.state = 'browse_budget'; setSession(userId, session);
      return "What's your budget (maximum)? You can type '12 lakhs' or a number like 1200000.";
    }
    if (!session.data.type) {
      session.state = 'browse_pick_type'; setSession(userId, session);
      return 'Pick a body type: Hatchback | Sedan | SUV | MPV';
    }
    if (!session.data.make) {
      session.state = 'browse_pick_make'; setSession(userId, session);
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
    const { results } = await searchInventoryTool({ make: session.data.make, type: session.data.type, maxPrice: session.data.maxPrice, minPrice: session.data.minPrice });
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
  if (!session.state && /\b(hatchback|sedan|suv|mpv)s?\b/i.test(lower)) {
    const m = /(hatchback|sedan|suv|mpv)/i.exec(lower);
    const type = m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : undefined;
    session.data = { ...(session.data || {}), type };
    session.state = 'browse_budget'; setSession(userId, session);
    return "Great! What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.";
  }

  // Only handle simple brand mentions for browse flow, not complex queries
  if (!session.state && /^(i want|looking for|show me|find me).*car/i.test(lower.trim())) {
    try {
      const { listMakesTool } = await import('./tools.js');
      const { makes = [] } = await listMakesTool();
      const found = makes.find(m => lower.includes(String(m).toLowerCase()));
      if (found) {
        session.data = { ...(session.data || {}), make: found };
        session.state = 'browse_budget'; setSession(userId, session);
        return `Great — ${found} it is. What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.`;
      }
    } catch (_) {}
  }

  // Contact flow
  if (session.state === 'contact_menu') {
    if (lower.startsWith('1') || lower.includes('call us now')) {
      session.state = null; setSession(userId, session);
      return contactCallNumbers();
    }
    if (lower.startsWith('2') || lower.includes('request a callback')) {
      session.state = 'contact_callback_time'; setSession(userId, session);
      return callbackTimeMenu();
    }
    if (lower.startsWith('3') || lower.includes('visit our showroom')) {
      session.state = null; setSession(userId, session);
      return showroomLocations();
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

  // About flow — allow escape when user expresses other intents
  if (session.state === 'about_menu') {
    // If user expresses browse/search/test drive/valuation/compare intents, exit About
    const escapeIntent = extractIntent(input);
    if (escapeIntent && escapeIntent !== 'unknown' && escapeIntent !== 'about') {
      session.state = null; setSession(userId, session);
      // Fall through to main intent handling
    } else {
    if (lower.startsWith('1') || lower.includes('our company story') || lower.includes('about_story')) return aboutStory();
    if (lower.startsWith('2') || lower.includes('why choose us') || lower.includes('about_why')) return aboutWhyUs();
    if (lower.startsWith('3') || lower.includes('our locations') || lower.includes('about_locations')) return showroomLocations();
    if (lower.startsWith('4') || lower.includes('our services') || lower.includes('about_services')) return aboutServices();
    if (lower.startsWith('5') || lower.includes('achievements') || lower.includes('about_awards')) return aboutAwards();
    return aboutMenu();
    }
  }

  // Browse Used Cars entry — always ask budget first
  if (['browse used cars', 'browse cars', 'used cars', '2'].includes(lower)) {
    session.state = 'browse_budget'; session.data = session.data || {}; setSession(userId, session);
    return "Great! What's your budget (maximum)?\nYou can type values like '12 lakhs', 'below 20 lakhs', or a number like 1200000.";
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

  // Parse budget first, then proceed to filters
  if (session.state === 'browse_budget') {
    const lakhs = input.match(/(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks)/i);
    const below = /(under|below|upto|up to|less than)\s+(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks)/i.exec(lower);
    const above = /(above|over|more than|greater than)\s+(\d+[\.]?\d*)\s*(lakh|lakhs|lak|laks)/i.exec(lower);
    const numeric = input.replace(/[,₹\s]/g, '').match(/(\d{5,12})/);
    let maxVal = null;
    let minVal = null;
      
      if (lakhs) maxVal = Math.round(parseFloat(lakhs[1]) * 100000);
      else if (below) maxVal = Math.round(parseFloat(below[2]) * 100000);
      else if (above) minVal = Math.round(parseFloat(above[2]) * 100000);
      else if (numeric) maxVal = Number(numeric[1]);

    if (!maxVal && !minVal) {
      return "Please share a budget like '12 lakhs', 'below 20 lakhs', 'above 15 lakhs', or a number (e.g., 1200000).";
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
        return `Got it. Budget ${budgetText}\nSelect a brand (${session.data.type}): ${makes.slice(0,30).join(' | ')}`;
      } catch (_) {
        const budgetText = maxVal ? `up to ₹${maxVal.toLocaleString('en-IN')}` : `above ₹${minVal.toLocaleString('en-IN')}`;
        return `Got it. Budget ${budgetText}\nPlease type a brand (make), e.g., Toyota`;
      }
    }
    session.state = 'browse_pick_type'; setSession(userId, session);
    try {
      const { listTypesTool } = await import('./tools.js');
      const { types = [] } = await listTypesTool();
      const typeList = types.length > 0 ? types.join(' | ') : 'Hatchback | Sedan | SUV | MPV';
      return `Got it. Budget up to ₹${maxVal.toLocaleString('en-IN')}.\nPick a body type: ${typeList}`;
    } catch (_) {
      return `Got it. Budget up to ₹${maxVal.toLocaleString('en-IN')}.\nPick a body type: Hatchback | Sedan | SUV | MPV`;
    }
  }

  // Handle type selection
  if (session.state === 'browse_pick_type') {
    const type = extractType();
    if (!type) {
      try {
        const { listTypesTool } = await import('./tools.js');
        const { types = [] } = await listTypesTool();
        const typeList = types.length > 0 ? types.join(' | ') : 'Hatchback | Sedan | SUV | MPV';
        return `Please pick a body type: ${typeList}`;
      } catch (_) {
        return 'Please pick a body type: Hatchback | Sedan | SUV | MPV';
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
      setSession(userId, session);
      // Use enhanced formatting from tools
      const { formatMultipleCars } = await import('./tools.js');
      const enhancedFormat = formatMultipleCars(session.data.vehicles);
      return enhancedFormat;
    }
    // Else ask for brand selection
    session.state = 'browse_pick_make';
    setSession(userId, session);
    try {
      const { listMakesTool } = await import('./tools.js');
      const { makes = [] } = await listMakesTool();
      return `Great! ${type} it is. Select a brand: ${makes.slice(0,30).join(' | ')}`;
    } catch (_) {
      return `Great! ${type} it is. Please type a brand (make), e.g., Toyota`;
    }
  }

  // Handle make selection
  if (session.state === 'browse_pick_make') {
    try {
      const { listMakesTool } = await import('./tools.js');
      const { makes = [] } = await listMakesTool();
      const found = makes.find(m => lower.includes(String(m).toLowerCase()));
        if (!found) {
        return `Please select a valid brand: ${makes.slice(0,30).join(' | ')}`;
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
      setSession(userId, session);
      // Use enhanced formatting from tools
      const { formatMultipleCars } = await import('./tools.js');
      const enhancedFormat = formatMultipleCars(session.data.vehicles);
      return enhancedFormat;
    } catch (_) {
      return 'Please type a brand (make), e.g., Toyota';
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
    
    
    // Handle "show more" request
    if (lower.includes('show more') || lower.includes('more cars')) {
      const { formatMultipleCars } = await import('./tools.js');
      return formatMultipleCars(vehicles);
    }
    
    let chosen = null;
    
    // Method 1: Direct ID selection (pick_vehicle:ID)
    if (lower.startsWith('pick_vehicle:') || lower.includes('select:')) {
      const id = input.split(':')[1];
      chosen = vehicles.find(v => String(v.id) === String(id));
    }
    
    // Method 2: Car selection (car1, car2, car3, etc.)
    else if (lower.startsWith('car') && /^\d+$/.test(input.trim().substring(3))) {
      const index = parseInt(input.trim().substring(3)) - 1;
      if (index >= 0 && index < vehicles.length) {
        chosen = vehicles[index];
      } else {
        return `Please select a valid car (car1-car${vehicles.length}). Type car1, car2, car3, etc. or "show more" to see additional cars`;
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
    if (lower.includes('yes') || lower.includes('y') || lower.includes('book') || lower.includes('test drive')) {
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
      return `Thanks ${name}! Now please provide your **phone number** and confirm if you have a **valid driving license**.\n\nFormat: Phone: [your number], DL: Yes/No`;
    } else {
      return 'Please provide your full name. Format: Name: [Your full name]';
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
      
      return `Perfect! Phone: ${phone}, DL: ${hasDL ? 'Yes' : 'No'}\n\nNow please choose your preferred **test drive location**:\n\n1. **Main Showroom** (MG Road)\n2. **Banashankari Branch**\n3. **Whitefield Branch**\n\nType the number (1, 2, or 3) or location name.`;
    } else {
      return 'Please provide both phone number and DL status. Format: Phone: [your number], DL: Yes/No';
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
      return 'Please select a location. Type 1, 2, or 3, or mention the location name.';
    }
    
    // Store under a consistent key used later when scheduling/notifications
    session.data.testLocation = location;
    session.state = 'testdrive_contact';
    setSession(userId, session);
    
    return `Excellent! Location selected: **${location}**\n\nNow please provide your contact details:\n• Your Name:\n• Phone Number:\n• Email (optional):\n\nPlease share all details in one message.`;
  }

  // Test Drive Booking entry
  // Start test drive flow on any mention of 'test drive'
  if (lower.includes('test drive')) {
    // Try extract car name right away
    const carMatch = input.match(/test drive\s+(?:the\s+)?(.+)/i);
    if (carMatch && carMatch[1] && carMatch[1].length > 2) {
      const carNameRaw = carMatch[1].trim();
      const { brand, model } = splitBrandModel(carNameRaw);
      try {
        const { searchInventoryTool } = await import('./tools.js');
        let res;
        if (brand) {
          res = await searchInventoryTool({ brand, model });
          if ((!res.results || res.results.length === 0) && model.split(' ').length > 1) {
            // Try first token as model if over-specified
            const first = model.split(' ')[0];
            res = await searchInventoryTool({ brand, model: first });
          }
        } else {
          res = await searchInventoryTool({ model });
        }
        if (res.results && res.results.length > 0) {
          session.data = session.data || {};
          session.data.selectedCar = res.results[0];
          session.data.carName = `${brand ? brand + ' ' : ''}${model}`.trim();
          session.state = 'testdrive_date';
    setSession(userId, session);
          const today = new Date();
          const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
          return `Great! Date options for test drive:\n\n• Today (${today.toLocaleDateString('en-IN')})\n• Tomorrow (${tomorrow.toLocaleDateString('en-IN')})\n• Day after tomorrow (${dayAfter.toLocaleDateString('en-IN')})\n\nYou can also say "this weekend".`;
        }
      } catch (_) {}
    }
    session.state = 'testdrive_car'; session.data = {}; setSession(userId, session);
    return 'Great! I\'ll help you book a test drive. Which car are you interested in? Please mention the car name (e.g., "Tata Nexon", "Honda City", "Hyundai Creta").';
  }

  // Test Drive Management entries
  if (['my test drive', 'check my test drive', 'test drive status', 'test drive booking'].includes(lower) || lower.includes('my test drive')) {
    session.state = 'testdrive_check'; session.data = {}; setSession(userId, session);
    return 'I can help you check your test drive booking. Please provide your phone number or booking ID.';
  }

  if (['cancel test drive', 'cancel my test drive', 'cancel booking'].includes(lower) || lower.includes('cancel test drive')) {
    session.state = 'testdrive_cancel'; session.data = {}; setSession(userId, session);
    return 'I can help you cancel your test drive booking. Please provide your phone number or booking ID.';
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

  // Car Valuation entry
  if (['get car valuation', 'valuation', 'car valuation'].includes(lower)) {
    session.state = 'valuation_collect'; session.data = {}; setSession(userId, session);
    return 'To estimate your car value, please share:\nMake: \nModel: \nYear: \nKilometers: \nCondition (excellent/good/fair): \nCity:';
  }

  // Test Drive Booking Flow
  if (session.state === 'testdrive_car') {
    // Extract car name from input
    const carMatch = input.match(/(?:for|of|the)\s+([^,]+)/i) || input.match(/([A-Za-z\s]+(?:nexon|creta|city|verna|i20|swift|baleno|fortuner|innova|seltos|venue|xuv|scorpio|tiago|jazz|elevate|virtus|kushaq))/i);
    const carName = carMatch ? carMatch[1].trim() : input.trim();
    
    if (!carName || carName.length < 3) {
      return 'Please specify the car name clearly. Examples: "Tata Nexon", "Honda City", "Hyundai Creta"';
    }
    
    // Validate car exists in inventory (try brand+model split first)
    try {
      const { searchInventoryTool } = await import('./tools.js');
      const { brand, model } = splitBrandModel(carName);
      let results;
      if (brand) {
        ({ results } = await searchInventoryTool({ brand, model }));
        if ((!results || results.length === 0) && model.split(' ').length > 1) {
          const first = model.split(' ')[0];
          ({ results } = await searchInventoryTool({ brand, model: first }));
        }
        if ((!results || results.length === 0)) {
          ({ results } = await searchInventoryTool({ model }));
        }
      } else {
        ({ results } = await searchInventoryTool({ model: carName }));
      }
      
      if (!results || results.length === 0) {
        return `I couldn't find "${carName}" in our current inventory. Please check the car name or browse our available cars first.`;
      }
      
      // Store the first matching car for test drive
      session.data.carName = carName;
      session.data.selectedCar = results[0];
      session.state = 'testdrive_date';
      setSession(userId, session);
      
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      
      const carInfo = results[0];
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
    } else if (lower.includes('weekend')) {
      // Pick upcoming Saturday
      const day = today.getDay(); // 0=Sun ... 6=Sat
      const daysUntilSat = (6 - day + 7) % 7 || 7; // next Saturday, never today
      selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilSat);
    } else if (/(this\s+)?saturday/.test(lower)) {
      const day = today.getDay();
      const offset = (6 - day + 7) % 7 || 7;
      selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    } else if (/(this\s+)?sunday/.test(lower)) {
      const day = today.getDay();
      const offset = (0 - day + 7) % 7 || 7; // next Sunday
      selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
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
    // Flexible parsing for inputs like "12pm", "11 am", "noon", etc.
    const noonLike = /\bnoon\b/.test(lower) || /\b12\s*pm\b/.test(lower) || /\b12pm\b/.test(lower);
    if (noonLike) {
      selectedTime = timeSlots['11:00'];
    } else {
      const timeMatch = input.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        const mer = (timeMatch[3] || '').toLowerCase();
        if (mer === 'pm' && h < 12) h += 12;
        if (mer === 'am' && h === 12) h = 0;
        // Map hour to available slot
        if (h === 9) selectedTime = timeSlots['9:00'];
        else if (h === 10) selectedTime = timeSlots['10:00'];
        else if (h === 11) selectedTime = timeSlots['11:00'];
        else if (h === 12) selectedTime = timeSlots['11:00'];
        else if (h === 13) selectedTime = timeSlots['2:00'];
        else if (h === 14) selectedTime = timeSlots['2:00'];
        else if (h === 15) selectedTime = timeSlots['3:00'];
        else if (h === 16) selectedTime = timeSlots['4:00'];
      }
    }
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

  return null;
}



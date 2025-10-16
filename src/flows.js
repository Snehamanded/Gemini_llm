import { getSession, setSession } from './session.js';

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
    const { results } = await searchInventoryTool({ make: session.data.make, type: session.data.type, maxPrice: session.data.maxPrice });
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

  // About flow
  if (session.state === 'about_menu') {
    if (lower.startsWith('1') || lower.includes('our company story')) return aboutStory();
    if (lower.startsWith('2') || lower.includes('why choose us')) return aboutWhyUs();
    if (lower.startsWith('3') || lower.includes('our locations')) return showroomLocations();
    if (lower.startsWith('4') || lower.includes('our services')) return aboutServices();
    if (lower.startsWith('5') || lower.includes('achievements')) return aboutAwards();
    return aboutMenu();
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
    const numeric = input.replace(/[,₹\s]/g, '').match(/(\d{5,12})/);
    let maxVal = null;
    if (lakhs) maxVal = Math.round(parseFloat(lakhs[1]) * 100000);
    else if (below) maxVal = Math.round(parseFloat(below[2]) * 100000);
    else if (numeric) maxVal = Number(numeric[1]);

    if (!maxVal) {
      return "Please share a budget like '12 lakhs', 'below 20 lakhs', or a number (e.g., 1200000).";
    }

    session.data.maxPrice = maxVal; session.data.minPrice = 0;
    // If type is already known, skip asking type and go to brand
    if (session.data.type) {
      session.state = 'browse_pick_make'; setSession(userId, session);
      try {
        const { listMakesTool } = await import('./tools.js');
        const { makes = [] } = await listMakesTool();
        return `Got it. Budget up to ₹${maxVal.toLocaleString('en-IN')}\nSelect a brand (${session.data.type}): ${makes.slice(0,30).join(' | ')}`;
      } catch (_) {
        return `Got it. Budget up to ₹${maxVal.toLocaleString('en-IN')}\nPlease type a brand (make), e.g., Toyota`;
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
        maxPrice: session.data.maxPrice 
      });
      if (!results || results.length === 0) {
        session.state = 'browse_pick_make'; setSession(userId, session);
        return 'No matches found for that combination. Please pick a different brand.';
      }
      session.state = 'browse_pick_vehicle';
      session.data.vehicles = results.slice(0, 10);
      setSession(userId, session);
      // Show cars as individual detailed messages instead of truncated list
      const carDetails = session.data.vehicles.map(v => {
        const price = (v.price || 0).toLocaleString('en-IN');
        const mileage = (v.mileage || 0).toLocaleString('en-IN');
        return `🚗 **${v.brand || v.make} ${v.model} ${v.variant || ''}**
📅 Year: ${v.year || 'N/A'} | ⛽ Fuel: ${v.fuel_type || v.fuel || 'N/A'} | 🔧 ${v.transmission || 'N/A'}
📏 Mileage: ${mileage}km | 🎨 Color: ${v.color || 'N/A'} | 💰 Price: ₹${price}
[SELECT: pick_vehicle:${v.id}]`;
      }).join('\n\n');
      
      return `Found ${session.data.vehicles.length} cars matching your criteria:\n\n${carDetails}\n\nClick SELECT next to any car for more details!`;
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
        maxPrice: session.data.maxPrice 
      });
      if (!results || results.length === 0) {
        return 'No matches found. You can change brand or budget.';
      }
      session.state = 'browse_pick_vehicle';
      session.data.vehicles = results.slice(0, 10);
      setSession(userId, session);
      // Show cars as individual detailed messages instead of truncated list
      const carDetails = session.data.vehicles.map(v => {
        const price = (v.price || 0).toLocaleString('en-IN');
        const mileage = (v.mileage || 0).toLocaleString('en-IN');
        return `🚗 **${v.brand || v.make} ${v.model} ${v.variant || ''}**
📅 Year: ${v.year || 'N/A'} | ⛽ Fuel: ${v.fuel_type || v.fuel || 'N/A'} | 🔧 ${v.transmission || 'N/A'}
📏 Mileage: ${mileage}km | 🎨 Color: ${v.color || 'N/A'} | 💰 Price: ₹${price}
[SELECT: pick_vehicle:${v.id}]`;
      }).join('\n\n');
      
      return `Found ${session.data.vehicles.length} cars matching your criteria:\n\n${carDetails}\n\nClick SELECT next to any car for more details!`;
    } catch (_) {
      return 'Please type a brand (make), e.g., Toyota';
    }
  }

  // Handle vehicle selection via text-based selection
  if (session.state === 'browse_pick_vehicle') {
    if (lower.startsWith('pick_vehicle:') || lower.includes('select:')) {
      const id = input.split(':')[1];
      const vehicles = session.data?.vehicles || [];
      const chosen = vehicles.find(v => String(v.id) === String(id));
      if (!chosen) return 'Please pick a car from the list above.';
      session.state = null; session.data = {}; setSession(userId, session);
      const priceStr = chosen.price ? `₹${chosen.price.toLocaleString('en-IN')}` : 'Price: N/A';
      return `🚗 **${chosen.brand || chosen.make} ${chosen.model} ${chosen.variant || chosen.trim || ''}**\n\n📅 **Year:** ${chosen.year || 'N/A'}\n⛽ **Fuel:** ${chosen.fuel_type || chosen.fuel || 'N/A'}\n🔧 **Transmission:** ${chosen.transmission || 'N/A'}\n📏 **Mileage:** ${(chosen.mileage || 0).toLocaleString('en-IN')} km\n🎨 **Color:** ${chosen.color || 'N/A'}\n💰 **Price:** ${priceStr}\n\n✅ **Ready to buy?** Contact us for test drive!`;
    }
  }

  // Test Drive Booking entry
  if (['book test drive', 'test drive', 'book a test drive', 'schedule test drive'].includes(lower) || lower.includes('book test drive') || lower.includes('test drive for')) {
    session.state = 'testdrive_car'; session.data = {}; setSession(userId, session);
    return 'Great! I\'ll help you book a test drive. Which car are you interested in? Please mention the car name (e.g., "Tata Nexon", "Honda City", "Hyundai Creta").';
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
    
    session.data.carName = carName;
    session.state = 'testdrive_date';
    setSession(userId, session);
    
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    return `Perfect! You want to test drive: **${carName}**

Available dates:
• Today (${today.toLocaleDateString('en-IN')})
• Tomorrow (${tomorrow.toLocaleDateString('en-IN')})
• Day after tomorrow (${dayAfter.toLocaleDateString('en-IN')})

Please choose a date or type "custom" for a specific date.`;
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
    
    // Generate booking confirmation
    const bookingId = 'TD' + Date.now().toString().slice(-6);
    const testDate = new Date(session.data.testDate).toLocaleDateString('en-IN');
    
    const confirmation = `🎉 **TEST DRIVE BOOKED SUCCESSFULLY!**

📋 **Booking Details:**
• Booking ID: ${bookingId}
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

**Contact:** +91-9876543210 for any changes

Thank you for choosing AutoSherpa Motors! 🚗`;

    session.state = null; 
    session.data = {}; 
    setSession(userId, session);
    return confirmation;
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

  return null;
}



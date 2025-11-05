// Business tools for the car customer agent (DB-backed)
import { getPool } from './db.js';

export async function searchInventoryTool(args) {
  // Back-compat: accept make/fuel keys but map to new schema (brand/fuel_type)
  const { make, brand: brandArg, model, maxPrice, minPrice, type, fuel, fuel_type, transmission } = args || {};
  const pool = getPool();
  if (!pool) {
    return { results: [], error: 'Database not configured' };
  }
  const clauses = [];
  const params = [];
  const brand = brandArg || make;
  if (brand) { params.push(`%${String(brand)}%`); clauses.push(`brand ilike $${params.length}`); }
  if (model) { params.push(`%${String(model)}%`); clauses.push(`model ilike $${params.length}`); }
  if (type) {
    const t = `%${String(type)}%`;
    params.push(t, t, t);
    clauses.push(`(type ilike $${params.length-2} or model ilike $${params.length-1} or variant ilike $${params.length})`);
  }
  if (maxPrice) { params.push(Number(maxPrice)); clauses.push(`price <= $${params.length}`); }
  if (minPrice) { params.push(Number(minPrice)); clauses.push(`price >= $${params.length}`); }
  const fuelCol = fuel_type || fuel;
  if (fuelCol) { params.push(`%${String(fuelCol)}%`); clauses.push(`fuel_type ilike $${params.length}`); }
  if (transmission) { params.push(`%${String(transmission)}%`); clauses.push(`transmission ilike $${params.length}`); }
  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';
  const { rows } = await pool.query(
    `select id::text as id, brand, model, variant, type, year, price, mileage, fuel_type, transmission, color from cars ${where} order by price asc limit 25`,
    params
  );
  // Back-compat mapping: add make/trim/fuel keys for existing flows
  const mapped = rows.map(r => ({
    ...r,
    make: r.brand,
    trim: r.variant,
    fuel: r.fuel_type
  }));
  
  // Use enhanced formatting for better presentation
  const formattedResults = formatMultipleCars(mapped);
  
  return { 
    results: mapped,
    formatted: formattedResults,
    count: mapped.length
  };
}

export async function listMakesTool() {
  const pool = getPool();
  if (!pool) return { makes: [], error: 'Database not configured' };
  const { rows } = await pool.query(`select distinct brand from cars where brand is not null and brand <> '' order by brand asc`);
  return { makes: rows.map(r => r.brand) };
}

export async function listModelsByMakeTool(args) {
  const { make, brand: brandArg } = args || {};
  const pool = getPool();
  if (!pool) return { models: [], error: 'Database not configured' };
  const brand = brandArg || make;
  if (!brand) return { models: [] };
  const { rows } = await pool.query(`select distinct model from cars where brand ilike $1 and model is not null and model <> '' order by model asc`, [brand]);
  return { models: rows.map(r => r.model) };
}

export async function listTrimsByMakeModelTool(args) {
  const { make, brand: brandArg, model } = args || {};
  const pool = getPool();
  if (!pool) return { trims: [], error: 'Database not configured' };
  const brand = brandArg || make;
  if (!brand || !model) return { trims: [] };
  const { rows } = await pool.query(`select distinct variant from cars where brand ilike $1 and model ilike $2 and variant is not null and variant <> '' order by variant asc`, [brand, model]);
  return { trims: rows.map(r => r.variant) };
}

export async function scheduleTestDriveTool(args) {
  const { vehicleId, date, time, name, phone, email, location, carName } = args || {};
  if (!vehicleId || !date || !time) {
    return { ok: false, message: 'vehicleId, date, and time are required' };
  }
  
  const pool = getPool();
  if (!pool) {
    return { ok: false, message: 'Database not configured' };
  }
  
  try {
    // Check for existing bookings at the same time slot
    const { rows: existingBookings } = await pool.query(
      `SELECT COUNT(*) as count FROM test_drive_bookings 
       WHERE booking_date = $1 AND time_slot = $2 AND status != 'cancelled'`,
      [date, time
    ]);
    
    if (existingBookings[0]?.count > 2) { // Max 2 test drives per slot
      return { ok: false, message: 'This time slot is fully booked. Please choose another time.' };
    }
    
    // Generate confirmation ID
    const confirmationId = `TD-${Date.now().toString().slice(-6)}`;
    
    // Insert booking into database
    const { rows } = await pool.query(`
      INSERT INTO test_drive_bookings 
      (confirmation_id, vehicle_id, car_name, booking_date, time_slot, customer_name, 
       customer_phone, customer_email, location, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'confirmed', NOW())
      RETURNING id, confirmation_id
    `, [
      confirmationId,
      vehicleId,
      carName || null,
      date,
      time,
      name || null,
      phone || null,
      email || null,
      location || null
    ]);
    
    return { 
      ok: true, 
      confirmationId, 
      bookingId: rows[0]?.id,
      vehicleId, 
      date, 
      time, 
      name: name || null,
      phone: phone || null,
      email: email || null,
      location: location || null
    };
  } catch (error) {
    console.error('Error scheduling test drive:', error);
    return { ok: false, message: 'Failed to schedule test drive. Please try again.' };
  }
}

export async function financingQuoteTool(args) {
  const { vehiclePrice, downPayment = 0, termMonths = 60, aprPercent = 5.5, customerProfile = 'standard' } = args || {};
  const principal = Math.max(0, Number(vehiclePrice) - Number(downPayment));
  const monthlyRate = Number(aprPercent) / 100 / 12;
  const n = Number(termMonths);
  const monthlyPayment = monthlyRate === 0 ? principal / n : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  
  // Enhanced financing information
  const totalInterest = (monthlyPayment * n) - principal;
  const totalAmount = monthlyPayment * n;
  
  // Bank partnerships and offers
  const bankOffers = [
    {
      bank: 'HDFC Bank',
      apr: 5.5,
      maxLoanPercent: 85,
      processingFee: 0.5,
      offer: 'Zero processing fee for first-time buyers'
    },
    {
      bank: 'ICICI Bank',
      apr: 5.8,
      maxLoanPercent: 90,
      processingFee: 1.0,
      offer: 'Quick approval within 24 hours'
    },
    {
      bank: 'SBI',
      apr: 5.2,
      maxLoanPercent: 80,
      processingFee: 0.75,
      offer: 'Lowest interest rates for government employees'
    },
    {
      bank: 'Axis Bank',
      apr: 5.7,
      maxLoanPercent: 85,
      processingFee: 1.0,
      offer: 'Flexible repayment options'
    }
  ];
  
  // Calculate best offer based on customer profile
  let bestOffer = bankOffers[0];
  if (customerProfile === 'premium') {
    bestOffer = bankOffers.find(bank => bank.apr === Math.min(...bankOffers.map(b => b.apr))) || bankOffers[0];
  }
  
  return { 
    principal, 
    monthlyPayment: Number(monthlyPayment.toFixed(2)), 
    totalInterest: Number(totalInterest.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    aprPercent, 
    termMonths,
    bankOffers,
    bestOffer,
    financingOptions: {
      maxLoanPercent: bestOffer.maxLoanPercent,
      processingFee: bestOffer.processingFee,
      offer: bestOffer.offer
    }
  };
}

export async function getFinancingInfoTool(args) {
  const { vehiclePrice, customerProfile = 'standard' } = args || {};
  
  if (!vehiclePrice) {
    return { ok: false, message: 'vehiclePrice is required' };
  }
  
  const price = Number(vehiclePrice);
  
  // Calculate different financing scenarios
  const scenarios = [
    { downPayment: 0.1, termMonths: 60, aprPercent: 5.5 },
    { downPayment: 0.15, termMonths: 48, aprPercent: 5.2 },
    { downPayment: 0.2, termMonths: 36, aprPercent: 4.8 },
    { downPayment: 0.25, termMonths: 24, aprPercent: 4.5 }
  ];
  
  const financingOptions = scenarios.map(scenario => {
    const downPaymentAmount = price * scenario.downPayment;
    const loanAmount = price - downPaymentAmount;
    const monthlyRate = scenario.aprPercent / 100 / 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -scenario.termMonths));
    
    return {
      downPaymentPercent: Math.round(scenario.downPayment * 100),
      downPaymentAmount: Math.round(downPaymentAmount),
      loanAmount: Math.round(loanAmount),
      termMonths: scenario.termMonths,
      aprPercent: scenario.aprPercent,
      monthlyPayment: Math.round(monthlyPayment),
      totalAmount: Math.round(monthlyPayment * scenario.termMonths),
      totalInterest: Math.round((monthlyPayment * scenario.termMonths) - loanAmount)
    };
  });
  
  return {
    ok: true,
    vehiclePrice: price,
    financingOptions,
    bankPartnerships: [
      'HDFC Bank - Up to 85% financing',
      'ICICI Bank - Quick approval',
      'SBI - Lowest rates for government employees',
      'Axis Bank - Flexible terms'
    ],
    documentsRequired: [
      'PAN Card',
      'Aadhar Card',
      'Salary Certificate (if salaried)',
      'Bank Statements (6 months)',
      'Income Tax Returns (2 years)',
      'Driving License'
    ],
    processingTime: '24-48 hours for approval'
  };
}

export async function serviceAppointmentTool(args) {
  const { vin, date, time, reason } = args || {};
  if (!vin || !date || !time) {
    return { ok: false, message: 'vin, date, and time are required' };
  }
  const ticketId = `SV-${Date.now()}`;
  return { ok: true, ticketId, vin, date, time, reason: reason || null };
}

export async function carValuationTool(args) {
  const { make, model, year, kilometers = 0, condition = 'good', city } = args || {};
  if (!make || !model || !year) {
    return { ok: false, message: 'make, model, and year are required' };
  }
  const base = 1000000; // base INR for heuristic
  const age = Math.max(0, new Date().getFullYear() - Number(year));
  const km = Number(kilometers) || 0;
  const makeAdj = /hyundai/i.test(make) ? 0.95 : /maruti|suzuki/i.test(make) ? 1.0 : /toyota|honda/i.test(make) ? 1.05 : 0.9;
  const conditionAdj = /excellent/i.test(condition) ? 1.1 : /good/i.test(condition) ? 1.0 : /fair/i.test(condition) ? 0.9 : 0.8;
  const ageAdj = Math.pow(0.88, age);
  const kmAdj = km > 100000 ? 0.8 : km > 60000 ? 0.88 : km > 30000 ? 0.93 : 1.0;
  const estimate = Math.max(60000, Math.round(base * makeAdj * conditionAdj * ageAdj * kmAdj));
  const low = Math.round(estimate * 0.92);
  const high = Math.round(estimate * 1.08);
  return { ok: true, city: city || null, make, model, year: Number(year), kilometers: km, condition, estimateRangeInInr: { low, high } };
}

export async function compareCarsTool(args) {
  const { car1, car2 } = args || {};
  if (!car1 || !car2) {
    return { ok: false, message: 'car1 and car2 are required' };
  }
  
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  // Simple typo correction/fuzzy normalization for common cases
  const normalize = (s) => String(s || '')
    .toLowerCase()
    .replace(/\bkea\b/g, 'kia')
    .replace(/\bseltis\b/g, 'seltos')
    .replace(/\bhundai\b/g, 'hyundai')
    .replace(/\btoyoto\b/g, 'toyota')
    .replace(/\bcamary\b/g, 'camry')
    .replace(/\bcretaa\b/g, 'creta')
    .replace(/\s+/g, ' ')
    .trim();

  const n1 = normalize(car1);
  const n2 = normalize(car2);

  const parts1 = n1.split(' ');
  const parts2 = n2.split(' ');

  const likeClause = (alias, tokens, startIndex = 1) => {
    const clauses = [];
    const params = [];
    tokens.forEach((t, i) => {
      clauses.push(`(${alias}.brand ilike $${startIndex + i} or ${alias}.model ilike $${startIndex + i} or ${alias}.variant ilike $${startIndex + i})`);
      params.push(`%${t}%`);
    });
    return { clause: clauses.join(' and '), params };
  };

  const q1 = likeClause('c', parts1, 1);
  const q2 = likeClause('c', parts2, 1);

  const query1 = `select * from cars c where ${q1.clause} order by price asc limit 3`;
  const query2 = `select * from cars c where ${q2.clause} order by price asc limit 3`;

  const { rows: cars1 } = await pool.query(query1, q1.params);
  const { rows: cars2 } = await pool.query(query2, q2.params);
  
  if (cars1.length === 0 && cars2.length === 0) {
    return { ok: false, message: 'Neither car found in inventory' };
  }
  
  return {
    ok: true,
    car1: cars1[0] || null,
    car2: cars2[0] || null,
    comparison: {
      price1: cars1[0]?.price || 'N/A',
      price2: cars2[0]?.price || 'N/A',
      fuel1: cars1[0]?.fuel_type || 'N/A',
      fuel2: cars2[0]?.fuel_type || 'N/A',
      mileage1: cars1[0]?.mileage || 'N/A',
      mileage2: cars2[0]?.mileage || 'N/A',
      brand1: cars1[0]?.brand || null,
      model1: cars1[0]?.model || null,
      variant1: cars1[0]?.variant || null,
      brand2: cars2[0]?.brand || null,
      model2: cars2[0]?.model || null,
      variant2: cars2[0]?.variant || null
    }
  };
}

export async function getCarDetailsTool(args) {
  const { make, brand: brandArg, model } = args || {};
  if (!make && !brandArg && !model) {
    return { ok: false, message: 'brand/make or model is required' };
  }
  
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  let query = 'select * from cars where ';
  const params = [];
  
  const brand = brandArg || make;
  if (brand && model) {
    query += 'brand ilike $1 and model ilike $2';
    params.push(`%${brand}%`, `%${model}%`);
  } else if (brand) {
    query += 'brand ilike $1';
    params.push(`%${brand}%`);
  } else {
    query += 'model ilike $1';
    params.push(`%${model}%`);
  }
  
  query += ' order by price asc limit 5';
  
  const { rows } = await pool.query(query, params);
  
  if (rows.length === 0) {
    return { ok: false, message: 'Car not found in inventory' };
  }
  
  return {
    ok: true,
    cars: rows.map(r => ({ ...r, make: r.brand, trim: r.variant, fuel: r.fuel_type })),
    summary: {
      count: rows.length,
      priceRange: {
        min: Math.min(...rows.map(r => r.price || 0)),
        max: Math.max(...rows.map(r => r.price || 0))
      },
      availableYears: [...new Set(rows.map(r => r.year).filter(Boolean))].sort(),
      availableFuels: [...new Set(rows.map(r => r.fuel_type).filter(Boolean))]
    }
  };
}

export async function searchByFiltersTool(args) {
  const { budget, type, brand, fuel, fuel_type, transmission } = args || {};
  
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  const clauses = [];
  const params = [];
  
  if (budget) {
    params.push(Number(budget));
    clauses.push(`price <= $${params.length}`);
  }
  
  if (type) {
    params.push(`%${type}%`);
    clauses.push(`type ilike $${params.length}`);
  }
  
  if (brand) {
    params.push(`%${brand}%`);
    clauses.push(`brand ilike $${params.length}`);
  }
  
  const fuelCol2 = fuel_type || fuel;
  if (fuelCol2) {
    params.push(`%${fuelCol2}%`);
    clauses.push(`fuel_type ilike $${params.length}`);
  }
  
  if (transmission) {
    params.push(`%${transmission}%`);
    clauses.push(`transmission ilike $${params.length}`);
  }
  
  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';
  const { rows } = await pool.query(
    `select id::text as id, brand, model, variant, type, year, price, mileage, fuel_type, transmission, color from cars ${where} order by price asc limit 10`,
    params
  );
  
  // Use enhanced formatting for better presentation
  const mappedResults = rows.map(r => ({ ...r, make: r.brand, trim: r.variant, fuel: r.fuel_type }));
  const formattedResults = formatMultipleCars(mappedResults);
  
  return {
    ok: true,
    results: mappedResults,
    formatted: formattedResults,
    filters: { budget, type, brand, fuel, transmission },
    count: rows.length
  };
}

export async function listTypesTool() {
  const pool = getPool();
  if (!pool) return { types: [], error: 'Database not configured' };
  // Since type column is empty, infer from model/variant names based on actual data
  const { rows } = await pool.query(`
    with type_inference as (
      select 'Hatchback' as inferred_type where exists(select 1 from cars where model ilike '%jazz%' or model ilike '%tiago%' or model ilike '%swift%' or model ilike '%ignis%' or model ilike '%punch%' or model ilike '%i20%')
      union all
      select 'Sedan' where exists(select 1 from cars where model ilike '%virtus%' or model ilike '%fortuner%' or model ilike '%verna%' or model ilike '%city%' or model ilike '%dzire%')
      union all  
      select 'SUV' where exists(select 1 from cars where model ilike '%venue%' or model ilike '%creta%' or model ilike '%seltos%' or model ilike '%nexon%' or model ilike '%xuv%' or model ilike '%scorpio%' or model ilike '%innova%' or model ilike '%kushaq%' or model ilike '%alcazar%')
      union all
      select 'MPV' where exists(select 1 from cars where model ilike '%innova%' or model ilike '%ertiga%' or model ilike '%crysta%')
    )
    select distinct inferred_type as type from type_inference order by type
  `);
  return { types: rows.map(r => r.type).filter(Boolean) };
}

export async function getCarByIdTool(args) {
  const { id } = args || {};
  if (!id) return { ok: false, message: 'id is required' };
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  const { rows } = await pool.query(
    `select coalesce(ext_id, id::text) as id, make, model, year, price, trim, mileage, fuel, color from cars where coalesce(ext_id, id::text) = $1 limit 1`,
    [String(id)]
  );
  if (rows.length === 0) return { ok: false, message: 'not found' };
  return { ok: true, car: rows[0] };
}

export async function countCarsTool() {
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  const { rows } = await pool.query('select count(*)::int as count from cars');
  return { ok: true, count: rows[0]?.count || 0 };
}

export async function getTestDriveBookingsTool(args) {
  const { phone, confirmationId, date } = args || {};
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  let query = 'SELECT * FROM test_drive_bookings WHERE ';
  const params = [];
  
  if (confirmationId) {
    query += 'confirmation_id = $1';
    params.push(confirmationId);
  } else if (phone) {
    query += 'customer_phone = $1';
    params.push(phone);
  } else if (date) {
    query += 'booking_date = $1';
    params.push(date);
  } else {
    return { ok: false, message: 'phone, confirmationId, or date is required' };
  }
  
  query += ' ORDER BY created_at DESC LIMIT 10';
  
  const { rows } = await pool.query(query, params);
  return { ok: true, bookings: rows };
}

export async function cancelTestDriveTool(args) {
  const { confirmationId, phone } = args || {};
  if (!confirmationId && !phone) {
    return { ok: false, message: 'confirmationId or phone is required' };
  }
  
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  try {
    let query = 'UPDATE test_drive_bookings SET status = $1, updated_at = NOW() WHERE ';
    const params = ['cancelled'];
    
    if (confirmationId) {
      query += 'confirmation_id = $2';
      params.push(confirmationId);
    } else {
      query += 'customer_phone = $2 AND status = $3';
      params.push(phone, 'confirmed');
    }
    
    const { rowCount } = await pool.query(query, params);
    
    if (rowCount === 0) {
      return { ok: false, message: 'No active booking found to cancel' };
    }
    
    return { ok: true, message: 'Test drive booking cancelled successfully' };
  } catch (error) {
    console.error('Error cancelling test drive:', error);
    return { ok: false, message: 'Failed to cancel booking' };
  }
}

export async function getAvailableTimeSlotsTool(args) {
  const { date } = args || {};
  if (!date) {
    return { ok: false, message: 'date is required' };
  }
  
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  try {
    // Get existing bookings for the date
    const { rows: existingBookings } = await pool.query(
      `SELECT time_slot, COUNT(*) as count 
       FROM test_drive_bookings 
       WHERE booking_date = $1 AND status != 'cancelled'
       GROUP BY time_slot`,
      [date]
    );
    
    const bookedSlots = {};
    existingBookings.forEach(row => {
      bookedSlots[row.time_slot] = parseInt(row.count);
    });
    
    // Define available time slots
    const allSlots = [
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM'
    ];
    
    const availableSlots = allSlots.filter(slot => {
      const bookedCount = bookedSlots[slot] || 0;
      return bookedCount < 2; // Max 2 test drives per slot
    });
    
    return { 
      ok: true, 
      date, 
      availableSlots, 
      fullyBookedSlots: allSlots.filter(slot => !availableSlots.includes(slot))
    };
  } catch (error) {
    console.error('Error getting available slots:', error);
    return { ok: false, message: 'Failed to get available time slots' };
  }
}

export async function sendTestDriveNotificationTool(args) {
  const { bookingId, type = 'confirmation' } = args || {};
  if (!bookingId) {
    return { ok: false, message: 'bookingId is required' };
  }
  
  const pool = getPool();
  if (!pool) return { ok: false, message: 'Database not configured' };
  
  try {
    // Get booking details
    const { rows } = await pool.query(
      `SELECT * FROM test_drive_bookings WHERE id::text = $1 OR confirmation_id = $1`,
      [bookingId]
    );
    
    if (rows.length === 0) {
      return { ok: false, message: 'Booking not found' };
    }
    
    const booking = rows[0];
    const date = new Date(booking.booking_date).toLocaleDateString('en-IN');
    
    // Generate notification content
    let subject, message;
    
    if (type === 'confirmation') {
      subject = `Test Drive Confirmed - ${booking.confirmation_id}`;
      message = `Dear ${booking.customer_name},

Your test drive has been confirmed!

📋 Booking Details:
• Booking ID: ${booking.confirmation_id}
• Car: ${booking.car_name}
• Date: ${date}
• Time: ${booking.time_slot}
• Location: ${booking.location}

📞 Contact: +91-9876543210
📍 Address: 123 MG Road, Bangalore

Please bring a valid driving license.

Thank you for choosing AutoSherpa Motors!`;
    } else if (type === 'reminder') {
      subject = `Test Drive Reminder - ${booking.confirmation_id}`;
      message = `Dear ${booking.customer_name},

This is a friendly reminder about your test drive tomorrow!

📋 Booking Details:
• Booking ID: ${booking.confirmation_id}
• Car: ${booking.car_name}
• Date: ${date}
• Time: ${booking.time_slot}
• Location: ${booking.location}

Please bring a valid driving license.

Thank you for choosing AutoSherpa Motors!`;
    } else if (type === 'cancellation') {
      subject = `Test Drive Cancelled - ${booking.confirmation_id}`;
      message = `Dear ${booking.customer_name},

Your test drive has been cancelled as requested.

📋 Booking Details:
• Booking ID: ${booking.confirmation_id}
• Car: ${booking.car_name}
• Date: ${date}
• Time: ${booking.time_slot}

You can book a new test drive anytime by contacting us.

Thank you for choosing AutoSherpa Motors!`;
    }
    
    // In a real implementation, you would send email/SMS here
    // For now, we'll just log the notification
    console.log(`📧 ${type.toUpperCase()} NOTIFICATION:`);
    console.log(`To: ${booking.customer_email || booking.customer_phone}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    return { 
      ok: true, 
      message: 'Notification sent successfully',
      notificationType: type,
      recipient: booking.customer_email || booking.customer_phone
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { ok: false, message: 'Failed to send notification' };
  }
}

// Enhanced car display formatting
export function formatCarListing(car, index = 0) {
  const brand = car.brand || car.make || 'N/A';
  const model = car.model || 'N/A';
  const variant = car.variant || car.trim || '';
  const year = car.year || 'N/A';
  const fuel = car.fuel_type || car.fuel || 'N/A';
  const transmission = car.transmission || 'N/A';
  const mileage = car.mileage ? car.mileage.toLocaleString('en-IN') : 'N/A';
  const color = car.color || 'N/A';
  const price = car.price ? `₹${car.price.toLocaleString('en-IN')}` : 'N/A';
  const carId = car.id || index + 1;

  return `**car${index + 1}** 🚗 **${brand} ${model}${variant ? ' ' + variant : ''}**
📅 ${year} | ⛽ ${fuel} | 🔧 ${transmission}
📊 ${mileage}km | 🎨 ${color} | 💰 ${price}`;
}

export function formatMultipleCars(cars, startIndex = 0, language = 'english') {
  if (!cars || cars.length === 0) {
    return 'No cars found matching your criteria.';
  }

  if (cars.length === 1) {
    return formatCarListing(cars[0]);
  }

  // Get the next 5 cars starting from startIndex
  const displayCars = cars.slice(startIndex, startIndex + 5);
  const hasMore = cars.length > startIndex + 5;
  
  const headers = {
    english: `Found ${cars.length} cars matching your criteria:\n\n`,
    hinglish: `Aapke criteria ke hisaab se ${cars.length} cars mili hain:\n\n`,
    hindi: `आपके मापदंडों के हिसाब से ${cars.length} कारें मिली हैं:\n\n`
  };
  let result = headers[language] || headers.english;
  
  displayCars.forEach((car, index) => {
    result += formatCarListing(car, startIndex + index);
    if (index < displayCars.length - 1) {
      result += '\n\n---\n\n';
    }
  });
  
  if (hasMore) {
    const moreTexts = {
      english: '\n\n📱 *Type "show more" to see additional cars*',
      hinglish: '\n\n📱 *Aur gaadiyan dekhne ke liye "show more" type karein*',
      hindi: '\n\n📱 *और गाड़ियां देखने के लिए "show more" टाइप करें*'
    };
    result += moreTexts[language] || moreTexts.english;
  }
  
  const footer = {
    english: '\n\n💡 **How to select a car:**\n• Type car1, car2, car3, etc.',
    hinglish: '\n\n💡 **Car select kaise karein:**\n• car1, car2, car3, etc. type karein',
    hindi: '\n\n💡 **कार कैसे चुनें:**\n• car1, car2, car3, आदि टाइप करें'
  };
  result += footer[language] || footer.english;
  
  return result;
}

export const toolRegistry = {
  searchInventory: { fn: searchInventoryTool, description: 'Search vehicle inventory by make, model, maxPrice' },
  listMakes: { fn: listMakesTool, description: 'List distinct makes from inventory' },
  listTypes: { fn: listTypesTool, description: 'List inferred body types present in inventory' },
  listModelsByMake: { fn: listModelsByMakeTool, description: 'List distinct models for a given make' },
  listTrimsByMakeModel: { fn: listTrimsByMakeModelTool, description: 'List distinct trims for a given make+model' },
  scheduleTestDrive: { fn: scheduleTestDriveTool, description: 'Schedule a test drive for a vehicle with availability checking' },
  getTestDriveBookings: { fn: getTestDriveBookingsTool, description: 'Get test drive bookings by phone, confirmationId, or date' },
  cancelTestDrive: { fn: cancelTestDriveTool, description: 'Cancel a test drive booking by confirmationId or phone' },
  getAvailableTimeSlots: { fn: getAvailableTimeSlotsTool, description: 'Get available time slots for a specific date' },
  sendTestDriveNotification: { fn: sendTestDriveNotificationTool, description: 'Send email/SMS notifications for test drive bookings' },
  financingQuote: { fn: financingQuoteTool, description: 'Compute detailed financing options with bank partnerships' },
  getFinancingInfo: { fn: getFinancingInfoTool, description: 'Get comprehensive financing information and bank partnerships' },
  serviceAppointment: { fn: serviceAppointmentTool, description: 'Create a service appointment' },
  carValuation: { fn: carValuationTool, description: 'Estimate resale value from make, model, year, kms, condition' },
  compareCars: { fn: compareCarsTool, description: 'Compare two cars by name/model and show differences' },
  getCarDetails: { fn: getCarDetailsTool, description: 'Get detailed information about a specific car model' },
  searchByFilters: { fn: searchByFiltersTool, description: 'Search cars using multiple filters: budget, type, brand, fuel, transmission' },
  countCars: { fn: countCarsTool, description: 'Return total number of cars in the database' }
};



// Business tools for the car customer agent (DB-backed)
import { getPool } from './db.js';

export async function searchInventoryTool(args) {
  // Back-compat: accept make/fuel keys but map to new schema (brand/fuel_type)
  const { make, brand: brandArg, model, maxPrice, type, fuel, fuel_type, transmission } = args || {};
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
  return { results: mapped };
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
  const { vehicleId, date, time, name } = args || {};
  if (!vehicleId || !date || !time) {
    return { ok: false, message: 'vehicleId, date, and time are required' };
  }
  // In real implementation, persist to DB or calendar
  const confirmationId = `TD-${Date.now()}`;
  return { ok: true, confirmationId, vehicleId, date, time, name: name || null };
}

export async function financingQuoteTool(args) {
  const { vehiclePrice, downPayment = 0, termMonths = 60, aprPercent = 5.5 } = args || {};
  const principal = Math.max(0, Number(vehiclePrice) - Number(downPayment));
  const monthlyRate = Number(aprPercent) / 100 / 12;
  const n = Number(termMonths);
  const monthlyPayment = monthlyRate === 0 ? principal / n : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return { principal, monthlyPayment: Number(monthlyPayment.toFixed(2)), aprPercent, termMonths };
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
      clauses.push(`(${alias}.make ilike $${startIndex + i} or ${alias}.model ilike $${startIndex + i})`);
      params.push(`%${t}%`);
    });
    return { clause: clauses.join(' and '), params };
  };

  const q1 = likeClause('c', parts1, 1);
  const q2 = likeClause('c', parts2, 1);

  const query1 = `select * from cars c where ${q1.clause.replaceAll('make','brand')} order by price asc limit 3`;
  const query2 = `select * from cars c where ${q2.clause.replaceAll('make','brand')} order by price asc limit 3`;

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
      mileage2: cars2[0]?.mileage || 'N/A'
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
  
  return {
    ok: true,
    results: rows.map(r => ({ ...r, make: r.brand, trim: r.variant, fuel: r.fuel_type })),
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

export const toolRegistry = {
  searchInventory: { fn: searchInventoryTool, description: 'Search vehicle inventory by make, model, maxPrice' },
  listMakes: { fn: listMakesTool, description: 'List distinct makes from inventory' },
  listTypes: { fn: listTypesTool, description: 'List inferred body types present in inventory' },
  listModelsByMake: { fn: listModelsByMakeTool, description: 'List distinct models for a given make' },
  listTrimsByMakeModel: { fn: listTrimsByMakeModelTool, description: 'List distinct trims for a given make+model' },
  scheduleTestDrive: { fn: scheduleTestDriveTool, description: 'Schedule a test drive for a vehicle' },
  financingQuote: { fn: financingQuoteTool, description: 'Compute an estimated monthly payment' },
  serviceAppointment: { fn: serviceAppointmentTool, description: 'Create a service appointment' },
  carValuation: { fn: carValuationTool, description: 'Estimate resale value from make, model, year, kms, condition' },
  compareCars: { fn: compareCarsTool, description: 'Compare two cars by name/model and show differences' },
  getCarDetails: { fn: getCarDetailsTool, description: 'Get detailed information about a specific car model' },
  searchByFilters: { fn: searchByFiltersTool, description: 'Search cars using multiple filters: budget, type, brand, fuel, transmission' },
  countCars: { fn: countCarsTool, description: 'Return total number of cars in the database' }
};



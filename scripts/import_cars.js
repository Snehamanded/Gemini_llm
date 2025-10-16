import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import { getPool, ensureSchema } from '../src/db.js';

dotenv.config();

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('Usage: node scripts/import_cars.js <path-to-xlsx>');
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const pool = getPool();
  if (!pool) {
    console.error('Postgres not configured. Set PGHOST/PGDATABASE/PGUSER/PGPASSWORD or DATABASE_URL');
    process.exit(1);
  }

  await ensureSchema();

  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: null });

  const client = await pool.connect();
  try {
    await client.query('begin');
    let idx = 0;
    for (const r of rows) {
      idx += 1;
      const brand = r.brand || r.make || r.Brand || r.Make || r.BRAND || r.MAKE || null;
      const model = r.model || r.Model || r.MODEL || null;
      const variant = r.variant || r.Variant || r.trim || r.Trim || r.TRIM || null;
      const type = r.type || r.Type || r.TYPE || null;
      const year = Number(r.year || r.Year || r.YEAR) || null;
      const fuel_type = r.fuel_type || r.fuel || r.Fuel || r.FUEL || null;
      const transmission = r.transmission || r.Transmission || r.Gearbox || null;
      const mileage = Number(r.mileage || r.Mileage || r.KMs || r.kms || r.Kilometers) || null;
      // price may include commas or currency symbol
      const priceRaw = (r.price || r.Price || r.PRICE || '').toString().replace(/[^0-9.]/g, '');
      const price = priceRaw ? Number(priceRaw) : null;
      const color = r.color || r.Color || r.COLOR || null;
      const engine_cc = Number(r.engine_cc || r.EngineCC || r.Engine || r.CC) || null;
      const power_bhp = Number(r.power_bhp || r.Power || r.BHP) || null;
      const seats = Number(r.seats || r.Seats) || null;
      const description = r.description || r.Description || null;

      // registration_number is required and unique by schema; synthesize if absent
      const registration_number = (r.registration_number || r.RegNo || r.Registration || r['Registration Number'])
        || `TEMP-${Date.now()}-${idx}`;

      await client.query(
        `insert into cars(
          registration_number, brand, model, variant, type, year, fuel_type, transmission, mileage, price, color, engine_cc, power_bhp, seats, description
        ) values (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
        )`,
        [registration_number, brand, model, variant, type, year, fuel_type, transmission, mileage, price, color, engine_cc, power_bhp, seats, description]
      );
    }
    await client.query('commit');
    console.log(`Imported ${rows.length} rows into cars.`);
  } catch (e) {
    await client.query('rollback');
    console.error('Import failed:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();



#!/usr/bin/env node

/**
 * Enhanced Car Inventory Script
 * Adds comprehensive car inventory to the database
 */

import { getPool } from '../src/db.js';
import { ensureSchema } from '../src/db.js';

const ENHANCED_CAR_INVENTORY = [
  // Hyundai Cars
  {
    brand: 'Hyundai',
    model: 'i20',
    variant: 'Sportz',
    type: 'Hatchback',
    year: 2020,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 24000,
    price: 760000,
    color: 'White',
    engine_cc: 1200,
    power_bhp: 83,
    seats: 5,
    description: 'Hyundai i20 Sportz with 1.2L Kappa petrol engine, touchscreen infotainment, reverse camera, dual airbags, 4-star safety rating. Single owner, complete service history.',
    status: 'available'
  },
  {
    brand: 'Hyundai',
    model: 'i20',
    variant: 'Asta',
    type: 'Hatchback',
    year: 2021,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 18000,
    price: 720000,
    color: 'Silver',
    engine_cc: 1200,
    power_bhp: 83,
    seats: 5,
    description: 'Hyundai i20 Asta with premium features, sunroof, wireless charging, and advanced safety features.',
    status: 'available'
  },
  {
    brand: 'Hyundai',
    model: 'Grand i10',
    variant: 'Nios',
    type: 'Hatchback',
    year: 2021,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 18000,
    price: 680000,
    color: 'Red',
    engine_cc: 1000,
    power_bhp: 68,
    seats: 5,
    description: 'Hyundai Grand i10 Nios with modern design, efficient engine, and great fuel economy.',
    status: 'available'
  },
  {
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX',
    type: 'SUV',
    year: 2020,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 32000,
    price: 1250000,
    color: 'Black',
    engine_cc: 1500,
    power_bhp: 115,
    seats: 5,
    description: 'Hyundai Creta SX with premium features, panoramic sunroof, and advanced safety systems.',
    status: 'available'
  },
  {
    brand: 'Hyundai',
    model: 'Verna',
    variant: 'SX',
    type: 'Sedan',
    year: 2019,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 45000,
    price: 950000,
    color: 'White',
    engine_cc: 1500,
    power_bhp: 115,
    seats: 5,
    description: 'Hyundai Verna SX with premium sedan features, comfortable ride, and excellent build quality.',
    status: 'available'
  },

  // Maruti Suzuki Cars
  {
    brand: 'Maruti Suzuki',
    model: 'Baleno',
    variant: 'Delta CVT',
    type: 'Hatchback',
    year: 2019,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 28000,
    price: 720000,
    color: 'Blue',
    engine_cc: 1200,
    power_bhp: 82,
    seats: 5,
    description: 'Maruti Baleno Delta CVT with smooth automatic transmission, great fuel efficiency, and reliable performance.',
    status: 'available'
  },
  {
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXi',
    type: 'Hatchback',
    year: 2018,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 46000,
    price: 580000,
    color: 'White',
    engine_cc: 1200,
    power_bhp: 82,
    seats: 5,
    description: 'Maruti Swift VXi with excellent fuel economy, reliable performance, and low maintenance costs.',
    status: 'available'
  },
  {
    brand: 'Maruti Suzuki',
    model: 'Dzire',
    variant: 'VXi',
    type: 'Sedan',
    year: 2020,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 35000,
    price: 780000,
    color: 'Silver',
    engine_cc: 1200,
    power_bhp: 82,
    seats: 5,
    description: 'Maruti Dzire VXi with spacious interior, comfortable ride, and excellent fuel efficiency.',
    status: 'available'
  },
  {
    brand: 'Maruti Suzuki',
    model: 'Vitara Brezza',
    variant: 'ZDi',
    type: 'SUV',
    year: 2019,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    mileage: 40000,
    price: 980000,
    color: 'Orange',
    engine_cc: 1200,
    power_bhp: 90,
    seats: 5,
    description: 'Maruti Vitara Brezza ZDi with diesel engine, great fuel economy, and SUV practicality.',
    status: 'available'
  },

  // Tata Cars
  {
    brand: 'Tata',
    model: 'Nexon',
    variant: 'XZ+',
    type: 'SUV',
    year: 2020,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 25000,
    price: 850000,
    color: 'White',
    engine_cc: 1200,
    power_bhp: 110,
    seats: 5,
    description: 'Tata Nexon XZ+ with 5-star safety rating, premium features, and excellent build quality.',
    status: 'available'
  },
  {
    brand: 'Tata',
    model: 'Tiago',
    variant: 'XZ',
    type: 'Hatchback',
    year: 2019,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 30000,
    price: 520000,
    color: 'Red',
    engine_cc: 1200,
    power_bhp: 85,
    seats: 5,
    description: 'Tata Tiago XZ with good build quality, comfortable ride, and value for money.',
    status: 'available'
  },

  // Honda Cars
  {
    brand: 'Honda',
    model: 'City',
    variant: 'VX',
    type: 'Sedan',
    year: 2020,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 22000,
    price: 1050000,
    color: 'White',
    engine_cc: 1500,
    power_bhp: 119,
    seats: 5,
    description: 'Honda City VX with premium sedan features, excellent build quality, and reliable performance.',
    status: 'available'
  },
  {
    brand: 'Honda',
    model: 'Amaze',
    variant: 'VX',
    type: 'Sedan',
    year: 2019,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 35000,
    price: 750000,
    color: 'Silver',
    engine_cc: 1200,
    power_bhp: 90,
    seats: 5,
    description: 'Honda Amaze VX with compact sedan design, good fuel efficiency, and Honda reliability.',
    status: 'available'
  },

  // Kia Cars
  {
    brand: 'Kia',
    model: 'Seltos',
    variant: 'HTX',
    type: 'SUV',
    year: 2020,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    mileage: 20000,
    price: 1150000,
    color: 'White',
    engine_cc: 1500,
    power_bhp: 115,
    seats: 5,
    description: 'Kia Seltos HTX with premium SUV features, advanced technology, and excellent design.',
    status: 'available'
  },
  {
    brand: 'Kia',
    model: 'Sonet',
    variant: 'HTX',
    type: 'SUV',
    year: 2021,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage: 15000,
    price: 950000,
    color: 'Blue',
    engine_cc: 1000,
    power_bhp: 120,
    seats: 5,
    description: 'Kia Sonet HTX with compact SUV design, premium features, and great value.',
    status: 'available'
  }
];

async function enhanceCarInventory() {
  console.log('🚗 Enhancing Car Inventory Database');
  console.log('='.repeat(60));
  
  try {
    // Ensure database schema
    await ensureSchema();
    console.log('✅ Database schema ensured');
    
    const pool = getPool();
    if (!pool) {
      console.error('❌ Database connection failed');
      return;
    }
    
    // Clear existing data (optional - for fresh start)
    // await pool.query('DELETE FROM cars');
    // console.log('🗑️ Cleared existing car data');
    
    // Insert enhanced car inventory
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const car of ENHANCED_CAR_INVENTORY) {
      try {
        // Check if car already exists
        const existingCar = await pool.query(
          'SELECT id FROM cars WHERE brand = $1 AND model = $2 AND variant = $3 AND year = $4',
          [car.brand, car.model, car.variant, car.year]
        );
        
        if (existingCar.rows.length > 0) {
          console.log(`⏭️ Skipped existing: ${car.brand} ${car.model} ${car.variant} (${car.year})`);
          skippedCount++;
          continue;
        }
        
        // Generate a unique registration number
        const regNumber = `KA${Math.floor(Math.random() * 100000)}${car.year}`;
        
        // Insert new car
        await pool.query(`
          INSERT INTO cars (
            registration_number, brand, model, variant, type, year, fuel_type, transmission, 
            mileage, price, color, engine_cc, power_bhp, seats, 
            description, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        `, [
          regNumber, car.brand, car.model, car.variant, car.type, car.year,
          car.fuel_type, car.transmission, car.mileage, car.price,
          car.color, car.engine_cc, car.power_bhp, car.seats,
          car.description, car.status
        ]);
        
        console.log(`✅ Added: ${car.brand} ${car.model} ${car.variant} (${car.year}) - ₹${car.price.toLocaleString('en-IN')}`);
        insertedCount++;
        
      } catch (error) {
        console.error(`❌ Error adding ${car.brand} ${car.model}:`, error.message);
      }
    }
    
    console.log('\n📊 Inventory Enhancement Summary:');
    console.log(`✅ Cars Added: ${insertedCount}`);
    console.log(`⏭️ Cars Skipped: ${skippedCount}`);
    console.log(`📈 Total Cars: ${insertedCount + skippedCount}`);
    
    // Verify inventory
    const totalCars = await pool.query('SELECT COUNT(*) as count FROM cars');
    console.log(`🗄️ Total cars in database: ${totalCars.rows[0].count}`);
    
    // Show sample cars
    const sampleCars = await pool.query('SELECT brand, model, variant, year, price FROM cars ORDER BY created_at DESC LIMIT 5');
    console.log('\n🚗 Sample Cars Added:');
    sampleCars.rows.forEach(car => {
      console.log(`• ${car.brand} ${car.model} ${car.variant} (${car.year}) - ₹${car.price.toLocaleString('en-IN')}`);
    });
    
    console.log('\n🎉 Car inventory enhancement completed successfully!');
    
  } catch (error) {
    console.error('❌ Error enhancing car inventory:', error);
  }
}

// Run the enhancement
enhanceCarInventory().catch(console.error);

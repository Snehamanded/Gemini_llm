import dotenv from 'dotenv';
import { handleDeterministicFlows } from '../src/flows.js';

dotenv.config();

function divider(title) {
  console.log('\n==============================');
  console.log(title);
  console.log('==============================');
}

async function send(userId, msg) {
  const res = await handleDeterministicFlows(userId, msg);
  const out = typeof res === 'string' ? res : JSON.stringify(res);
  console.log(`User: ${msg}`);
  console.log(`Bot: ${out}\n`);
}

async function main() {
  // 1) Greeting reset
  divider('1) Greeting reset');
  await send('u1', 'Hi');

  // 2) Browse flow: budget -> type -> brand -> list -> carN -> features
  divider('2) Browse flow full');
  await send('u2', "I'm looking for an SUV under 10 lakhs");
  await send('u2', 'Hyundai');
  await send('u2', 'show more');
  await send('u2', 'car2');
  await send('u2', 'features');

  // 3) Browse in Hinglish
  divider('3) Browse Hinglish');
  await send('u3', 'second hand car dekhna hai');
  await send('u3', 'budget 8 lakh tak');
  await send('u3', 'SUV chahiye');
  await send('u3', 'maruti');

  // 4) Valuation multi-turn
  divider('4) Car valuation');
  await send('u4', 'car valuation');
  await send('u4', 'Hyundai i20 2019');
  await send('u4', '70000 km good condition Bangalore');

  // 5) Compare after selection
  divider('5) Compare after selection');
  await send('u5', 'browse used cars');
  await send('u5', 'SUV');
  await send('u5', 'under 12 lakhs');
  await send('u5', 'car1');
  await send('u5', 'compare with Toyota Camry');

  // 6) Direct compare two names
  divider('6) Compare two names');
  await send('u6', 'Honda City vs Toyota Camry');

  // 7) Test drive with inline car name + weekend + noon
  divider('7) Test drive inline + weekend + noon');
  await send('u7', 'Can I test drive Tata Nexon');
  await send('u7', 'this weekend');
  await send('u7', '12pm');
  await send('u7', 'Main Showroom');
  await send('u7', 'Name: Rahul Sharma, Phone: 9876543210, Email: rahul@example.com');

  // 8) Test drive generic then car then tomorrow 3pm
  divider('8) Test drive generic');
  await send('u8', 'I want a test drive');
  await send('u8', 'Hyundai Creta');
  await send('u8', 'tomorrow');
  await send('u8', '3pm');
  await send('u8', 'Branch');
  await send('u8', 'Name: Priya, Phone: 9123456789');

  // 9) Service booking intent (if supported)
  divider('9) Book a service');
  await send('u9', 'book a service');
  await send('u9', 'VIN KA01AB1234, General service, Tomorrow 11am');

  // 10) Financing info
  divider('10) Financing');
  await send('u10', 'What EMI for a car around 10 lakhs?');

  // 11) Pagination: show more results and select next
  divider('11) Pagination and selection');
  await send('u11', 'browse used cars');
  await send('u11', 'under 7 lakhs');
  await send('u11', 'SUV');
  await send('u11', 'show more');
  await send('u11', 'car6');

  // 12) Cancel test drive by phone
  divider('12) Cancel test drive');
  await send('u12', 'cancel test drive');
  await send('u12', 'Phone: 9876543210');

  // 13) Check test drive by booking id
  divider('13) Check test drive');
  await send('u13', 'test drive status');
  await send('u13', 'TD-123456');

  // 14) Compare with typos
  divider('14) Compare with typos');
  await send('u14', 'Hundai Cretaa vs KIA Seltis');

  // 15) Features of car name directly
  divider('15) Features of explicit car');
  await send('u15', 'features of Honda City VX');

  // 16) Service booking one-shot parse
  divider('16) Service one-shot');
  await send('u16', 'Hyundai i20 2020 KA01AB1234, Regular Service, Tomorrow 11am');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});



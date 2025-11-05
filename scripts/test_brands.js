import dotenv from 'dotenv';
import { searchInventoryTool, listModelsByMakeTool } from '../src/tools.js';

dotenv.config();

const BRANDS = [
  'Hyundai','Maruti','Tata','Mahindra','Kia','Honda','Toyota','Ford','Volkswagen','Skoda','Renault','Nissan','MG','Jeep'
];

async function main() {
  console.log('Brand coverage check (counts and sample models):');
  for (const brand of BRANDS) {
    try {
      const models = await listModelsByMakeTool({ make: brand });
      const res = await searchInventoryTool({ brand, maxPrice: null });
      const count = res.count ?? (res.results ? res.results.length : 0);
      const sampleModels = (models.models || []).slice(0, 5).join(', ');
      console.log(`- ${brand}: ${count} cars${sampleModels ? ` | models: ${sampleModels}` : ''}`);
    } catch (e) {
      console.log(`- ${brand}: error ${e.message || e}`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });



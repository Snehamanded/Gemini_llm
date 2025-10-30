import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import { handleUserMessage } from '../src/gemini.js';
import { detectLanguage, isHinglish } from '../src/language.js';

dotenv.config();

// Six intents: test drive, valuation, contact us, services, about us, financing
const INTENTS = {
  testDrive: [
    'Main Hyundai Creta ka test drive book karna chahta hun',
    'Kal subah test drive chahiye, venue ya i20 chalegi',
    'Aaj 4 baje test drive ho sakti hai?',
    'Weekend pe test drive schedule karna hai, kaise karein?'
  ],
  valuation: [
    'Mere paas 2018 Honda City hai, valuation batao',
    'Maruti Swift 2016, 60k km – resale value kya hoga?',
    'Car valuation chahiye, Hyundai i20 2019 good condition',
    'Old car bechni hai, estimate share karo'
  ],
  contactUs: [
    'Contact details bhej do please',
    'Showroom ka number kya hai?',
    'Address aur timing batao',
    'Kaunse number pe baat ho sakti hai?'
  ],
  services: [
    'Service appointment book karna hai kal ke liye',
    'Periodic service kab available hai?',
    'AC service karwana hai, slot milega?',
    'Pickup and drop service milta hai kya?'
  ],
  aboutUs: [
    'Aap log kaunse brands deal karte ho?',
    'About your dealership thoda batao',
    'Showroom ke baare mein info chahiye',
    'Kya aap certified pre-owned cars bhi rakhte ho?'
  ],
  financing: [
    'Financing options batao 12-15 lakhs budget ke liye',
    'EMI kitna banega agar 10% down payment doon?',
    'Loan processing time aur documents kya chahiye?',
    '0 down payment possible hai kya?'
  ]
};

function makeDataset(targetCount = 100) {
  const intentKeys = Object.keys(INTENTS);
  const prompts = [];
  let i = 0;
  while (prompts.length < targetCount) {
    const key = intentKeys[i % intentKeys.length];
    const bucket = INTENTS[key];
    const variant = bucket[i % bucket.length];
    const suffix = ['', ' please', ' yaar', ' jaldi batao', ' thoda detail mein'][i % 5];
    prompts.push({ intent: key, input: `${variant}${suffix}`.trim() });
    i += 1;
  }
  return prompts;
}

function formatOneLine(str, len = 120) {
  const s = String(str || '').replace(/\s+/g, ' ').trim();
  return s.length > len ? s.slice(0, len - 3) + '...' : s;
}

function stringifyResponse(resp) {
  if (typeof resp === 'string') return resp;
  try { return JSON.stringify(resp); } catch { return String(resp); }
}

async function runBatch() {
  const countArg = Number(process.argv[2]) || 100;
  const verbose = /--verbose/.test(process.argv.join(' '));
  const prompts = makeDataset(countArg);
  const total = prompts.length;
  let detectionsCorrect = 0;
  let responsesInHinglish = 0;
  let quickWins = 0;
  let errors = 0;
  const perIntent = {};
  const misses = [];
  const rows = [['index','intent','input','response','langDetected','responseIsHinglish','latencyMs']];
  const records = [];

  console.log(`🧪 Running ${total} Hinglish conversations across intents...`);
  console.log('-'.repeat(80));

  for (let i = 0; i < prompts.length; i++) {
    const { intent, input } = prompts[i];
    try {
      const lang = detectLanguage(input);
      const detectedHinglish = lang === 'hinglish' || isHinglish(input);
      if (detectedHinglish) detectionsCorrect += 1;

      const start = Date.now();
      const response = await handleUserMessage({
        userId: `batch_hinglish_${i}`,
        message: input,
        channel: 'terminal',
        businessName: 'Sherpa Hyundai'
      });
      const latency = Date.now() - start;

      const responseStr = stringifyResponse(response);
      const responseIsH = isHinglish(responseStr);
      if (responseIsH) responsesInHinglish += 1;

      // Count quick response hits by matching a few known lines
      if (/Sherpa Hyundai mein aapka swagat hai|Bahut badhiya|Perfect!|Koi baat nahi/i.test(responseStr)) {
        quickWins += 1;
      }

      // Per-intent rollups
      perIntent[intent] = perIntent[intent] || { total: 0, detectedHinglish: 0, responseHinglish: 0, avgLatency: 0 };
      perIntent[intent].total += 1;
      if (detectedHinglish) perIntent[intent].detectedHinglish += 1;
      if (responseIsH) perIntent[intent].responseHinglish += 1;
      perIntent[intent].avgLatency += latency;

      const record = {
        index: i + 1,
        intent,
        input,
        response: responseStr,
        langDetected: lang,
        responseIsHinglish: responseIsH ? 'yes' : 'no',
        latencyMs: latency
      };

      // CSV row (sanitized commas/newlines)
      rows.push([
        i + 1,
        intent,
        input.replaceAll(',', ';'),
        responseStr.replaceAll('\n', ' ').replaceAll(',', ';'),
        lang,
        responseIsH ? 'yes' : 'no',
        latency
      ]);

      records.push(record);

      // Print a compact line for each turn
      if (verbose) {
        console.log(`(${i + 1}) [${intent}] IN: ${input}`);
        console.log(`     OUT: ${formatOneLine(responseStr)}`);
        console.log(`     ms: ${latency}`);
      } else {
        console.log(`(${i + 1}) [${intent}] IN: ${formatOneLine(input, 60)} | OUT: ${formatOneLine(responseStr, 60)} | ${latency}ms`);
      }
    } catch (err) {
      errors += 1;
      misses.push({ index: i + 1, intent, input, error: err?.message || String(err) });
      console.log(`(${i + 1}) [${intent}] IN: ${input}`);
      console.log(`     ERR: ${err?.message || err}`);
    }
  }

  console.log('\n📊 Summary');
  console.log('-'.repeat(80));
  console.log(`Total: ${total}`);
  console.log(`Detected as Hinglish: ${detectionsCorrect}/${total}`);
  console.log(`Responses in Hinglish: ${responsesInHinglish}/${total}`);
  console.log(`Quick response matches: ${quickWins}/${total}`);
  console.log(`Errors: ${errors}`);

  // Per-intent summary
  console.log('\nPer-intent:');
  Object.entries(perIntent).forEach(([k, v]) => {
    const avgMs = v.total ? Math.round(v.avgLatency / v.total) : 0;
    console.log(`- ${k}: total ${v.total}, detected ${v.detectedHinglish}/${v.total}, responses ${v.responseHinglish}/${v.total}, avg ${avgMs}ms`);
  });

  // Save CSV/XLSX/JSONL reports
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const csvPath = path.join(reportsDir, `hinglish_batch_${ts}.csv`);
    fs.writeFileSync(csvPath, rows.map(r => r.join(',')).join('\n'));
    console.log(`\n📄 Saved CSV report: ${csvPath}`);

    // Also save XLSX report
    const workbook = xlsx.utils.book_new();
    // All conversations sheet
    const allSheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, allSheet, 'Conversations');

    // Summary sheet
    const summaryAoa = [
      ['metric','value'],
      ['total', total],
      ['detected_hinglish', `${detectionsCorrect}/${total}`],
      ['responses_hinglish', `${responsesInHinglish}/${total}`],
      ['quick_response_matches', `${quickWins}/${total}`],
      ['errors', errors]
    ];
    summaryAoa.push([]);
    summaryAoa.push(['intent','total','detected','responses','avgLatencyMs']);
    Object.entries(perIntent).forEach(([k, v]) => {
      const avgMs = v.total ? Math.round(v.avgLatency / v.total) : 0;
      summaryAoa.push([k, v.total, `${v.detectedHinglish}/${v.total}`, `${v.responseHinglish}/${v.total}`, avgMs]);
    });
    const summarySheet = xlsx.utils.aoa_to_sheet(summaryAoa);
    xlsx.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Per-intent sheets
    Object.keys(perIntent).forEach((intentKey) => {
      const header = ['index','intent','input','response','langDetected','responseIsHinglish','latencyMs'];
      const rowsForIntent = [header].concat(
        records
          .filter(r => r.intent === intentKey)
          .map(r => [r.index, r.intent, r.input, r.response, r.langDetected, r.responseIsHinglish, r.latencyMs])
      );
      const sheet = xlsx.utils.aoa_to_sheet(rowsForIntent);
      xlsx.utils.book_append_sheet(workbook, sheet, intentKey);
    });

    const xlsxPath = path.join(reportsDir, `hinglish_batch_${ts}.xlsx`);
    xlsx.writeFile(workbook, xlsxPath);
    console.log(`📄 Saved Excel report: ${xlsxPath}`);

    // JSONL export
    const jsonlPath = path.join(reportsDir, `hinglish_batch_${ts}.jsonl`);
    const jsonl = records.map(r => JSON.stringify(r)).join('\n');
    fs.writeFileSync(jsonlPath, jsonl);
    console.log(`📄 Saved JSONL report: ${jsonlPath}`);

    // Auto-cleanup older hinglish_batch_* reports, keep only the latest set
    try {
      const all = fs.readdirSync(reportsDir)
        .filter(n => /^hinglish_batch_.*\.(csv|xlsx|jsonl)$/.test(n))
        .map(n => ({ name: n, full: path.join(reportsDir, n), stat: fs.statSync(path.join(reportsDir, n)) }));
      if (all.length > 0) {
        // Keep current timestamp set; delete others
        const keepBase = `hinglish_batch_${ts}`;
        const toDelete = all.filter(f => path.basename(f.name, path.extname(f.name)) !== keepBase);
        if (toDelete.length) {
          toDelete.forEach(f => fs.unlinkSync(f.full));
          console.log('🧹 Old reports cleaned up (kept latest set).');
        } else {
          console.log('🧹 No old reports to clean.');
        }
      }
    } catch (cleanErr) {
      console.log('⚠️  Cleanup skipped:', cleanErr?.message || cleanErr);
    }
  } catch (e) {
    console.log('⚠️  Could not write reports:', e?.message || e);
  }

  // Show a few misses where response not hinglish
  if (misses.length) {
    console.log('\nExamples with issues (up to 5):');
    misses.slice(0, 5).forEach(m => {
      console.log(`- #${m.index} [${m.intent}] ${m.input} -> ${m.error}`);
    });
  }
}

runBatch().then(() => {
  console.log('\n✅ Batch test complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Batch test failed', err);
  process.exit(1);
});



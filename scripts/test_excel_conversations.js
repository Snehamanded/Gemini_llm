import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import { handleUserMessage } from '../src/gemini.js';
import { clearSession } from '../src/session.js';
import { detectLanguage, isHinglish } from '../src/language.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Excel file
function loadConversationsFromExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  
  // Group by Conversation ID
  const conversations = {};
  
  data.forEach(row => {
    const convId = row['Conversation ID'];
    if (!conversations[convId]) {
      conversations[convId] = {
        conversationId: convId,
        category: row['Category'],
        scenario: row['Scenario'],
        turns: []
      };
    }
    
    conversations[convId].turns.push({
      turnNumber: row['Turn Number'],
      userMessage: row['User Message'],
      expectedResponse: row['Bot Response'],
      expectedLanguage: row['Language'],
      expectedOutcome: row['Outcome']
    });
  });
  
  return Object.values(conversations);
}

function formatOneLine(str, len = 100) {
  const s = String(str || '').replace(/\s+/g, ' ').trim();
  return s.length > len ? s.slice(0, len - 3) + '...' : s;
}

function stringifyResponse(resp) {
  if (typeof resp === 'string') return resp;
  try { return JSON.stringify(resp); } catch { return String(resp); }
}

async function runTests(excelFilePath) {
  console.log('📖 Loading conversations from Excel file...\n');
  const conversations = loadConversationsFromExcel(excelFilePath);
  
  console.log(`Found ${conversations.length} conversations`);
  console.log(`Total turns: ${conversations.reduce((sum, c) => sum + c.turns.length, 0)}\n`);
  console.log('='.repeat(80));
  console.log('🧪 Starting Conversation Tests\n');
  console.log('='.repeat(80));
  
  const totalConversations = conversations.length;
  let completedConversations = 0;
  let totalTurns = 0;
  let successfulTurns = 0;
  let errors = 0;
  
  const stats = {
    byCategory: {},
    outcomes: { success: 0, error: 0, incomplete: 0 },
    avgLatency: [],
    errors: [],
    languageMismatches: 0
  };

  const rows = [[
    'Conversation ID',
    'Category',
    'Scenario',
    'Turn Number',
    'User Message',
    'Expected Response',
    'Actual Response',
    'Expected Language',
    'Actual Language',
    'Latency (ms)',
    'Status',
    'Notes'
  ]];

  console.log(`Running ${totalConversations} conversations...\n`);

  for (let convIdx = 0; convIdx < conversations.length; convIdx++) {
    const conversation = conversations[convIdx];
    const userId = `test_excel_${conversation.conversationId}`;
    
    // Initialize category stats
    if (!stats.byCategory[conversation.category]) {
      stats.byCategory[conversation.category] = {
        total: 0,
        successful: 0,
        errors: 0,
        avgLatency: []
      };
    }

    // Clear session for each conversation
    clearSession(userId);

    let conversationErrors = 0;
    let conversationSuccessful = true;

    for (let turnIdx = 0; turnIdx < conversation.turns.length; turnIdx++) {
      const turn = conversation.turns[turnIdx];
      const userMessage = turn.userMessage;
      totalTurns++;

      try {
        const startTime = Date.now();
        const botResponse = await handleUserMessage({
          userId: userId,
          message: userMessage,
          channel: 'whatsapp',
          businessName: 'Sherpa Hyundai'
        });
        const latency = Date.now() - startTime;

        const responseStr = stringifyResponse(botResponse);
        
        // Validate language
        const userLang = detectLanguage(userMessage);
        const userIsHinglish = isHinglish(userMessage);
        const responseIsHinglish = isHinglish(responseStr);
        const actualLang = responseIsHinglish ? 'Hinglish' : (userLang === 'hinglish' ? 'Hinglish' : userLang === 'english' ? 'English' : userLang);
        
        // Check if response language matches expected
        const langMatch = !turn.expectedLanguage || 
                         (turn.expectedLanguage.toLowerCase().includes(actualLang.toLowerCase()) ||
                          (turn.expectedLanguage === 'English' && !responseIsHinglish) ||
                          (turn.expectedLanguage === 'Hinglish' && responseIsHinglish));
        
        const status = langMatch ? 'Success' : 'Language Mismatch';
        if (!langMatch) {
          stats.languageMismatches++;
        }
        
        successfulTurns++;
        stats.avgLatency.push(latency);
        stats.byCategory[conversation.category].avgLatency.push(latency);
        stats.byCategory[conversation.category].successful++;

        rows.push([
          conversation.conversationId,
          conversation.category,
          conversation.scenario,
          turn.turnNumber,
          userMessage.replace(/,/g, ';'),
          (turn.expectedResponse || '').replace(/,/g, ';').substring(0, 200),
          responseStr.replace(/\n/g, ' ').replace(/,/g, ';').substring(0, 200),
          turn.expectedLanguage || 'N/A',
          actualLang,
          latency,
          status,
          !langMatch ? `Expected ${turn.expectedLanguage}, got ${actualLang}` : ''
        ]);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        errors++;
        conversationErrors++;
        conversationSuccessful = false;
        const errorMsg = error?.message || String(error);

        stats.errors.push({
          conversationId: conversation.conversationId,
          turn: turn.turnNumber,
          message: userMessage,
          error: errorMsg
        });

        stats.byCategory[conversation.category].errors++;

        const errorUserLang = detectLanguage(userMessage);
        rows.push([
          conversation.conversationId,
          conversation.category,
          conversation.scenario,
          turn.turnNumber,
          userMessage.replace(/,/g, ';'),
          (turn.expectedResponse || '').replace(/,/g, ';'),
          '',
          turn.expectedLanguage || 'N/A',
          '',
          0,
          'Error',
          errorMsg
        ]);

        // Continue to next turn even if error occurs
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Update conversation outcome
    if (conversationErrors > 0) {
      stats.outcomes.error++;
    } else {
      stats.outcomes.success++;
    }

    stats.byCategory[conversation.category].total++;
    completedConversations++;

    // Progress update every 50 conversations
    if ((convIdx + 1) % 50 === 0 || convIdx === conversations.length - 1) {
      console.log(`Progress: ${completedConversations}/${totalConversations} conversations (${((completedConversations / totalConversations) * 100).toFixed(1)}%)`);
    }
  }

  // Generate summary statistics
  const avgLatency = stats.avgLatency.length > 0
    ? Math.round(stats.avgLatency.reduce((a, b) => a + b, 0) / stats.avgLatency.length)
    : 0;

  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Conversations: ${totalConversations}`);
  console.log(`Total Turns: ${totalTurns}`);
  console.log(`Successful Turns: ${successfulTurns}/${totalTurns} (${((successfulTurns / totalTurns) * 100).toFixed(1)}%)`);
  console.log(`Errors: ${errors}/${totalTurns} (${((errors / totalTurns) * 100).toFixed(1)}%)`);
  console.log(`Language Mismatches: ${stats.languageMismatches}/${totalTurns} (${((stats.languageMismatches / totalTurns) * 100).toFixed(1)}%)`);
  console.log(`Average Latency: ${avgLatency}ms`);

  console.log('\n📈 Outcomes:');
  console.log(`  ✅ Successful: ${stats.outcomes.success}`);
  console.log(`  ❌ Errors: ${stats.outcomes.error}`);
  console.log(`  ⚠️  Incomplete: ${stats.outcomes.incomplete}`);

  console.log('\n📂 By Category:');
  Object.entries(stats.byCategory).forEach(([category, catStats]) => {
    const catAvgLatency = catStats.avgLatency.length > 0
      ? Math.round(catStats.avgLatency.reduce((a, b) => a + b, 0) / catStats.avgLatency.length)
      : 0;
    console.log(`  ${category}:`);
    console.log(`    Total: ${catStats.total}`);
    console.log(`    Successful: ${catStats.successful}`);
    console.log(`    Errors: ${catStats.errors}`);
    console.log(`    Avg Latency: ${catAvgLatency}ms`);
  });

  // Save reports
  try {
    const reportsDir = path.join(__dirname, '..', 'reports');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Save Excel report
    const workbook = xlsx.utils.book_new();
    
    // Main conversations sheet
    const conversationsSheet = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook, conversationsSheet, 'Conversations');

    // Summary sheet
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Conversations', totalConversations],
      ['Total Turns', totalTurns],
      ['Successful Turns', `${successfulTurns}/${totalTurns}`],
      ['Errors', `${errors}/${totalTurns}`],
      ['Language Mismatches', `${stats.languageMismatches}/${totalTurns}`],
      ['Success Rate', `${((successfulTurns / totalTurns) * 100).toFixed(1)}%`],
      ['Average Latency (ms)', avgLatency],
      [],
      ['Outcome', 'Count'],
      ['Successful', stats.outcomes.success],
      ['Errors', stats.outcomes.error],
      ['Incomplete', stats.outcomes.incomplete],
      [],
      ['Category', 'Total', 'Successful', 'Errors', 'Avg Latency (ms)']
    ];

    Object.entries(stats.byCategory).forEach(([category, catStats]) => {
      const catAvgLatency = catStats.avgLatency.length > 0
        ? Math.round(catStats.avgLatency.reduce((a, b) => a + b, 0) / catStats.avgLatency.length)
        : 0;
      summaryData.push([
        category,
        catStats.total,
        catStats.successful,
        catStats.errors,
        catAvgLatency
      ]);
    });

    const summarySheet = xlsx.utils.aoa_to_sheet(summaryData);
    xlsx.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Errors sheet (if any)
    if (stats.errors.length > 0) {
      const errorHeaders = [['Conversation ID', 'Turn', 'User Message', 'Error']];
      const errorRows = stats.errors.map(e => [
        e.conversationId,
        e.turn,
        e.message,
        e.error
      ]);
      const errorSheet = xlsx.utils.aoa_to_sheet([...errorHeaders, ...errorRows]);
      xlsx.utils.book_append_sheet(workbook, errorSheet, 'Errors');
    }

    const excelPath = path.join(reportsDir, `excel_test_${timestamp}.xlsx`);
    xlsx.writeFile(workbook, excelPath);
    console.log(`\n📄 Excel report saved: ${excelPath}`);

    // Save CSV
    const csvPath = path.join(reportsDir, `excel_test_${timestamp}.csv`);
    const csvContent = rows.map(row => row.join(',')).join('\n');
    fs.writeFileSync(csvPath, csvContent);
    console.log(`📄 CSV report saved: ${csvPath}`);

  } catch (reportError) {
    console.error('\n❌ Error saving reports:', reportError.message);
  }

  // Show sample errors
  if (stats.errors.length > 0) {
    console.log('\n⚠️  Sample Errors (first 5):');
    stats.errors.slice(0, 5).forEach(err => {
      console.log(`  Conv #${err.conversationId}, Turn ${err.turn}: ${formatOneLine(err.message, 60)}`);
      console.log(`    Error: ${formatOneLine(err.error, 60)}`);
    });
  }

  console.log('\n✅ Test execution completed!');
  return {
    totalConversations,
    totalTurns,
    successfulTurns,
    errors,
    avgLatency
  };
}

// Main execution
async function main() {
  try {
    const excelFile = process.argv[2] || '250_English_50_Hinglish_Conversations.xlsx';
    await runTests(excelFile);
    process.exit(0);
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

main();


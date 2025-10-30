import fs from 'fs';
import path from 'path';

function main() {
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    console.log('Reports directory not found.');
    return;
  }
  const files = fs.readdirSync(reportsDir)
    .filter(n => /^hinglish_batch_.*\.(csv|xlsx|jsonl)$/.test(n))
    .map(n => ({ name: n, full: path.join(reportsDir, n), stat: fs.statSync(path.join(reportsDir, n)) }));
  if (files.length === 0) {
    console.log('No batch reports found.');
    return;
  }
  files.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  const latest = files[0];
  const keepBase = path.basename(latest.name, path.extname(latest.name));
  const keep = files.filter(f => path.basename(f.name, path.extname(f.name)) === keepBase);
  const del = files.filter(f => path.basename(f.name, path.extname(f.name)) !== keepBase);

  console.log('Keeping:');
  keep.map(f => f.name).sort().forEach(n => console.log('  ' + n));
  if (del.length) {
    console.log('Deleting:');
    del.map(f => f.name).sort().forEach(n => console.log('  ' + n));
    del.forEach(f => fs.unlinkSync(f.full));
    console.log('Old reports deleted.');
  } else {
    console.log('No old reports to delete.');
  }
}

main();



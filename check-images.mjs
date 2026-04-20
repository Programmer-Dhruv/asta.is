import fs from 'fs';
import path from 'path';

const folder = 'public/assets/images';
const files = fs.readdirSync(folder);

console.log('📁 Images in folder:\n');
files.forEach(f => {
  const size = fs.statSync(path.join(folder, f)).size;
  console.log(`  ${f.padEnd(35)} ${(size/1024).toFixed(1)} KB`);
});

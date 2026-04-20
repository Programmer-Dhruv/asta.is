import fs from 'fs';

const folder = 'public/assets/images';

const files = fs.readdirSync(folder);
let deleted = 0;

files.forEach(f => {
  const size = fs.statSync(folder + '/' + f).size;
  if (size < 1000) {
    fs.unlinkSync(folder + '/' + f);
    console.log('Deleted (too small):', f);
    deleted++;
  }
});

console.log(`\nDeleted ${deleted} bad images`);
console.log('Remaining:');
fs.readdirSync(folder).forEach(f => console.log('  ' + f));

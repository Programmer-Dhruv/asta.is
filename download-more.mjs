import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const folder = 'public/assets/images';

async function download(url, filename) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://myanimelist.net/'
      }
    });
    
    if (!response.ok) return false;
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.join(folder, filename), Buffer.from(buffer));
    
    const size = fs.statSync(path.join(folder, filename)).size;
    if (size < 1000) return false; // Too small = probably error page
    
    console.log(`✅ ${filename}`);
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log('Downloading anime images...\n');
  
  // Try direct URLs from different sources
  const sources = [
    { name: 'black-clover.jpg', urls: [
      'https://img.anime-planet.com/cdn/2017/07/black-clover-01.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/81M-9Kl8n2L.jpg',
      'https://i.imgur.com/K9YLT4H.jpg'
    ]},
    { name: 'naruto-shippuden.jpg', urls: [
      'https://img.anime-planet.com/cdn/2007/02/naruto-shippuden-01.jpg',
      'https://i.imgur.com/YkZBQPd.jpg'
    ]},
    { name: 'dragon-ball-super.jpg', urls: [
      'https://img.anime-planet.com/cdn/2015/06/dragon-ball-super-01.jpg',
      'https://i.imgur.com/VQ8K4Vx.jpg'
    ]},
    { name: 'solo-leveling.jpg', urls: [
      'https://i.imgur.com/mCJQJx2.jpg',
      'https://i.imgur.com/WtAaKhN.jpg'
    ]},
    { name: 'frieren.jpg', urls: [
      'https://img.anime-planet.com/cdn/2023/09/sousou-no-frieren-01.jpg',
      'https://i.imgur.com/YtAaKhN.jpg'
    ]},
  ];

  for (const src of sources) {
    let done = false;
    for (const url of src.urls) {
      if (await download(url, src.name)) {
        done = true;
        break;
      }
    }
    if (!done) console.log(`❌ ${src.name}`);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n📁 Images:');
  fs.readdirSync(folder).forEach(f => console.log(`  ${f}`));
}

main();

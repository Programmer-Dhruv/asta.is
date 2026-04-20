import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const folder = 'public/assets/images';

async function download(url, filename) {
  try {
    console.log(`Downloading ${filename}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.log(`HTTP ${response.status}`);
      return false;
    }
    
    const buffer = await response.arrayBuffer();
    const bufferStr = Buffer.from(buffer);
    
    if (bufferStr.length < 5000) {
      console.log('File too small');
      return false;
    }
    
    fs.writeFileSync(path.join(folder, filename), bufferStr);
    console.log(`✅ ${filename} (${(bufferStr.length/1024).toFixed(1)} KB)`);
    return true;
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return false;
  }
}

async function main() {
  // Try different URLs for remaining images
  const images = [
    // Black Clover - try different IDs
    { name: 'black-clover.jpg', urls: [
      'https://cdn.myanimelist.net/images/anime/1792/126216.jpg',
      'https://cdn.myanimelist.net/images/anime/3/64473.jpg',
      'https://cdn.myanimelist.net/images/anime/3/21564.jpg',
      'https://cdn.myanimelist.net/images/anime/1197/110531.jpg'
    ]},
    // Naruto Shippuden
    { name: 'naruto-shippuden.jpg', urls: [
      'https://cdn.myanimelist.net/images/anime/8/17474.jpg',
      'https://cdn.myanimelist.net/images/anime/5/51488.jpg',
      'https://cdn.myanimelist.net/images/anime/5/51489.jpg'
    ]},
    // Dragon Ball Super
    { name: 'dragon-ball-super.jpg', urls: [
      'https://cdn.myanimelist.net/images/anime/7/76177.jpg',
      'https://cdn.myanimelist.net/images/anime/2/73161.jpg'
    ]},
    // Solo Leveling - this might not be on MAL yet
    { name: 'solo-leveling.jpg', urls: [
      'https://cdn.myanimelist.net/images/anime/1895/131624.jpg',
      'https://cdn.myanimelist.net/images/anime/1989/129516.jpg'
    ]},
    // Frieren
    { name: 'frieren.jpg', urls: [
      'https://cdn.myanimelist.net/images/anime/1015/138669.jpg',
      'https://cdn.myanimelist.net/images/anime/1015/139284.jpg',
      'https://cdn.myanimelist.net/images/anime/1015/141180.jpg'
    ]},
  ];

  console.log('Downloading remaining images...\n');
  
  for (const img of images) {
    let done = false;
    for (const url of img.urls) {
      if (await download(url, img.name)) {
        done = true;
        break;
      }
    }
    if (!done) {
      console.log(`❌ ${img.name} - All URLs failed`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\nDone!');
}

main();

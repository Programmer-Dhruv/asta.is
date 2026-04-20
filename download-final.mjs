import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const folder = 'public/assets/images';

async function download(url, filename) {
  try {
    console.log(`Downloading ${filename}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://myanimelist.net/'
      }
    });
    
    if (!response.ok) {
      console.log(`HTTP ${response.status}`);
      return false;
    }
    
    const buffer = await response.arrayBuffer();
    const bufferStr = Buffer.from(buffer);
    
    if (bufferStr.length < 10000) {
      console.log(`File too small: ${bufferStr.length} bytes`);
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
  // These are tested working URLs from MyAnimeList CDN
  const images = [
    // Working ones
    { name: 'demon-slayer.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
    { name: 'jujutsu-kaisen.jpg', url: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg' },
    { name: 'attack-on-titan.jpg', url: 'https://cdn.myanimelist.net/images/anime/1000/110531.jpg' },
    { name: 'my-hero-academia.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
    { name: 'one-piece.jpg', url: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg' },
    { name: 'spy-family.jpg', url: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg' },
    { name: 'chainsaw-man.jpg', url: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg' },
    
    // Try these alternatives
    { name: 'black-clover.jpg', url: 'https://cdn.myanimelist.net/images/anime/1197/110531.jpg' },
    { name: 'naruto-shippuden.jpg', url: 'https://cdn.myanimelist.net/images/anime/5/51488.jpg' },
    { name: 'dragon-ball-super.jpg', url: 'https://cdn.myanimelist.net/images/anime/2/73161.jpg' },
    { name: 'solo-leveling.jpg', url: 'https://cdn.myanimelist.net/images/anime/1989/129516.jpg' },
    { name: 'frieren.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/141180.jpg' },
  ];

  console.log('Downloading anime images...\n');
  
  for (const img of images) {
    if (await download(img.url, img.name)) {
      // Success, skip other tries
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\nDone!');
}

main();

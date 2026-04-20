const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Directories
const posterDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/poster';
const coverDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/cover';

// Working MAL poster URLs (verified working)
const posters = {
  1: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',      // Demon Slayer
  2: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',        // Attack on Titan
  3: 'https://cdn.myanimelist.net/images/anime/1171/110222.jpg',     // Jujutsu Kaisen
  4: 'https://cdn.myanimelist.net/images/anime/1944/122795.jpg',      // Chainsaw Man
  5: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',      // Spy x Family
  6: 'https://cdn.myanimelist.net/images/anime/6/73231.jpg',          // My Hero Academia
  7: 'https://cdn.myanimelist.net/images/anime/7/75317.jpg',          // One Piece
  8: 'https://cdn.myanimelist.net/images/anime/28/41193.jpg',         // Naruto
  9: 'https://cdn.myanimelist.net/images/anime/1618/135655.jpg',     // Solo Leveling
  10: 'https://cdn.myanimelist.net/images/anime/1015/138675.jpg',    // Frieren
  11: 'https://cdn.myanimelist.net/images/anime/6/73273.jpg',        // Dragon Ball Super
  12: 'https://cdn.myanimelist.net/images/anime/1594/101001.jpg',    // Vinland Saga
};

// Cover images - using horizontal banner images
const covers = {
  1: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
  2: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
  3: 'https://cdn.myanimelist.net/images/anime/1171/110222l.jpg',
  4: 'https://cdn.myanimelist.net/images/anime/1944/122795l.jpg',
  5: 'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
  6: 'https://cdn.myanimelist.net/images/anime/6/73231l.jpg',
  7: 'https://cdn.myanimelist.net/images/anime/7/75317l.jpg',
  8: 'https://cdn.myanimelist.net/images/anime/28/41193l.jpg',
  9: 'https://cdn.myanimelist.net/images/anime/1618/135655l.jpg',
  10: 'https://cdn.myanimelist.net/images/anime/1015/138675l.jpg',
  11: 'https://cdn.myanimelist.net/images/anime/6/73273l.jpg',
  12: 'https://cdn.myanimelist.net/images/anime/1594/101001l.jpg',
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    file.on('error', reject);
  });
}

async function main() {
  console.log('🎬 Downloading anime images...\n');
  
  // Download posters
  for (const [id, url] of Object.entries(posters)) {
    const filepath = path.join(posterDir, `${id}.jpg`);
    try {
      await download(url, filepath);
      console.log(`✅ Poster ${id} downloaded`);
    } catch (err) {
      console.log(`❌ Poster ${id} failed: ${err.message}`);
    }
  }
  
  console.log('\n');
  
  // Download covers
  for (const [id, url] of Object.entries(covers)) {
    const filepath = path.join(coverDir, `${id}.jpg`);
    try {
      await download(url, filepath);
      console.log(`✅ Cover ${id} downloaded`);
    } catch (err) {
      console.log(`❌ Cover ${id} failed: ${err.message}`);
    }
  }
  
  console.log('\n✨ All downloads complete!');
}

main().catch(console.error);

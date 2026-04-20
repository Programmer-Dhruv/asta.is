const fs = require('fs');
const https = require('https');
const path = require('path');

const posterDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/poster';
const coverDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images/cover';

// Alternative working URLs for failed images
const altPosters = {
  3: 'https://cdn.myanimelist.net/r/100x128/images/anime/1171/110222.jpg', // JJK
  4: 'https://cdn.myanimelist.net/r/100x128/images/anime/1944/141810.jpg',  // Chainsaw Man
  6: 'https://cdn.myanimelist.net/r/100x128/images/anime/1944/127308.jpg',  // My Hero Academia
  8: 'https://cdn.myanimelist.net/r/100x128/images/anime/28/41193.jpg',      // Naruto
  9: 'https://cdn.myanimelist.net/r/100x128/images/anime/1618/135655.jpg',   // Solo Leveling
  10: 'https://cdn.myanimelist.net/r/100x128/images/anime/1015/138675.jpg',  // Frieren
  11: 'https://cdn.myanimelist.net/r/100x128/images/anime/5/73103.jpg',      // Dragon Ball Super
  12: 'https://cdn.myanimelist.net/r/100x128/images/anime/1594/101001.jpg',  // Vinland Saga
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, {
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
    }).on('error', reject);
    file.on('error', reject);
  });
}

async function main() {
  console.log('🔄 Retrying failed downloads...\n');
  
  for (const [id, url] of Object.entries(altPosters)) {
    const posterPath = path.join(posterDir, `${id}.jpg`);
    const coverPath = path.join(coverDir, `${id}.jpg`);
    
    try {
      await download(url, posterPath);
      console.log(`✅ Poster ${id} downloaded`);
      
      // Cover same image
      await download(url, coverPath);
      console.log(`✅ Cover ${id} downloaded`);
    } catch (err) {
      console.log(`❌ ID ${id} failed: ${err.message}`);
    }
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);

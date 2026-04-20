import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, 'src', 'assets', 'images');

// Ensure directories exist
const dirs = ['poster', 'related', 'episodes', 'cover'];
dirs.forEach(dir => {
  const dirPath = path.join(imagesDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  console.log(`Directory ready: ${dir}`);
});

// Anime images from MyAnimeList CDN
const images = [
  // Main anime posters
  { name: 'poster/1.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { name: 'poster/2.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg' },
  { name: 'poster/3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg' },
  { name: 'poster/4.jpg', url: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg' },
  { name: 'poster/5.jpg', url: 'https://cdn.myanimelist.net/images/anime/1641/122795.jpg' },
  { name: 'poster/6.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
  { name: 'poster/7.jpg', url: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg' },
  { name: 'poster/8.jpg', url: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg' },
  { name: 'poster/9.jpg', url: 'https://cdn.myanimelist.net/images/anime/1005/138006.jpg' },
  { name: 'poster/10.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/138672.jpg' },
  { name: 'poster/11.jpg', url: 'https://cdn.myanimelist.net/images/anime/3/77057.jpg' },
  { name: 'poster/12.jpg', url: 'https://cdn.myanimelist.net/images/anime/1014/99407.jpg' },
  
  // Anime covers
  { name: 'cover/1.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg' },
  { name: 'cover/2.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg' },
  { name: 'cover/3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' },
  { name: 'cover/4.jpg', url: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg' },
  { name: 'cover/5.jpg', url: 'https://cdn.myanimelist.net/images/anime/1641/122795l.jpg' },
  { name: 'cover/6.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg' },
  { name: 'cover/7.jpg', url: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg' },
  { name: 'cover/8.jpg', url: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg' },
  { name: 'cover/9.jpg', url: 'https://cdn.myanimelist.net/images/anime/1005/138006l.jpg' },
  { name: 'cover/10.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/138672l.jpg' },
  { name: 'cover/11.jpg', url: 'https://cdn.myanimelist.net/images/anime/3/77057l.jpg' },
  { name: 'cover/12.jpg', url: 'https://cdn.myanimelist.net/images/anime/1014/99407l.jpg' },
  
  // Related anime
  { name: 'related/1.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg' },
  { name: 'related/2.jpg', url: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg' },
  { name: 'related/3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg' },
  { name: 'related/4.jpg', url: 'https://cdn.myanimelist.net/images/anime/1641/122795.jpg' },
  { name: 'related/5.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
  
  // Episode thumbnails
  { name: 'episodes/ep-thumb.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
];

function downloadImage(image) {
  return new Promise((resolve) => {
    const filePath = path.join(imagesDir, image.name);
    
    if (fs.existsSync(filePath)) {
      resolve();
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    console.log(`Downloading: ${image.name}`);
    
    const request = https.get(image.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.on('error', () => {
      file.close();
      resolve();
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve();
    });
  });
}

async function downloadAll() {
  console.log('Downloading images...\n');
  
  for (const image of images) {
    await downloadImage(image);
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n✓ All downloads complete!');
}

downloadAll().catch(console.error);

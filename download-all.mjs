import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, 'src', 'assets', 'images');

// Ensure directories exist
const dirs = ['poster', 'related', 'episodes', 'avatars'];
dirs.forEach(dir => {
  const dirPath = path.join(imagesDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  console.log(`Directory: ${dirPath}`);
});

// Anime images to download
const images = [
  // Main poster
  { name: 'poster/demonslayer-poster.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  
  // Cover/Banner
  { name: 'poster/demonslayer-cover.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg' },
  
  // Related anime
  { name: 'related/attackontitan.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg' },
  { name: 'related/jujutsu.jpg', url: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg' },
  { name: 'related/chainsaw.jpg', url: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg' },
  { name: 'related/spyfamily.jpg', url: 'https://cdn.myanimelist.net/images/anime/1641/122795.jpg' },
  { name: 'related/myheroacademia.jpg', url: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
  
  // Episode thumbnails (Season 1)
  { name: 'episodes/s1-e01.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { name: 'episodes/s1-e02.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { name: 'episodes/s1-e03.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { name: 'episodes/s1-e04.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { name: 'episodes/s1-e05.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
  { name: 'episodes/s1-e06.jpg', url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg' },
];

function downloadImage(image) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, image.name);
    const file = fs.createWriteStream(filePath);
    
    console.log(`Downloading: ${image.name}`);
    
    const protocol = image.url.startsWith('https') ? https : http;
    
    const request = protocol.get(image.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        console.log(`Redirecting to: ${redirectUrl}`);
        downloadFromUrl(redirectUrl, file, resolve, reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${image.name}`);
          resolve();
        });
      }
    });
    
    request.on('error', (err) => {
      console.error(`Error downloading ${image.name}:`, err.message);
      file.close();
      resolve(); // Continue with other downloads
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      console.log(`Timeout: ${image.name}`);
      resolve();
    });
  });
}

function downloadFromUrl(url, file, resolve, reject) {
  const protocol = url.startsWith('https') ? https : http;
  
  const request = protocol.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      resolve();
    });
  });
  
  request.on('error', (err) => {
    console.error('Error:', err.message);
    file.close();
    resolve();
  });
}

// Download all images
async function downloadAll() {
  console.log('Starting downloads...\n');
  
  for (const image of images) {
    await downloadImage(image);
    await new Promise(r => setTimeout(r, 500)); // Delay between requests
  }
  
  console.log('\nAll downloads complete!');
  console.log('Files saved to:', imagesDir);
  
  // List downloaded files
  console.log('\nDownloaded files:');
  dirs.forEach(dir => {
    const dirPath = path.join(imagesDir, dir);
    const files = fs.readdirSync(dirPath);
    files.forEach(f => console.log(`  ${dir}/${f}`));
  });
}

downloadAll().catch(console.error);

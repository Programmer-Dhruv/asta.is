// Create anime-themed SVG placeholders
const fs = require('fs');

const baseDir = 'C:/Users/devel/Desktop/asta.is/public/assets/images';
const posterDir = `${baseDir}/poster`;
const coverDir = `${baseDir}/cover`;

// Anime data for unique placeholders
const animeData = [
  { id: 1, title: 'Demon Slayer', color: '#da5c5c', symbol: '🔥' },
  { id: 2, title: 'Attack on Titan', color: '#5c7cda', symbol: '⚔️' },
  { id: 3, title: 'Jujutsu Kaisen', color: '#8458da', symbol: '👁️' },
  { id: 4, title: 'Chainsaw Man', color: '#da5c5c', symbol: '⚡' },
  { id: 5, title: 'Spy x Family', color: '#5cdac7', symbol: '🎯' },
  { id: 6, title: 'My Hero Academia', color: '#da8c5c', symbol: '💪' },
  { id: 7, title: 'One Piece', color: '#da5c5c', symbol: '🏴' },
  { id: 8, title: 'Naruto', color: '#daa55c', symbol: '🍥' },
  { id: 9, title: 'Solo Leveling', color: '#5c8cda', symbol: '⚔️' },
  { id: 10, title: 'Frieren', color: '#8c5cda', symbol: '✨' },
  { id: 11, title: 'Dragon Ball', color: '#5c9cda', symbol: '🐉' },
  { id: 12, title: 'Vinland Saga', color: '#5cbed4', symbol: '⚔️' },
];

// Create poster SVG (vertical)
function createPosterSvg(anime, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="225" height="320" viewBox="0 0 225 320">
  <defs>
    <linearGradient id="grad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${anime.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
    <filter id="glow${id}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="225" height="320" fill="url(#grad${id})"/>
  <rect x="4" y="4" width="217" height="312" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" rx="8"/>
  <text x="112.5" y="145" text-anchor="middle" font-size="48" filter="url(#glow${id})">${anime.symbol}</text>
  <text x="112.5" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">${anime.title}</text>
  <text x="112.5" y="245" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="rgba(255,255,255,0.6)">ASTA.IS</text>
</svg>`;
}

// Create cover SVG (horizontal)
function createCoverSvg(anime, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
  <defs>
    <linearGradient id="gradC${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${anime.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
    <filter id="glowC${id}">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="400" height="225" fill="url(#gradC${id})"/>
  <rect x="4" y="4" width="392" height="217" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" rx="8"/>
  <text x="200" y="100" text-anchor="middle" font-size="64" filter="url(#glowC${id})">${anime.symbol}</text>
  <text x="200" y="155" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">${anime.title}</text>
  <text x="200" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.6)">Stream on ASTA.IS</text>
</svg>`;
}

// Generate all placeholders
animeData.forEach(anime => {
  // Create poster
  fs.writeFileSync(`${posterDir}/${anime.id}.svg`, createPosterSvg(anime, anime.id));
  console.log(`Created poster: ${anime.id}.svg`);
  
  // Create cover
  fs.writeFileSync(`${coverDir}/${anime.id}.svg`, createCoverSvg(anime, anime.id));
  console.log(`Created cover: ${anime.id}.svg`);
});

console.log('All SVG placeholders created!');

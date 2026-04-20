import React from 'react'

// Image paths - using direct /images/ path for public folder
export const heroImage = '/images/hero.jpg'
export const card1Image = '/images/card1.webp'
export const card2Image = '/images/card2.webp'
export const grid1Image = '/images/grid1.webp'
export const grid2Image = '/images/grid2.webp'
export const grid3Image = '/images/grid3.webp'
export const grid4Image = '/images/grid4.webp'
export const trend1Image = '/images/trend1.webp'
export const trend2Image = '/images/trend2.webp'
export const trend3Image = '/images/trend3.webp'
export const trend4Image = '/images/trend4.webp'
export const spyfamilyImage = '/images/spyfamily.webp'
export const astaImage = '/assets/images/Asta-PNG-Picture.png'

// Anime data with image paths
export const showcaseAnime = [
  { id: 1, title: 'Black Clover', img: grid1Image, color: '#da5c5c' },
  { id: 2, title: 'Demon Slayer', img: grid2Image, color: '#da7c5c' },
  { id: 3, title: 'Jujutsu Kaisen', img: grid3Image, color: '#8458da' },
  { id: 4, title: 'One Piece', img: grid4Image, color: '#5cdac7' },
  { id: 5, title: 'Spy x Family', img: spyfamilyImage, color: '#5c9cda' },
  { id: 6, title: 'Chainsaw Man', img: card1Image, color: '#da5c8c' },
]

export const trendingAnime = [
  { rank: 1, title: 'Solo Leveling', episodes: '12 eps', img: trend1Image },
  { rank: 2, title: 'Jujutsu Kaisen S2', episodes: '23 eps', img: trend2Image },
  { rank: 3, title: 'Frieren', episodes: '24 eps', img: trend3Image },
  { rank: 4, title: 'Chainsaw Man', episodes: '12 eps', img: trend4Image },
]

export const heroCards = [
  { title: 'Demon Slayer', sub: 'S1-E26', img: card1Image },
  { title: 'Attack on Titan', sub: 'S4-E16', img: card2Image },
]

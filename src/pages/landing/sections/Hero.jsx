import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const Hero = () => {
  const containerRef = useRef(null)
  const characterRef = useRef(null)
  const [particles, setParticles] = useState([])
  
  // Generate random particles on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 6
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    let mouseX = 0
    let mouseY = 0
    let charX = 0
    let charY = 0
    
    const handleMouseMove = (e) => {
      // Normalize mouse position (-1 to 1)
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      
      // Parallax scroll effect
      if (containerRef.current) {
        const sections = containerRef.current.querySelectorAll('[data-depth]')
        sections.forEach(section => {
          const depth = parseFloat(section.dataset.depth)
          section.style.transform = `translateY(${scrollY * depth}px)`
        })
      }
      
      // Character vertical movement on scroll
      if (characterRef.current) {
        characterRef.current.style.transform = `
          translateY(${scrollY * 0.15}px)
          translateZ(150px)
        `
      }
    }

    // Smooth character follow
    const animate = () => {
      if (characterRef.current) {
        charX += (mouseX * 30 - charX) * 0.05
        charY += (mouseY * 30 - charY) * 0.05
        
        characterRef.current.style.transform = `
          translateY(${window.scrollY * 0.15}px)
          translateX(${charX}px)
          translateZ(150px)
          rotateY(${mouseX * 5}deg)
          rotateX(${-mouseY * 5}deg)
        `
      }
      requestAnimationFrame(animate)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div ref={containerRef} className="hero-container">
      
      {/* === BACKGROUND LAYERS === */}
      <div className="hero-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          />
        ))}
      </div>
      
      <div className="hero-glow-orb purple" data-depth="0.2" />
      <div className="hero-glow-orb pink" data-depth="0.3" />
      
      {/* === MAIN CONTENT === */}
      <div className="hero-content">
        
        {/* Text Section */}
        <div className="hero-text">
          <div className="hero-badge">
            <span>Now Streaming</span>
          </div>
          
          <h1 className="hero-title">
            ASTA<span>.IS</span>
          </h1>
          
          <p className="hero-subtitle">
            Enter the ultimate anime experience. 
            Cinematic visuals. Immersive atmosphere.
            Your gateway to extraordinary worlds.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Start Watching
            </button>
            <button className="btn-secondary">
              Explore Library
            </button>
          </div>
        </div>
        
        {/* Character Visual */}
        <div className="hero-visual">
          <div ref={characterRef} className="character-wrapper">
            <div className="character-glow" />
            <img 
              src="/assets/images/Asta-PNG-Picture.png" 
              alt="Asta - Black Clover" 
              className="character-img"
            />
            
            {/* Floating UI Elements */}
            <div className="floating-element top-left">
              ⚔️ Black Clover
            </div>
            <div className="floating-element bottom-right">
              💫 Anti-Magic
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>SCROLL</span>
      </div>
      
    </div>
  )
}

export default Hero

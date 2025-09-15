import { useState, useEffect } from 'react';
import tapes from '../data/beat_tapes.json';

export default function BeatTapesGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTape = tapes[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? tapes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === tapes.length - 1 ? 0 : prev + 1));
  };

  if (!tapes.length) {
    return null; // Don't render anything if there are no tapes
  }

  return (
    <section id="beat-tapes" className="section hex">
      <div className="container">
        <div className="kicker">Beat Tapes</div>
        <h2 className="headline">Album-Ready Beat Packs</h2>
        <div className="underline" />
        <p className="subtle" style={{ maxWidth: 720, margin: '0 auto 28px', textAlign: 'center' }}>
          For serious artists and labels. Get a curated pack of 10 exclusive, Diamond-tier beats for a fraction of the individual price.
        </p>

        <div className="tape-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <button onClick={handlePrev} className="nav-btn" style={{ flexShrink: 0 }}>&lt;</button>
          
          <div className="tape-display" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'center', background: '#141416', padding: '24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <div className="tape-artwork-wrapper" style={{ width: '300px', height: '300px', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: '#2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Placeholder for artwork image */}
              <img src={currentTape.artwork} alt={`${currentTape.name} cover art`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
            </div>
            <div className="tape-info">
              <h3 style={{ marginTop: 0, color: 'var(--accent)' }}>{currentTape.name}</h3>
              <p style={{ color: 'var(--text)' }}>{currentTape.description}</p>
              <ul style={{ paddingLeft: '20px', color: 'var(--muted)', columns: 2 }}>
                <li>10 Exclusive Beats</li>
                <li>Unlimited Rights</li>
                <li>WAV Files & Stems</li>
                <li>BPM Range: {currentTape.bpm_range}</li>
                <li>Genres: {currentTape.genre.join(', ')}</li>
              </ul>
              <div className="price-comparison" style={{ marginTop: '16px' }}>
                <strong style={{ fontSize: '24px' }}>Package Price: ${currentTape.price}</strong>
                <p className="subtle" style={{ margin: 0 }}>(Over 55% off the individual Diamond license price of $4400)</p>
              </div>
            </div>
          </div>

          <button onClick={handleNext} className="nav-btn" style={{ flexShrink: 0 }}>&gt;</button>
        </div>
      </div>
    </section>
  );
}

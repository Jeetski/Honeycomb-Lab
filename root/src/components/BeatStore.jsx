import { memo, useState, useEffect, useRef } from 'react';
import './BeatStore.css';
import beatsData from '../data/beats.json';

function CompareLicensesModal({ onClose, endsInText }) {
  const sharedText = 'All licenses are non-exclusive unless stated otherwise. All licenses include a 50/50 songwriting split. Artist owns the final song master. Producer and artist share songwriting credit equally.';
  const iconStyle = { width: 36, height: 36, objectFit: 'contain', display: 'block' };
  return (
    <div className="cmp-backdrop" onClick={onClose}>
      <div className="cmp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmp-head">
          <h3>Compare Licenses</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/ribbon.png" alt="" aria-hidden="true" className="cmp-ribbon" />
            <span style={{ background: 'var(--accent)', color: '#111', fontWeight: 900, padding: '4px 8px', borderRadius: '999px', fontSize: '12px' }} aria-label="Summer sale 33 percent off">33% OFF</span>
            {endsInText && <small aria-live="polite" style={{ color: 'var(--muted)' }}>{endsInText}</small>}
          </div>
          <button type="button" className="cmp-close" onClick={onClose}>&times;</button>
        </div>
        <div className="cmp-body" style={{ gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'stretch' }}>
          <div className="cmp-col" style={{ borderTop: '3px solid #C0C0C0' }}>
            <h4 style={{ color: '#C0C0C0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/licenses/Silver_No_Background.png" alt="" aria-hidden="true" style={iconStyle} />
              Silver
            </h4>
            <strong>WAV License</strong>
            <div className="price" style={{margin: '8px 0 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
              <span style={{textDecoration:'line-through', color:'var(--muted)', fontWeight:700}}>$44</span>
              <span style={{color:'var(--accent)', fontWeight:900, fontSize:'20px'}}>$29</span>
              <span
                className="cmp-badge"
                aria-label="Indie release"
                style={{ position: 'static', top: 'auto', right: 'auto', boxShadow: 'none', display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}
              >
                Indie Release
              </span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>For independent creators starting out</div>
            <ul className="cmp-list">
              <li>High-quality WAV file</li>
              <li>Unlimited modifications</li>
              <li>Up to 50,000 streams</li>
              <li>Up to 5 radio stations</li>
              <li>50/50 sync royalties (standard producer split)</li>
              <li>Tagged</li>
              <li>Credit required: Prod. by Honeycomb Lab</li>
            </ul>
          </div>
          <div className="cmp-col" style={{ borderTop: '3px solid #b76e79' }}>
            <h4 style={{ color: '#b76e79', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/licenses/Rose-Gold_No_Background.png" alt="" aria-hidden="true" style={iconStyle} />
              Rose Gold
            </h4>
            <strong>WAV License</strong>
            <div className="price" style={{margin: '8px 0 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
              <span style={{textDecoration:'line-through', color:'var(--muted)', fontWeight:700}}>$89</span>
              <span style={{color:'var(--accent)', fontWeight:900, fontSize:'20px'}}>$59</span>
              <span
                className="cmp-badge"
                aria-label="Commercial release"
                style={{ position: 'static', top: 'auto', right: 'auto', boxShadow: 'none', display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}
              >
                Commercial Release
              </span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>For artists ready to release commercially</div>
            <ul className="cmp-list">
              <li>High-quality WAV file</li>
              <li>Unlimited modifications</li>
              <li>Up to 100,000 streams</li>
              <li>Up to 10 radio stations</li>
              <li>Keep 100% of your song's master sync royalties</li>
              <li>Tag optional</li>
              <li>Credit required: Prod. by Honeycomb Lab</li>
            </ul>
          </div>
          <div className="cmp-col" style={{ borderTop: '3px solid #00b5e2' }}>
            <h4 style={{ color: '#00b5e2', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/licenses/Diamond_No_Background.png" alt="" aria-hidden="true" style={iconStyle} />
              Diamond
            </h4>
            <strong>Unlimited Use License</strong>
            <div className="price" style={{margin: '8px 0 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
              <span style={{textDecoration:'line-through', color:'var(--muted)', fontWeight:700}}>$440</span>
              <span style={{textDecoration:'line-through', color:'var(--muted)', fontWeight:800}}>$293</span>
              <span style={{color:'#ff5a5a', fontWeight:900, fontSize:'20px'}}>$146.50</span>
              <span style={{ background: 'rgba(255,90,90,0.16)', color: '#ff8f8f', border: '1px solid rgba(255,90,90,0.35)', fontWeight: 800, padding: '2px 8px', borderRadius: 999, fontSize: 11 }}>
                Use code VIP50
              </span>
              <span
                className="cmp-badge"
                aria-label="Major or label release"
                style={{ position: 'static', top: 'auto', right: 'auto', boxShadow: 'none', display: 'inline-flex', alignItems: 'center', marginLeft: 'auto' }}
              >
                Major Release
              </span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>Full creative control</div>
            <ul className="cmp-list">
              <li>WAV file & track stems</li>
              <li>Unlimited modifications</li>
              <li>Unlimited streams</li>
              <li>Unlimited radio stations</li>
              <li>Keep 100% of your song's master sync royalties</li>
              <li>Get your song featured on our website</li>
              <li>Tag optional</li>
              <li>Credit optional</li>
            </ul>
          </div>
          <div className="cmp-info" role="note" style={{ gridColumn: '1 / -1' }}>{sharedText}</div>
        </div>
      </div>
    </div>
  );
}
import HexGallery from './HexGallery';
// import BeatTapesGallery from './BeatTapesGallery';

const SenderFormEmbed = memo(function SenderFormEmbed() {
  return (
    <div
      style={{ textAlign: 'left', maxWidth: 560, margin: '0' }}
      className="sender-form-field"
      data-sender-form-id="epYnDX"
      aria-live="polite"
    />
  );
}, () => true);

const LEAD_MAGNETS = [
  {
    id: 'honey',
    src: '/Honey.png',
    alt: 'Honey FX tool preview',
    label: '"Honey" Multi-FX Synthesizer preset for FL Studio',
  },
  {
    id: 'starter-pack',
    src: '/Starter_Pack.jpg',
    alt: "Beginner's Starter Pack lead magnet preview",
    label: "Beginner's Starter Pack - From Zero to Hero",
  },
];

const SECTION_ALIASES = {
  tracks: 'player',
  latest: 'player',
  'latest-tracks': 'player',
  beats: 'player',
  producer: 'about',
  artists: 'team',
  email: 'subscribe',
  contact: 'subscribe',
  shop: 'merch',
};

const MERCH_ITEMS = [
  {
    id: 'tee-white',
    title: "Originals White • I'M NOT A RAPPER. | Honeycomb Lab Premium Tee",
    defaultSize: 'M',
    priceBySize: {
      XS: 37.0,
      S: 37.0,
      M: 37.0,
      L: 37.0,
      XL: 37.0,
      '2XL': 37.0,
      '3XL': 38.5,
      '4XL': 40.5,
      '5XL': 46.0,
    },
    color: 'White',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    sizeLabel: 'Sizes: XS-5XL',
    primaryImage: '/merch/tees/i%27m_not_a_rapper/white_front_back.png',
    secondaryImage: '/merch/tees/i%27m_not_a_rapper/white_front.png',
    shortLabel: 'White Tee',
  },
  {
    id: 'tee-black',
    title: "Originals Black • I'M NOT A RAPPER. | Honeycomb Lab Premium Tee",
    defaultSize: 'M',
    priceBySize: {
      XS: 37.0,
      S: 37.0,
      M: 37.0,
      L: 37.0,
      XL: 37.0,
      '2XL': 37.0,
      '3XL': 38.5,
      '4XL': 40.5,
      '5XL': 46.0,
    },
    color: 'Black',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    sizeLabel: 'Sizes: XS-5XL',
    primaryImage: '/merch/tees/i%27m_not_a_rapper/black_front_back.png',
    secondaryImage: '/merch/tees/i%27m_not_a_rapper/black_front.png',
    shortLabel: 'Black Tee',
  },
  {
    id: 'snapback-black-originals',
    title: 'Originals Black | Honeycomb Lab Premium Snapback',
    priceEuro: 31.5,
    color: 'Black',
    sizes: ['One size'],
    defaultSize: 'One size',
    sizeLabel: 'Size: One size',
    primaryImage: '/merch/snapbacks/black_originals/front.png',
    secondaryImage: '/merch/snapbacks/black_originals/model.png',
    shortLabel: 'Snapback',
  },
  {
    id: 'bandana-black-originals',
    title: 'Originals Black | Honeycomb Lab Premium Bandana',
    priceEuro: 26.0,
    color: 'Black',
    sizes: ['S', 'M', 'L'],
    defaultSize: 'M',
    sizeLabel: 'Sizes: S-M-L',
    primaryImage: '/merch/bandanas/black/folded-close-up.png',
    secondaryImage: '/merch/bandanas/black/model.png',
    shortLabel: 'Bandana',
  },
  {
    id: 'bandana-pattern-originals',
    title: 'Originals Pattern | Honeycomb Lab Premium Bandana',
    priceEuro: 26.0,
    color: 'Pattern',
    sizes: ['S', 'M', 'L'],
    defaultSize: 'M',
    sizeLabel: 'Sizes: S-M-L',
    primaryImage: '/merch/bandanas/pattern/folded-close-up.png',
    secondaryImage: '/merch/bandanas/pattern/model.png',
    shortLabel: 'Pattern Bandana',
  },
  {
    id: 'corduroy-hat-black-originals',
    title: 'Originals Black | Honeycomb Lab Premium Corduroy Hat',
    priceEuro: 33.5,
    color: 'Black',
    sizes: ['One size'],
    defaultSize: 'One size',
    sizeLabel: 'Size: One size',
    primaryImage: '/merch/corduroy hats/black/front.png',
    secondaryImage: '/merch/corduroy hats/black/model.png',
    shortLabel: 'Corduroy Hat',
  },
];

const normalizeHashToken = (value) => String(value || '')
  .toLowerCase()
  .replace(/^#/, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export default function BeatStore() {
  const currentYear = new Date().getFullYear();
  const showcaseVideos = [
    {
      id: '3z_ZIKVgems',
      title: 'HIXXEL - SUPERMAN (BG Remix) Lyric Video',
    },
    {
      id: 'RxSz-jZJjKU',
      title: 'Ky Steezy - STZYWRLD [Official Audio]',
    },
  ];
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(null);
  const [requestedBeatId, setRequestedBeatId] = useState(null);
  const audioRef = useRef(null);
  const downloadingRef = useRef(false);
  const [miniPlaying, setMiniPlaying] = useState(false);
  const [miniCurrentTime, setMiniCurrentTime] = useState(0);
  const [miniDuration, setMiniDuration] = useState(0);
  const [miniMuted, setMiniMuted] = useState(false);
  const [miniVolume, setMiniVolume] = useState(1);
  const [miniLoop, setMiniLoop] = useState(false);
  const [miniCollapsed, setMiniCollapsed] = useState(false);
  const [miniDesktop, setMiniDesktop] = useState(false);
  const [miniPosition, setMiniPosition] = useState({ x: 0, y: 0 });
  const beatByTokenRef = useRef(null);
  const miniPlayerRef = useRef(null);
  const miniDragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });
  const miniPositionReadyRef = useRef(false);
  const miniQueue = (Array.isArray(beatsData) ? beatsData : []).filter((beat) => Boolean(beat?.preview));
  // Reviews slider state
  const reviews = [
    {
      name: 'HIXXEL',
      avatar: '/HIXXEL.png',
      quote: "You don't just hear his beats, you feel his heartbeat inside them! Truly a man of culture!",
      link: { label: 'Check out his bangers!', url: 'https://www.youtube.com/@HIXXEL_SM' },
    },
    {
      name: 'Malkiq_Golqm',
      avatar: '/Malkiq_Golqm.jpg',
      quote: 'David is the best producer I know. Making really good beats very fast and perfectly professionally done!',
      link: { label: 'Check out his bangers!', url: 'https://www.youtube.com/@VoininaHrista' },
    },
    {
      name: 'Dabuzy',
      avatar: '/Dabuzy.jpg',
      quote: 'An experimental escape from reality. Within but also without. A melodic combustion of creativity.',
    },
  ];
  const [reviewIndex, setReviewIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setReviewIndex((i) => (i + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(id);
  }, [reviews.length]);

  // Render review quotes with selective emphasis
  const renderQuote = (r) => {
    const text = r.quote || '';
    if (r.name === 'Malkiq_Golqm') {
      const i = text.indexOf('.');
      if (i !== -1) {
        const first = text.slice(0, i + 1);
        const rest = text.slice(i + 1);
        return (<><strong>{first}</strong>{rest}</>);
      }
      return (<strong>{text}</strong>);
    }
    if (r.name === 'Dabuzy') {
      const phrase = 'A melodic combustion of creativity.';
      const k = text.indexOf(phrase);
      if (k !== -1) {
        const before = text.slice(0, k);
        const mid = phrase;
        const after = text.slice(k + phrase.length);
        return (<>{before}<strong>{mid}</strong>{after}</>);
      }
      return text;
    }
    if (r.name === 'HIXXEL') {
      const target = 'you feel his heartbeat inside them';
      const lower = text.toLowerCase();
      const j = lower.indexOf(target);
      if (j !== -1) {
        const before = text.slice(0, j);
        const mid = text.slice(j, j + target.length);
        const after = text.slice(j + target.length);
        return (<>{before}<strong>{mid}</strong>{after}</>);
      }
      return text;
    }
    return text;
  };

  const formatMetaLabel = (value) => String(value || '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const formatTime = (seconds) => {
    const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const mm = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (!beatByTokenRef.current) {
    const map = new Map();
    for (const beat of (Array.isArray(beatsData) ? beatsData : [])) {
      const tokens = new Set([
        normalizeHashToken(beat?.id),
        normalizeHashToken(beat?.title),
      ]);
      for (const token of tokens) {
        if (token) map.set(token, beat);
      }
    }
    beatByTokenRef.current = map;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    setShowWelcome(true);
  };
  // Launch sale countdown timer
  const [nowTs, setNowTs] = useState(() => Date.now());
  // Deadline: 2 months from initial page load
  const launchDeadlineRef = useRef(null);
  if (!launchDeadlineRef.current) {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    launchDeadlineRef.current = d.getTime();
  }
  const launchDeadlineTs = launchDeadlineRef.current;
  const msLeft = Math.max(0, launchDeadlineTs - nowTs);
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minMs = 60 * 1000;
  const days = Math.floor(msLeft / dayMs);
  const hours = Math.floor((msLeft % dayMs) / hourMs);
  const minutes = Math.floor((msLeft % hourMs) / minMs);
  const seconds = Math.floor((msLeft % minMs) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  const [magnetIndex, setMagnetIndex] = useState(0);
  useEffect(() => {
    if (LEAD_MAGNETS.length < 2) return undefined;
    const id = setInterval(() => {
      setMagnetIndex((i) => (i + 1) % LEAD_MAGNETS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);
  const activeMagnet = LEAD_MAGNETS[magnetIndex];
  const saleActive = msLeft > 0;
  const endsInText = saleActive
    ? `Ends in ${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    : 'Sale ended';
  // Tick the sale timer every second
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  // Build a robust mailto link with proper URL encoding
  const email = 'contact@honeycomblab.art';
  const subject = encodeURIComponent('Contact - Honeycomb Lab');
  const body = encodeURIComponent('Hi Honeycomb Lab,\n\n');
  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;

  // Contact dropdown state/behavior
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const contactRef = useRef(null);
  // More dropdown
  const [moreOpen, setMoreOpen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedShowcaseVideoId, setSelectedShowcaseVideoId] = useState(showcaseVideos[0].id);
  const moreRef = useRef(null);
  const selectedShowcaseVideo = showcaseVideos.find((v) => v.id === selectedShowcaseVideoId) || showcaseVideos[0];

  const handleHashNavigation = () => {
    if (typeof window === 'undefined') return;
    const raw = window.location.hash || '';
    const token = normalizeHashToken(raw);
    if (!token) return;

    const sectionId = SECTION_ALIASES[token] || token;
    const sectionEl = document.getElementById(sectionId);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const beat = beatByTokenRef.current?.get(token);
    if (beat) {
      setRequestedBeatId(beat.id);
      setCurrentBeat(beat);
      const playerEl = document.getElementById('player');
      if (playerEl) playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (contactRef.current && !contactRef.current.contains(e.target)) setContactOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onHashChange = () => handleHashNavigation();
    window.addEventListener('hashchange', onHashChange);
    const timer = setTimeout(() => handleHashNavigation(), 120);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {/* no-op */}
  };

  useEffect(() => {
    if (audioRef.current && currentBeat?.preview) {
      // Try to autoplay after user click; may be blocked until interaction
      const play = () => {
        const p = audioRef.current.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      }
      // Slight delay lets the source swap settle
      setTimeout(play, 50)
    }
  }, [currentBeat])

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncFromAudio = () => {
      setMiniPlaying(!audio.paused);
      setMiniCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setMiniDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setMiniMuted(Boolean(audio.muted));
      setMiniVolume(Number.isFinite(audio.volume) ? audio.volume : 1);
    };

    const onPlay = () => syncFromAudio();
    const onPause = () => syncFromAudio();
    const onTimeUpdate = () => syncFromAudio();
    const onLoadedMeta = () => syncFromAudio();
    const onEnded = () => syncFromAudio();
    const onSeeked = () => syncFromAudio();
    const onVolumeChange = () => {
      setMiniMuted(Boolean(audio.muted));
      setMiniVolume(Number.isFinite(audio.volume) ? audio.volume : 1);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('durationchange', onLoadedMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('seeked', onSeeked);
    audio.addEventListener('seeking', onSeeked);
    audio.addEventListener('volumechange', onVolumeChange);

    const syncTimer = setInterval(syncFromAudio, 200);
    syncFromAudio();

    return () => {
      clearInterval(syncTimer);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('durationchange', onLoadedMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('seeked', onSeeked);
      audio.removeEventListener('seeking', onSeeked);
      audio.removeEventListener('volumechange', onVolumeChange);
    };
  }, [currentBeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = miniLoop;
  }, [miniLoop, currentBeat]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const clampPosition = (x, y) => {
      const margin = 8;
      const width = miniPlayerRef.current?.offsetWidth || 214;
      const height = miniPlayerRef.current?.offsetHeight || 250;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const maxY = Math.max(margin, window.innerHeight - height - margin);
      return {
        x: Math.min(Math.max(margin, x), maxX),
        y: Math.min(Math.max(margin, y), maxY),
      };
    };

    const syncMiniViewportMode = () => {
      const isDesktop = window.innerWidth >= 900;
      setMiniDesktop(isDesktop);
      setMiniPosition((prev) => {
        if (!miniPositionReadyRef.current) {
          miniPositionReadyRef.current = true;
          const width = miniPlayerRef.current?.offsetWidth || 214;
          const height = miniPlayerRef.current?.offsetHeight || 250;
          return {
            x: Math.max(8, window.innerWidth - width - 16),
            y: Math.max(8, window.innerHeight - height - 16),
          };
        }
        if (!isDesktop) return prev;
        return clampPosition(prev.x, prev.y);
      });
    };

    syncMiniViewportMode();
    window.addEventListener('resize', syncMiniViewportMode);
    return () => window.removeEventListener('resize', syncMiniViewportMode);
  }, [miniCollapsed]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const clampPosition = (x, y) => {
      const margin = 8;
      const width = miniPlayerRef.current?.offsetWidth || 214;
      const height = miniPlayerRef.current?.offsetHeight || 250;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const maxY = Math.max(margin, window.innerHeight - height - margin);
      return {
        x: Math.min(Math.max(margin, x), maxX),
        y: Math.min(Math.max(margin, y), maxY),
      };
    };

    const handlePointerMove = (event) => {
      if (!miniDragRef.current.active || !miniDesktop || miniCollapsed) return;
      event.preventDefault();
      const nextX = event.clientX - miniDragRef.current.offsetX;
      const nextY = event.clientY - miniDragRef.current.offsetY;
      setMiniPosition(clampPosition(nextX, nextY));
    };

    const stopDrag = () => {
      miniDragRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
    };
  }, [miniDesktop, miniCollapsed]);

  const startMiniDrag = (event) => {
    if (!miniDesktop || miniCollapsed || event.button !== 0) return;
    const target = event.target;
    if (target instanceof Element) {
      const interactive = target.closest('button, a, input, select, textarea, label, [role="button"], [data-no-drag="true"]');
      if (interactive) return;
    }
    const panelRect = miniPlayerRef.current?.getBoundingClientRect();
    if (!panelRect) return;
    miniDragRef.current = {
      active: true,
      offsetX: event.clientX - panelRect.left,
      offsetY: event.clientY - panelRect.top,
    };
  };

  const toggleMiniPlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !currentBeat?.preview) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // no-op
      }
      return;
    }
    audio.pause();
  };

  const handleMiniSeek = (value) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(value);
    if (!Number.isFinite(next)) return;
    audio.currentTime = next;
    setMiniCurrentTime(next);
  };

  const setActiveMiniBeat = (beat) => {
    if (!beat) return;
    setCurrentBeat(beat);
    setRequestedBeatId(beat.id);
  };

  const playPreviousBeat = () => {
    if (!miniQueue.length) return;
    const idx = Math.max(0, miniQueue.findIndex((beat) => beat.id === currentBeat?.id));
    const prevIdx = (idx - 1 + miniQueue.length) % miniQueue.length;
    setActiveMiniBeat(miniQueue[prevIdx]);
  };

  const playNextBeat = () => {
    if (!miniQueue.length) return;
    const idx = Math.max(0, miniQueue.findIndex((beat) => beat.id === currentBeat?.id));
    const nextIdx = (idx + 1) % miniQueue.length;
    setActiveMiniBeat(miniQueue[nextIdx]);
  };

  const shuffleBeat = () => {
    if (!miniQueue.length) return;
    if (miniQueue.length === 1) {
      setActiveMiniBeat(miniQueue[0]);
      return;
    }
    const currentId = currentBeat?.id;
    let next = miniQueue[Math.floor(Math.random() * miniQueue.length)];
    while (next.id === currentId) {
      next = miniQueue[Math.floor(Math.random() * miniQueue.length)];
    }
    setActiveMiniBeat(next);
  };

  const toggleMiniLoop = () => setMiniLoop((prev) => !prev);

  const toggleMiniMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMiniMuted(audio.muted);
  };

  const handleMiniVolume = (value) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(value);
    if (!Number.isFinite(next)) return;
    audio.volume = Math.max(0, Math.min(1, next));
    if (audio.volume > 0 && audio.muted) audio.muted = false;
    setMiniVolume(audio.volume);
    setMiniMuted(audio.muted);
  };

  const jumpToMainPlayer = () => {
    const playerEl = document.getElementById('player');
    if (playerEl) playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDownload = async () => {
    if (!currentBeat?.preview || downloadingRef.current) return;
    try {
      downloadingRef.current = true;
      const resp = await fetch(currentBeat.preview);
      if (!resp.ok) throw new Error('Download failed');
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = (currentBeat.title || 'track') + '.mp3';
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      console.warn('Download error', e);
    } finally {
      downloadingRef.current = false;
    }
  };

  // Tier purchase handler: opens Stripe links if configured, else shows compare modal
  const handleBuy = (tier) => {
    if (!currentBeat) return;
    const links = currentBeat.priceLinks || {};
    const url = tier === 'silver' ? links.silver
              : tier === 'roseGold' ? links.roseGold
              : tier === 'diamond' ? links.diamond
              : '';
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setShowCompare(true);
    }
  };

  const [merchPreorder, setMerchPreorder] = useState(() => (
    MERCH_ITEMS.reduce((acc, item) => {
      acc[item.id] = { size: item.defaultSize || item.sizes[0] || 'One size', name: '', contact: '' };
      return acc;
    }, {})
  ));
  const [activeMerchIndex, setActiveMerchIndex] = useState(0);
  const [showAltMerchImage, setShowAltMerchImage] = useState(false);
  const [merchAutoScrollPaused, setMerchAutoScrollPaused] = useState(false);
  const activeMerch = MERCH_ITEMS[activeMerchIndex] || MERCH_ITEMS[0];
  const pauseMerchAutoScroll = () => setMerchAutoScrollPaused(true);

  useEffect(() => {
    setShowAltMerchImage(false);
  }, [activeMerchIndex]);

  useEffect(() => {
    if (merchAutoScrollPaused) return undefined;
    if (MERCH_ITEMS.length < 2) return undefined;
    const id = setInterval(() => {
      setActiveMerchIndex((prev) => (prev + 1) % MERCH_ITEMS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [merchAutoScrollPaused]);

  const updateMerchPreorder = (merchId, field, value) => {
    setMerchPreorder((prev) => ({
      ...prev,
      [merchId]: {
        ...prev[merchId],
        [field]: value,
      },
    }));
  };

  const getMerchPriceText = (merch, size) => {
    if (merch?.priceBySize) {
      const fallbackSize = merch.defaultSize || merch.sizes?.[0];
      const amount = merch.priceBySize[size] ?? merch.priceBySize[fallbackSize];
      if (Number.isFinite(amount)) return `EUR ${amount.toFixed(2)} (Free Worldwide Shipping)`;
    }
    if (Number.isFinite(merch?.priceEuro)) return `EUR ${merch.priceEuro.toFixed(2)} (Free Worldwide Shipping)`;
    return String(merch?.price || '');
  };

  const openEmailWithFallback = (mailtoUrl, gmailUrl, failureMessage) => {
    // Fallback chain for browsers/devices that do not reliably handle mailto:
    // 1) attempt native mail app via mailto
    // 2) if page never loses visibility, open Gmail compose in a new tab
    let handoffDetected = false;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') handoffDetected = true;
    };
    document.addEventListener('visibilitychange', onVisibility, { once: true });

    window.location.assign(mailtoUrl);

    window.setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (handoffDetected) return;
      const popup = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      if (!popup) window.alert(failureMessage);
    }, 900);
  };

  const startMerchPreorder = (merchId) => {
    const merch = MERCH_ITEMS.find((item) => item.id === merchId);
    if (!merch) return;
    const details = merchPreorder[merchId] || {};
    const product = merch.title;
    const color = merch.color;
    const size = details.size || merch.defaultSize || merch.sizes[0] || 'One size';
    const selectedPrice = getMerchPriceText(merch, size);
    const name = String(details.name || '').trim();
    const contact = String(details.contact || '').trim();

    if (!name) {
      window.alert('Please enter your name before sending your order request.');
      return;
    }

    const preorderEmail = 'merch@honeycomblab.art';
    const preorderSubject = encodeURIComponent(`ORDER NOW - ${product} (${color}, ${size})`);
    const preorderBody = encodeURIComponent(
      [
        'Hi Honeycomb Lab,',
        '',
        "I'd like to place an order for the merch item below:",
        '',
        `Product: ${product}`,
        `Color: ${color}`,
        `Size: ${size}`,
        `Price: ${selectedPrice}`,
        `Name: ${name}`,
        `Preferred Contact: ${contact || 'N/A'}`,
        'Quantity: 1',
        'Collection: Honeycomb Lab Originals: Launch Series',
        'Shipping starts: May 1, 2026',
        'Originals Series extra: Included',
        '',
        'Please send me payment details and any expected delivery timeline.',
        '',
        'Thank you!',
      ].join('\n')
    );
    const preorderMailto = `mailto:${preorderEmail}?subject=${preorderSubject}&body=${preorderBody}`;
    const gmailPreorder = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(preorderEmail)}&su=${preorderSubject}&body=${preorderBody}`;
    openEmailWithFallback(
      preorderMailto,
      gmailPreorder,
      'Could not open your email app automatically. Please allow popups or email merch@honeycomblab.art with your order details.',
    );
  };

  const submitCustomInquiry = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') || '').trim();
    const emailAddress = String(formData.get('email') || '').trim();
    const genre = String(formData.get('genre') || '').trim();
    const mood = String(formData.get('mood') || '').trim();
    const tempo = String(formData.get('tempo') || '').trim();
    const key = String(formData.get('key') || '').trim();
    const referenceTrack = String(formData.get('referenceTrack') || '').trim();
    const promoCode = String(formData.get('promoCode') || '').trim();
    const additionalInfo = String(formData.get('additionalInfo') || '').trim();

    const inquiryEmail = 'contact@honeycomblab.art';
    const inquirySubject = encodeURIComponent(`CUSTOM BEAT INQUIRY - ${firstName || 'New Request'}`);
    const inquiryBody = encodeURIComponent(
      [
        'Hi Honeycomb Lab,',
        '',
        "I'd like to inquire about a custom beat:",
        '',
        `First name: ${firstName || 'N/A'}`,
        `Email: ${emailAddress || 'N/A'}`,
        `Genre: ${genre || 'N/A'}`,
        `Mood: ${mood || 'N/A'}`,
        `Tempo: ${tempo || 'N/A'}`,
        `Key: ${key || 'N/A'}`,
        `Reference Track: ${referenceTrack || 'N/A'}`,
        `Promo code: ${promoCode || 'N/A'}`,
        '',
        'Additional information:',
        additionalInfo || 'N/A',
        '',
        'Thank you!',
      ].join('\n')
    );
    const inquiryMailto = `mailto:${inquiryEmail}?subject=${inquirySubject}&body=${inquiryBody}`;
    const gmailInquiry = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inquiryEmail)}&su=${inquirySubject}&body=${inquiryBody}`;

    openEmailWithFallback(
      inquiryMailto,
      gmailInquiry,
      'Could not open your email app automatically. Please allow popups or email contact@honeycomblab.art with your custom beat inquiry details.',
    );
  };

  return (
    <main className="page">
      {/* SOCIAL MEDIA PANEL */}
      <div className="social-panel">
        <a
          href="https://www.youtube.com/@honeycomblabmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          title="YouTube"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a
          href="https://www.instagram.com/honeycomblabmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          title="Instagram"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@honeycomblabmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          title="TikTok"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </a>
      </div>

      <style>{`
        :root{
          --bg:#2e2e2e; /* charcoal */
          --panel:#1a1a1a; /* dark card */
          --muted:#a6a6a6; /* ash */
          --text:#f4f4f4; /* chalk */
          --line:#3a3a3a; /* divider */
          --accent:#e4a010; /* honey orange */
        }
        
        /* SOCIAL MEDIA PANEL */
        .social-panel {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 100;
          background: rgba(26,26,26,0.8);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid var(--line);
          backdrop-filter: blur(8px);
        }
        .social-link {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
          transition: all 0.3s ease;
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
        }
        .social-link:hover {
          color: var(--accent);
          transform: translateY(-2px);
          background: rgba(228,160,16,0.15);
        }
        *{box-sizing:border-box}
        .page{min-height:100vh;background:var(--bg);color:var(--text);font-family:"Segoe UI", Tahoma, Geneva, Verdana, sans-serif;display:flex;flex-direction:column;align-items:center;gap:0;padding:0}
        .container{width:100%;max-width:100%;padding:0 40px;margin:0 auto}
        @media (min-width:1280px){.container{max-width:1200px}}

        /* NAV */
        .nav{width:100%;border-bottom:1px solid var(--line);position:sticky;top:0;backdrop-filter:saturate(140%) blur(6px);background:rgba(18,18,18,0.6);z-index:80}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
        .brand{display:flex;align-items:center;gap:10px;font-weight:800}
        .brand-mark{width:28px;height:28px;display:block}
        .nav-actions{display:flex;gap:10px}
        .nav-btn{padding:0 14px;border:1px solid var(--text);color:var(--text);border-radius:10px;background:transparent;font-weight:600;cursor:pointer;height:36px;display:flex;align-items:center}
        .nav-btn:hover{border-color:var(--accent);color:var(--accent)}

        /* SECTION BASE */
        .section{position:relative;width:100%;padding:72px 0}
        .section.hex::before{content:"";position:absolute;inset:0;background:url('/background.png');background-size:cover;background-position:center;opacity:0.15;pointer-events:none}
        /* Tighter bottom on hero so next strip sits closer */
        .hero.section{padding-bottom:12px}
        html, body, .page { overflow-x: hidden; }
        .section>.container{position:relative}
        .kicker{color:var(--muted);text-transform:uppercase;letter-spacing:2px;font-weight:700;font-size:12px;text-align:center}
        .headline{font-size:44px;font-weight:900;text-align:center;letter-spacing:0.3px;}
        /* Smaller hero sub-title */
        .hero .headline{font-size:28px}
        .underline{width:140px;height:2px;background:var(--accent);margin:10px auto 24px;border-radius:2px}
        /* prettier body copy */
        .section p{font-size:18px;line-height:1.8;letter-spacing:0.2px;color:var(--muted);}
        /* Smooth anchor scrolling + offset for sticky nav */
        html{scroll-behavior:smooth}
        #subscribe{scroll-margin-top:90px}

        /* HERO */
        
        /* HERO BRAND */
        .hero-brand{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;margin-bottom:10px}
        .brand-row{display:inline-flex;align-items:center;gap:8px}
        .brand-mark{width:48px;height:48px;display:block;transition:transform .2s ease}
        .brand-mark:hover{transform:scale(1.06)}
        .custom-license-icon{width:48px;height:48px;object-fit:contain;display:block;transition:transform .2s ease}
        .custom-license-icon:hover{transform:scale(1.06)}
        .hero-brand h1{font-size:48px;line-height:1.1;margin:0;font-weight:900;letter-spacing:.5px;text-align:center}
        .tagline{color:var(--muted);font-size:16px;line-height:1.6;text-align:center;max-width:820px;margin-top:2px}
        /* HERO GRID (desktop 3 cols; mobile 1 col) */
        @media (min-width:1024px){.hero .hero-inner{display:grid;grid-template-columns:1fr minmax(220px,260px) 1fr;align-items:start;gap:18px}}
        @media (max-width:1023.98px){.hero .hero-inner{display:grid;grid-template-columns:1fr;gap:16px}}
        .bullets{margin-top:8px;display:grid;gap:10px;width:100%;padding:0 12px}
        .bullet{display:grid;grid-template-columns:24px 1fr;gap:8px;align-items:start;text-align:left;padding:12px;border-radius:12px;background:rgba(26,26,26,0.4);border:1px solid var(--line);transition:all 0.3s ease;cursor:pointer;position:relative;overflow:hidden}
        .bullet::before{content:"";position:absolute;inset:0;background:linear-gradient(45deg, transparent 0%, rgba(228,160,16,0.1) 100%);opacity:0;transition:opacity 0.3s ease}
        .bullet:hover{transform:translateY(-2px);border-color:var(--accent);box-shadow:0 4px 20px rgba(228,160,16,0.15)}
        .bullet:hover::before{opacity:1}
        .plus{width:18px;height:18px;position:relative;margin-top:4px;transition:transform 0.3s ease}
        .plus::before,.plus::after{content:"";position:absolute;background:var(--accent);border-radius:2px;transition:all 0.3s ease}
        .plus::before{width:18px;height:2px;top:8px;left:0}
        .plus::after{width:2px;height:18px;top:0;left:8px}
        .bullet:hover .plus{transform:rotate(180deg)}
        .bullet h3{margin:0;font-size:16px;font-weight:800;color:var(--text);transition:color 0.3s ease}
        .bullet:hover h3{color:var(--accent)}
        .bullet p{margin:0;max-height:0;opacity:0;color:var(--muted);transition:all 0.25s ease;overflow:hidden}
        .bullet:hover p{margin:6px 0 0;max-height:60px;opacity:1;color:var(--text)}
        .hero-cta{display:flex;gap:10px;margin-top:10px;flex-direction:column;align-items:center}
        .hero-cta .cta{padding:16px 24px;font-size:18px}
        .hero-cta .cta:not(.secondary){font-size:20px}
        .hero-cta .cta.secondary{font-size:15px}
        .cta{border:1px solid var(--accent);background:var(--accent);color:#111;padding:10px 14px;border-radius:10px;font-weight:800;font-size:15px}
        .cta.secondary{background:transparent;color:var(--accent)}

        /* HERO GRID LAYOUT */
        .hero-left{display:flex;flex-direction:column;align-items:stretch;padding:0 12px}
        .hero-left{grid-column:1}
        .hero-cta-col{display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center;align-self:center;justify-self:center;grid-column:2;margin-top:-36px}
        .hero-review{grid-column:3;align-self:start}
        @media (min-width:1024px){.hero-review{margin-top:-80px}}
        .hero-cta-col .cta{width:260px}
        .hero-cta-col .cta.secondary{width:220px}

        /* FORMS / ELEMENTS */
        .grid{display:grid;gap:20px}
        @media (min-width:960px){.grid-2{grid-template-columns:1fr 1fr}}
        input,textarea{border-radius:10px;border:1px solid var(--line);background:#1e1e1e;color:var(--text);padding:12px 14px;outline:none;font-family:inherit}
        textarea{width:100%}
        input::placeholder,textarea::placeholder{color:var(--muted)}
        input:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(228,160,16,.25)}
        button{border-radius:10px;border:1px solid #000;background:var(--accent);color:#111;cursor:pointer;font-weight:700;padding:12px 14px;font-family:inherit}
        button:hover{filter:brightness(.95)}
        .subtle{color:var(--muted)}

        
        /* TIER BUY BUTTONS */
        .btn-tier{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;border:1px solid transparent;transition:filter .15s ease, box-shadow .15s ease}
        .btn-tier:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(228,160,16,.25)}
        .btn-silver{background:#C0C0C0;color:#111;border-color:#000}
        .btn-silver:hover{filter:brightness(.95)}
        .btn-rose{background:#b76e79;color:#fff;border-color:#8e5962}
        .btn-rose:hover{filter:brightness(.94)}
        .btn-diamond{background:#00b5e2;color:#111;border-color:#006b84}
        .btn-diamond:hover{filter:brightness(.92)}

        /* Compare Licenses modal */
        .cmp-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:200}
        .cmp-modal{background:#151515;border:1px solid var(--line);border-radius:14px;max-width:860px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,.5)}
        .cmp-head{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid var(--line)}
        .cmp-body{padding:16px 18px;display:grid;gap:14px}
        .cmp-col{background:#111;border:1px solid var(--line);border-radius:12px;padding:12px}
        .cmp-col h4{margin:0 0 6px}
        .cmp-close{background:#272727;color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px 10px;cursor:pointer}
        .btn-ghost{background:#272727;color:var(--text);border:1px solid var(--line);padding:8px 12px;border-radius:8px;cursor:pointer}
        .cmp-list{list-style:none;padding-left:0;margin:8px 0 0;color:var(--muted);font-size:14px;line-height:1.6}
        .cmp-list li{display:flex;gap:8px;align-items:flex-start;margin:5px 0}
        .cmp-list li::before{content:"✓";color:var(--accent);font-weight:900;margin-top:2px}
/* CONTACT / MORE DROPDOWNS */
        .nav-dropdown{position:relative}
        .dropdown{position:absolute;right:0;top:48px;background:var(--panel);border:1px solid var(--line);border-radius:12px;min-width:220px;box-shadow:0 10px 30px rgba(0,0,0,.35);padding:8px;z-index:90}
        .dropdown a,.dropdown button{display:flex;width:100%;text-align:left;gap:8px;align-items:center;background:transparent;border:none;color:var(--text);padding:10px 12px;border-radius:8px;font-family:inherit;cursor:pointer;transition:color .2s ease, background .2s ease}
        .dropdown a:hover,.dropdown button:hover{background:rgba(255,255,255,0.06);color:var(--accent)}
        .dropdown a:focus-visible,.dropdown button:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(228,160,16,.25);color:var(--accent)}

        /* SUBSCRIBE */
        .subscribe-wrap{display:grid;grid-template-columns:minmax(420px,560px) 520px;gap:28px;align-items:center;justify-content:center}
        @media (max-width:1024px){.subscribe-wrap{grid-template-columns:1fr;justify-content:stretch}}
        .subscribe-left{text-align:left}
        .subscribe-art{display:flex;flex-direction:column;align-items:center;justify-content:center}
        .subscribe-art img{max-width:100%;width:540px;height:auto;border-radius:16px;border:1px solid var(--line);background:#1e1e1e;margin-top:24px}
        /* SUBSCRIBE form sizing */
        .sub-form{display:grid;grid-template-columns:1fr 140px;gap:12px;max-width:760px;margin:0 auto}
        .sub-form input{height:56px;font-size:16px;border-radius:12px;width:100%}
        .sub-form button{height:56px;padding:0 24px;border-radius:12px;width:100%}
        
        /* Name fields container */
        .name-fields{max-width:760px;margin:0 auto}

        /* PLAYER */
        .card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,.35);transition:transform .2s ease, box-shadow .2s ease}
        .card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(228,160,16,.25)}
        .beat-player{padding:24px;border:1px dashed var(--line);border-radius:14px;background:#1e1e1e}
        .thumb-wrap{position:relative}
        .thumb-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;letter-spacing:.5px;text-transform:uppercase}

        /* PLEDGE */
        .pledge-grid{display:grid;gap:28px;grid-template-columns:1.1fr .9fr;align-items:start}
        @media (max-width:960px){.pledge-grid{grid-template-columns:1fr}}
        .pledge-list{line-height:1.8;color:var(--muted)}
        .pledge-list ul{padding-left:20px}
        .donate-card{background:#141416;border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
        .donate-card h3{margin:0 0 6px;font-size:28px}
        .donate-card small{color:var(--muted)}
        .radio{display:flex;gap:10px;align-items:center}
        .radio input{width:16px;height:16px}
        .donate-grid{display:grid;gap:12px}
        .amount-input{display:flex;flex-direction:column;gap:6px}
        .amount-input input{width:100%}

        /* ABOUT */
        .about-wrap{display:grid;grid-template-columns:320px 1fr;gap:16px;align-items:start;max-width:1000px;margin:0 auto}
        @media (max-width:960px){.about-wrap{grid-template-columns:1fr}}
        .about-logo{display:flex;align-items:center;justify-content:center}
        .about-logo img{width:280px;height:auto;display:block}

        /* TEAM */
        .team-wrap{display:grid;grid-template-columns:340px 1fr;gap:20px;align-items:center;max-width:1100px;margin:0 auto}
        @media (max-width:960px){.team-wrap{grid-template-columns:1fr;gap:14px}}
        .team-photo{width:300px;height:300px;border-radius:50%;overflow:hidden;border:2px solid var(--line);background:#1e1e1e;justify-self:center}
        .team-photo img{width:100%;height:100%;object-fit:cover;display:block}

        /* CUSTOM FORM */
        .custom h2{font-size:48px;letter-spacing:1px;font-weight:900;text-align:center}
        .custom p.lead{color:var(--muted);text-align:center;margin-top:6px}
        .custom form{max-width:860px;margin:22px auto 0}
        .price-label{font-style:italic;color:var(--text);font-size:20px;margin-top:8px}
        /* Checklist with checkmarks */
        .checklist{list-style:none;padding-left:0;margin:0}
        .checklist li{display:flex;gap:8px;align-items:flex-start;margin:6px 0}
        .checklist li::before{content:"✓";color:var(--accent);font-weight:900;margin-top:2px}

        .icon{width:18px;height:18px;color:var(--accent);margin-top:2px;display:block}
        .footer{background:transparent;border-top:none;padding:28px 0;margin-top:60px}
        .footer .container{display:flex;flex-direction:column;align-items:center;gap:6px}
        .footer a{color:var(--text);font-weight:700;font-size:18px;text-decoration:none}
        .footer a:hover{text-decoration:underline}
        .footer small{color:var(--muted);font-size:14px}

        /* SALE BAR */
        .sale-icon{transform:scale(2);transform-origin:center}

        /* VALUE STRIP */
        .value-strip{width:100%;background:#141416;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;margin-top:-24px}
        .value-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:center}
        @media (max-width:960px){.value-grid{grid-template-columns:1fr;gap:10px}}
        .value-item{display:flex;align-items:center;gap:12px;justify-content:center}
        .vi-icon{width:28px;height:28px;color:var(--accent);flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .vi-text strong{display:block;font-weight:900;color:var(--text)}
        .vi-text small{display:block;color:var(--muted)}
        /* REVIEW STARS */
        .stars{display:inline-flex;align-items:center;color:transparent}
        .stars::before{content:"\\2605\\2605\\2605\\2605\\2605";color:var(--accent);font-size:14px;letter-spacing:2px}
      `}</style>


      {/* NAV */}
      <nav className="nav">
        <div className="container nav-inner">
          <div className="brand"><img src="/honeycomb_lab.png" className="brand-mark" alt="" aria-hidden /> Honeycomb Lab</div>
          <div className="nav-actions">
            <a href="#about" className="nav-btn">About Us</a>
            <a href="#player" className="nav-btn">Latest Tracks</a>
            <div className="nav-dropdown" ref={contactRef}>
              <button
                type="button"
                className="nav-btn"
                aria-haspopup="menu"
                aria-expanded={contactOpen}
                onClick={() => setContactOpen(v => !v)}
              >
                Contact
              </button>
              {contactOpen && (
                <div className="dropdown" role="menu" aria-label="Contact options">
                  <a href={mailto} target="_blank" rel="noopener noreferrer" role="menuitem">Email (default app)</a>
                  <a href={gmailCompose} target="_blank" rel="noopener noreferrer" role="menuitem">Email in Gmail</a>
                  <a href="/support.html" target="_blank" rel="noopener noreferrer" role="menuitem">Support</a>
                  <button type="button" onClick={handleCopy} role="menuitem">{copied ? 'Copied!' : 'Copy email'}</button>
                </div>
              )}
            </div>
            <div className="nav-dropdown" ref={moreRef}>
              <button
                type="button"
                className="nav-btn"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen(v => !v)}
              >
                More
              </button>
              {moreOpen && (
                <div className="dropdown" role="menu" aria-label="More options">
                  {/* The Pledge */}
                  <a href="#subscribe" role="menuitem">Free Tools</a>
                  <a href="/terms.html" target="_blank" rel="noopener noreferrer" role="menuitem">Terms</a>
                  <a href="/privacy.html" target="_blank" rel="noopener noreferrer" role="menuitem">Privacy</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {saleActive && (
        <a href="#player" className="sale-bar" aria-label={`Launch sale 33% off. Ends in ${days} days ${pad(hours)} hours ${pad(minutes)} minutes ${pad(seconds)} seconds. Go to player section.`}>
          <img src="/ribbon.png" alt="" aria-hidden="true" className="sale-icon" />
          <span className="sale-badge">LAUNCH SALE</span>
          <span className="sale-text">33% OFF</span>
          <span className="sale-timer" aria-live="polite">Ends in {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s</span>
        </a>
      )}
      {/* HERO */}
      <section className="hero section hex">
        <div className="container hero-inner">
          <div className="hero-brand" style={{ gridColumn: '1 / -1' }}>
            <div className="brand-row">
              <img src="/honeycomb_lab.png" alt="Honeycomb Lab logo" className="brand-mark" />
              <h1>Honeycomb Lab</h1>
            </div>
            <p className="tagline">Sick of rapping over the same YouTube beats as every other bedroom rapper?</p>
          </div>
          <div className="hero-left">
            <h2 className="headline" style={{marginTop: 6}}>Why Artists Choose Us</h2>
            <div className="bullets">
              <div className="bullet">
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 14c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4S8 3.79 8 6v4c0 2.21 1.79 4 4 4zm5-4c0 3.07-2.13 5.64-5 6.32V19h3v2H9v-2h3v-2.68C9.13 15.64 7 13.07 7 10h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2z"/></svg>
                <div>
                  <h3>Clear Sound</h3>
                  <p>Your song will sound clean and pro. No fuzzy stuff.</p>
                </div>
              </div>
              <div className="bullet">
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 7c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3zm16 2v6c0 1.66-3.58 3-8 3s-8-1.34-8-3V9c1.78 1.09 5 1.8 8 1.8S18.22 10.09 20 9z"/></svg>
                <div>
                  <h3>Beats That Hit</h3>
                  <p>Hard drums and deep bass that grab ears fast.</p>
                </div>
              </div>
              <div className="bullet">
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1a11 11 0 1 0 11 11A11.012 11.012 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9Zm.5-14h-1v6l5.2 3.1.5-.86-4.7-2.79Z"/></svg>
                <div>
                  <h3>No Worries License</h3>
                  <p>Use the beat anywhere. No tricks. No stress.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-cta-col">
            <div className="hero-cta">
              <a className="cta" href="#player">Listen Now</a>
              <a className="cta secondary" href="#custom">Request Custom Beat</a>
            </div>
          </div>
          <div className="hero-review">
            <div className="review-slider" role="region" aria-label="Artist reviews">
              {reviews.map((r, i) => (
                <div key={r.name} className={`review-slide ${i === reviewIndex ? 'active' : ''}`} aria-hidden={i !== reviewIndex}>
                  <div className="review-card">
                    <div className="review-header">
                      <img className="review-avatar" src={r.avatar} alt="" />
                      <h4 className="review-author">{r.name}</h4>
                      <div className="stars" aria-hidden="true">â˜…â˜…â˜…â˜…â˜…</div>
                    </div>
                    <blockquote className="review-quote">{renderQuote(r)}</blockquote>
                    {r.link && (
                      <p style={{ marginTop: 8 }}>
                        <a
                          className="review-link"
                          href={r.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={r.link.label || 'Artist link'}
                        >
                          {r.link.label || 'Check out their channel'}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <span className="sr-only">Slide {reviewIndex + 1} of {reviews.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="value-strip" aria-label="Value proposition">
        <div className="container">
          <div className="value-grid">
            <div className="value-item">
              <div className="vi-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 3v6c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V5l7-3zm0 2.18L7 5.27v5.61c0 4.12 2.86 8.26 5 9.35 2.14-1.09 5-5.23 5-9.35V5.27l-5-1.09zM11 12l5-5-1.41-1.41L11 9.17 9.41 7.59 8 9l3 3z"/></svg>
              </div>
              <div className="vi-text">
                <strong>No Surprises</strong>
                <small>Clear licensing, no hidden fees.</small>
              </div>
            </div>
            <div className="value-item">
              <div className="vi-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm0 2a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm1 4h-2v6l5 3 1-1.73-4-2.27V7z"/></svg>
              </div>
              <div className="vi-text">
                <strong>No Delay</strong>
                <small>Instant download; stems in higher tiers.</small>
              </div>
            </div>
            <div className="value-item">
              <div className="vi-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 15.93V17h-2v1.93a7.03 7.03 0 0 1-5-3.2l1.72-1a5.02 5.02 0 0 0 3.28 2.27V13H8a3 3 0 1 1 0-6h.18a3.01 3.01 0 0 1 2.58 1.5l1.73-1A5.01 5.01 0 0 0 8.18 5H9V3.07A7.03 7.03 0 0 1 14 6.27V7h2V5.07a7.03 7.03 0 0 1 3 2.86l-1.72 1A5.02 5.02 0 0 0 15 7.59V11h1a3 3 0 1 1 0 6h-.18a3.01 3.01 0 0 1-2.58-1.5l-1.73 1a5.01 5.01 0 0 0 2.49 1.43z"/></svg>
              </div>
              <div className="vi-text">
                <strong>No Overspend</strong>
                <small>Pay only for what you need. Upgrade later.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCER */}
      

      {/* ABOUT */}
      <section id="about" className="section hex">
        <div className="container">
          <div className="kicker">About</div>
          <h2 className="headline">About Honeycomb Lab</h2>
          <div className="underline" />
          <div className="about-wrap">
            <div className="about-logo">
              <img src="/honeycomb_lab.png" alt="Honeycomb Lab logo" />
            </div>
            <div className="about-text">
              <p>Honeycomb Lab is a sound design studio engineering psychoacoustic tools for consciousness. Every beat is structured with intention - embedded with frequencies, ratios, symbolism, and emotion.</p>
              <p>We don't just sell music. We sell neural architecture. This is premium audio alchemy: rooted in science, wrapped in magic, designed to move minds and realities.</p>
              <p>Welcome to the Lab. Build what you came here to build.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="section hex">
        <div className="container">
          <div className="kicker">Team</div>
          <h2 className="headline">Meet Our Producer - David Cody</h2>
          <div className="underline" />
          <div className="team-wrap">
            <div className="team-photo">
              <img src="/David.jpg" alt="David Cody" />
            </div>
            <div className="team-text">
              <p>Music as sonic experimentation: trap, drill, and hip-hop with psychoacoustic techniques baked in.</p>
              <p>Born and based in Plovdiv, Bulgaria, David Cody treats music as sonic experimentation. He focuses on trap, drill and hip-hop, baking psychoacoustic techniques into every beat - drums that move, low end that translates, and arrangements that leave space for the story.</p>
              <p>At 4 years old, a Tom & Jerry episode-chasing each other across a grand piano-sparked his obsession. He asked his mother to let him learn; she took him to his first piano lesson that same day. That's where his feel for melody and rhythm began, and still anchors everything he makes.</p>
              <p>Years later, as a broke rapper, he spent nights scouring YouTube for the perfect free beats. Nothing truly matched his voice, so he learned to produce on his own. Three years in, he's building the sound he used to search for - and shaping it for other artists too.</p>
              <p>At Honeycomb Lab, David builds mix-ready instrumentals engineered for punch and clarity, so artists spend less time fighting the beat and more time finishing music.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section id="subscribe" className="section hex">
        <div className="container">
          <div className="kicker">Subscribe</div>
          <h2 className="headline">Join the Hive</h2>
          <div className="underline" />
          <p className="subtle" style={{maxWidth:760,margin:"0 auto 18px",textAlign:'center'}}>
            Join our email list and get access to special deals, exclusive content & free tools, including the new "Honey" Multi-FX Synthesizer (patcher preset) for FLStudio, plus the Beginner's Starter Pack - From Zero to Hero.
          </p>
          <div className="subtle" style={{maxWidth:700,margin:'0 auto 22px',textAlign:'center'}}>
            <strong>Starter Pack includes:</strong>
            <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:12, marginTop:8}}>
              <span>Beginner's Guide to Recording Clean Vocals at Home</span>
              <span>Beginner's Guide to Mix &amp; Master Your Song</span>
              <span>Beginner's Guide to Release and Promote Your Track</span>
            </div>
          </div>

          <div className="subscribe-wrap">
            <div className="subscribe-left">
              <SenderFormEmbed />
            </div>
            <div className="subscribe-art">
              <img
                key={activeMagnet.id}
                src={activeMagnet.src}
                alt={activeMagnet.alt}
                style={{width:'100%', height:'auto', display:'block'}}
              />
              <small className="subtle" style={{display:'block', marginTop:8}}>{activeMagnet.label}</small>
            </div>
          </div>
        </div>
      </section>

      {/* PLAYER */}
      <section id="player" className="section">
        <div className="container">
          <div className="kicker">Player</div>
          <h2 className="headline">Latest Tracks</h2>
          <div className="underline" />
          {currentBeat && (
            <div
              className="subtle"
              style={{
                marginTop: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'rgba(20,20,20,0.7)',
              }}
            >
              {currentBeat?.artwork && (
                <img
                  src={currentBeat.artwork}
                  alt=""
                  aria-hidden="true"
                  style={{ width: 28, height: 28, borderRadius: 999, objectFit: 'cover', border: '1px solid var(--line)' }}
                />
              )}
              <span>Now Playing: {currentBeat.title}</span>
            </div>
          )}
          <div className="hex-gallery-wrapper">
            <HexGallery
              radius={2}
              onSelect={setCurrentBeat}
              audioRef={audioRef}
              requestedBeatId={requestedBeatId}
            />
          </div>

          {/* Mini Player */}
          <div className="card" style={{marginTop:16}}>
            <div style={{display:'grid', gridTemplateColumns:'72px 1fr', gap:14, alignItems:'start'}}>
              <div className="thumb-wrap" style={{width:72, height:72, borderRadius:12, background:'#1e1e1e', overflow:'hidden', border:'1px solid var(--line)'}}>
                {currentBeat?.artwork ? (
                  <img src={currentBeat.artwork} alt="" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
                ) : (
                  <div style={{width:'100%', height:'100%', background:'linear-gradient(135deg, #272727, #1c1c1c)'}} />
                )}
                {currentBeat && !['ambivalence-1','gold-1','digital-strings-1','beatitude-1','malice-1','quixotic-1'].includes(currentBeat.id) && (
                  <div className="thumb-overlay" aria-hidden="true">COMING SOON</div>
                )}
              </div>
              <div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:10}}>
                  <strong style={{fontSize:18}}>{currentBeat?.title || 'Select a hex to play'}</strong>
                  {currentBeat && (
                    <small className="subtle">
                      {currentBeat?.bpm ? `${currentBeat.bpm} BPM` : 'BPM N/A'} • {currentBeat?.key || 'Key N/A'}
                    </small>
                  )}
                </div>
                {currentBeat?.description && (
                  <p className="subtle" style={{ marginTop: 8, marginBottom: 0, fontSize: 14, lineHeight: 1.5 }}>
                    {currentBeat.description}
                  </p>
                )}
                {currentBeat && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {(currentBeat.mood || []).map((mood) => (
                      <span
                        key={`mood-${mood}`}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.06)',
                          fontSize: 12,
                          color: 'var(--text)',
                        }}
                      >
                        {formatMetaLabel(mood)}
                      </span>
                    ))}
                    {(currentBeat.tags || []).map((tag) => (
                      <span
                        key={`tag-${tag}`}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          border: '1px solid rgba(228,160,16,0.35)',
                          background: 'rgba(228,160,16,0.12)',
                          fontSize: 12,
                          color: 'var(--text)',
                        }}
                      >
                        #{formatMetaLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
                <audio
                  controls
                  preload="none"
                  src={currentBeat?.preview}
                  style={{width:'100%', marginTop:10, accentColor:'var(--accent)'}}
                  ref={audioRef}
                />
                {currentBeat && (
                  <>
                  <div style={{display:'flex', gap:10, marginTop:10, alignItems:'center'}}>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!currentBeat?.preview}
                      style={{
                        display:'inline-flex', alignItems:'center', gap:8,
                        background:'var(--accent)', color:'#111', border:'1px solid #000',
                        padding:'8px 12px', borderRadius:8, fontWeight:700,
                        cursor: currentBeat?.preview ? 'pointer' : 'not-allowed',
                        opacity: currentBeat?.preview ? 1 : 0.6,
                      }}
                    >
                      Download MP3
                    </button>
                    {!currentBeat?.preview && (
                      <small className="subtle">Preview coming soon</small>
                    )}
                    <small className="subtle">Free for nonprofit use (tagged)</small>
                  </div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:10, marginTop:8}}>
                    <button type="button" className="btn-tier btn-silver" onClick={() => handleBuy('silver')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <img src="/licenses/Silver_No_Background.png" alt="" aria-hidden="true" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                      Buy Silver Limited License
                    </button>
                    <button type="button" className="btn-tier btn-rose" onClick={() => handleBuy('roseGold')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <img src="/licenses/Rose-Gold_No_Background.png" alt="" aria-hidden="true" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                      Buy Rose Gold Expanded License
                    </button>
                    <button type="button" className="btn-tier btn-diamond" onClick={() => handleBuy('diamond')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <img src="/licenses/Diamond_No_Background.png" alt="" aria-hidden="true" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                      Buy Diamond Unlimited License
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setShowCompare(true)}>Compare Licenses</button>
                  </div>
                  </>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" className="section hex">
        <div className="container">
          <div className="kicker">Showcase</div>
          <h2 className="headline">Featured Tracks</h2>
          <div className="underline" />
          <div style={{maxWidth: '860px', margin: '0 auto', aspectRatio: '16/9', position: 'relative'}}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedShowcaseVideo.id}`}
              title={selectedShowcaseVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              allowFullScreen
              style={{position: 'absolute', top: 0, left: 0, borderRadius: '16px'}}
            ></iframe>
          </div>
          <div style={{ maxWidth: '860px', margin: '14px auto 0', display: 'grid', gap: 8 }}>
            {showcaseVideos.map((video) => {
              const active = selectedShowcaseVideoId === video.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedShowcaseVideoId(video.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: active ? '1px solid var(--accent)' : '1px solid var(--line)',
                    background: active ? 'rgba(228,160,16,0.12)' : '#141416',
                    color: 'var(--text)',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                  }}
                >
                  {video.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLEDGE (hidden) */}

      {/* <BeatTapesGallery /> */}

      {/* MERCH */}
      <section id="merch" className="section hex">
        <div className="container">
          <div className="kicker">Merch</div>
          <h2 className="headline">Honeycomb Lab Originals: Launch Series</h2>
          <div className="underline" />
          <div className="lead" style={{ marginTop: 10 }}>
            <p style={{ margin: 0 }}>Limited to 10 pieces per item.</p>
            <p style={{ margin: '6px 0 0' }}>Once sold out, this design will never be reprinted.</p>
            <p style={{ margin: '6px 0 0' }}>Produced exclusively for the Originals Series.</p>
            <p style={{ margin: '6px 0 0' }}>Each Originals Series order includes a small, unreleased extra.</p>
            <p style={{ margin: '6px 0 0' }}>Known only to those who were there at the beginning.</p>
          </div>
          <div className="merch-grid" style={{ marginTop: '16px' }}>
            <article
              style={{
                background: '#141416',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '16px',
                maxWidth: 720,
                margin: '0 auto',
              }}
            >
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img
                  src={showAltMerchImage && activeMerch.secondaryImage ? activeMerch.secondaryImage : activeMerch.primaryImage}
                  alt={activeMerch.title}
                  style={{ width: '100%', display: 'block', borderRadius: '8px', background: '#0f1012' }}
                  loading="lazy"
                  onMouseEnter={() => setShowAltMerchImage(true)}
                  onMouseLeave={() => setShowAltMerchImage(false)}
                />
                <span
                  aria-label="Launch collection"
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: 'linear-gradient(135deg, #8a2a2a, #c0392b)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(0,0,0,0.4)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                  }}
                >LAUNCH</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '18px' }}>{activeMerch.title}</h3>
              <p className="subtle" style={{ margin: 0, color: 'var(--muted)' }}>
                {getMerchPriceText(activeMerch, merchPreorder[activeMerch.id]?.size || activeMerch.defaultSize || activeMerch.sizes[0])}
              </p>
              <p className="subtle" style={{ margin: '4px 0 0', color: 'var(--muted)' }}>Color: {activeMerch.color}</p>
              <p className="subtle" style={{ margin: '4px 0 0', color: 'var(--muted)' }}>{activeMerch.sizeLabel}</p>
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                <label htmlFor={`preorder-name-${activeMerch.id}`} className="subtle" style={{ color: 'var(--muted)' }}>Name:</label>
                <input
                  id={`preorder-name-${activeMerch.id}`}
                  type="text"
                  value={merchPreorder[activeMerch.id]?.name || ''}
                  onChange={(e) => {
                    pauseMerchAutoScroll();
                    updateMerchPreorder(activeMerch.id, 'name', e.target.value);
                  }}
                  placeholder="Your name *"
                  style={{ background:'#0f1012', color:'var(--text)', border:'1px solid var(--line)', borderRadius:'8px', padding:'8px 10px' }}
                />
                <label htmlFor={`preorder-contact-${activeMerch.id}`} className="subtle" style={{ color: 'var(--muted)' }}>Email / IG / Phone (optional):</label>
                <input
                  id={`preorder-contact-${activeMerch.id}`}
                  type="text"
                  value={merchPreorder[activeMerch.id]?.contact || ''}
                  onChange={(e) => {
                    pauseMerchAutoScroll();
                    updateMerchPreorder(activeMerch.id, 'contact', e.target.value);
                  }}
                  placeholder="How should we contact you?"
                  style={{ background:'#0f1012', color:'var(--text)', border:'1px solid var(--line)', borderRadius:'8px', padding:'8px 10px' }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 10 }}>
                <label htmlFor={`size-${activeMerch.id}`} className="subtle" style={{ color: 'var(--muted)' }}>Size:</label>
                <select
                  id={`size-${activeMerch.id}`}
                  value={merchPreorder[activeMerch.id]?.size || activeMerch.defaultSize || activeMerch.sizes[0]}
                  onChange={(e) => {
                    pauseMerchAutoScroll();
                    updateMerchPreorder(activeMerch.id, 'size', e.target.value);
                  }}
                  style={{ background:'#0f1012', color:'var(--text)', border:'1px solid var(--line)', borderRadius:'8px', padding:'6px 8px' }}
                >
                  {activeMerch.sizes.map((sizeOption) => (
                    <option key={`${activeMerch.id}-${sizeOption}`}>{sizeOption}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="cta secondary"
                  onClick={() => {
                    pauseMerchAutoScroll();
                    startMerchPreorder(activeMerch.id);
                  }}
                  title="Reserve yours"
                >Reserve yours</button>
              </div>
            </article>
            <div style={{ maxWidth: 720, margin: '12px auto 0' }}>
              <input
                type="range"
                min={0}
                max={Math.max(0, MERCH_ITEMS.length - 1)}
                value={activeMerchIndex}
                onChange={(e) => {
                  pauseMerchAutoScroll();
                  setActiveMerchIndex(Number(e.target.value) || 0);
                }}
                aria-label="Merch slider"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, justifyContent: 'center' }}>
                {MERCH_ITEMS.map((item, idx) => {
                  const isActive = idx === activeMerchIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        pauseMerchAutoScroll();
                        setActiveMerchIndex(idx);
                      }}
                      style={{
                        border: isActive ? '1px solid var(--accent)' : '1px solid var(--line)',
                        color: isActive ? 'var(--accent)' : 'var(--text)',
                        background: isActive ? 'rgba(228,160,16,0.12)' : 'transparent',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontWeight: 700,
                      }}
                    >
                      {item.shortLabel}
                    </button>
                  );
                })}
              </div>
              <p className="subtle" style={{ margin: '8px 0 0', textAlign: 'center', color: 'var(--muted)' }}>
                {merchAutoScrollPaused ? 'Auto-scroll paused.' : 'Auto-scrolls every 5 seconds.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM BEAT */}
      <section id="custom" className="section custom hex">
        <div className="container">
          <div className="kicker">Custom Beat</div>
          <h2 className="headline">WANT A CUSTOM BEAT?</h2>
          <div className="underline" />
          <p className="lead">A one-of-a-kind beat, made exclusively for you.</p>
          <div className="sale-bar" role="status" aria-live="polite" style={{ position: 'relative', top: 'auto', marginTop: 8 }}>
            <svg className="sale-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <span className="sale-text">Hurry!</span>
            <span className="sale-timer">Only 7/10 spots left.</span>
          </div>
          <div className="custom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '28px', alignItems: 'start', marginTop: '28px' }}>
            <div className="custom-features">
              <h3 style={{ marginTop: 0, color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 }}>
                <img src="/licenses/Custom_No_Background.png" alt="" aria-hidden="true" className="custom-license-icon" />
                Bespoke & Exclusive Production
              </h3>
              <p style={{color: 'var(--text)'}}>You get a beat tailored to your exact vision, and it's yours alone. Once you purchase it, it's retired from our catalog forever.</p>
              <p style={{color: 'var(--text)'}}>This beat will never be licensed to any other party.</p>
              <ul className="checklist" style={{ color: 'var(--muted)' }}>
                <li>Exclusive use of the beat</li>
                <li>Unlimited Use & Modifications</li>
                <li>Unlimited streams</li>
                <li>Unlimited radio stations</li>
                <li>WAV File & Track Stems</li>
                <li>.FLP project file and Zipped Loop Package</li>
                <li>Keep 100% of your new song's sync royalties</li>
                <li>Get your song featured on our website</li>
                <li>Credit optional</li>
                <li>50/50 Songwriting Split</li>
              </ul>
              <div className="price-label" style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '16px' }}>
                <span style={{textDecoration:'line-through', color:'var(--muted)', fontWeight:700, marginRight:8}}>$701</span>
                <span style={{ background: 'var(--accent)', color: '#111', fontWeight: 900, padding: '2px 8px', borderRadius: '999px', fontSize: 14 }}>Launch Sale 33% OFF</span>
                <div style={{marginTop:8, textDecoration:'line-through', color:'var(--muted)', fontSize: '28px'}}>Price: $469</div>
                <div style={{marginTop:4, color:'#ff5a5a', fontSize: '30px', fontWeight: 900}}>VIP50 Price: $234.50</div>
                <div style={{ marginTop: 4, display: 'inline-block', background: 'rgba(255,90,90,0.16)', color: '#ff8f8f', border: '1px solid rgba(255,90,90,0.35)', fontWeight: 800, padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
                  Use code VIP50
                </div>
              </div>
              <p className="subtle" style={{ marginTop: 12, color: 'var(--muted)' }}>
                If at any point during the collaboration it becomes clear that the project is not a good creative fit, the project may be respectfully declined and a full refund issued for any work not yet delivered.
              </p>
            </div>
            <form className="custom-form-wrapper" onSubmit={submitCustomInquiry} style={{ background: '#141416', padding: '24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Send Your Inquiry</h4>
              <div className="grid grid-2">
                <input type="text" name="firstName" placeholder="First name *" required />
                <input type="email" name="email" placeholder="Email *" required />
              </div>
              <div className="grid grid-2" style={{marginTop:12}}>
                <input type="text" name="genre" placeholder="Genre" />
                <input type="text" name="mood" placeholder="Mood *" required />
              </div>
              <div className="grid grid-2" style={{marginTop:12}}>
                <input type="text" name="tempo" placeholder="Tempo *" required />
                <input type="text" name="key" placeholder="Key" />
              </div>
              <div className="grid grid-2" style={{marginTop:12}}>
                <input type="text" name="referenceTrack" placeholder="Reference Track" />
                <input type="text" name="promoCode" placeholder="Promo code (optional)" />
              </div>
              <textarea name="additionalInfo" style={{marginTop:12,minHeight:'120px'}} rows={6} placeholder="Additional information" />
              <button style={{marginTop:14}} type="submit">Submit Inquiry</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <a href="https://honeycomblab.art" rel="noopener noreferrer">honeycomblab.art</a>
          <small>&copy; Honeycomb Lab {currentYear}</small>
        </div>
      </footer>

      {miniCollapsed ? (
        <button
          type="button"
          onClick={() => setMiniCollapsed(false)}
          aria-label="Open mini MP3 player"
          style={{
            position: 'fixed',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 140,
            width: 44,
            height: 44,
            borderRadius: 10,
            border: '1px solid rgba(192,192,192,0.7)',
            background: 'linear-gradient(180deg, rgba(28,30,35,0.44), rgba(18,20,24,0.36))',
            backdropFilter: 'blur(14px) saturate(130%)',
            WebkitBackdropFilter: 'blur(14px) saturate(130%)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.24)',
            color: '#d7d7d7',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" opacity="0.25" />
            <path d="M10 8L17 12L10 16V8Z" fill="currentColor" />
          </svg>
        </button>
      ) : (
        <div
          aria-label="Mini beat player"
          ref={miniPlayerRef}
          onPointerDown={startMiniDrag}
          style={{
            position: 'fixed',
            right: miniDesktop ? 'auto' : 16,
            left: miniDesktop ? miniPosition.x : 'auto',
            top: miniDesktop ? miniPosition.y : 'auto',
            bottom: miniDesktop ? 'auto' : 16,
            zIndex: 140,
            width: miniDesktop ? 214 : 'min(214px, calc(100vw - 20px))',
            borderRadius: 14,
            border: '1px solid rgba(192,192,192,0.8)',
            background: 'linear-gradient(180deg, rgba(27,29,34,0.58) 0%, rgba(18,19,24,0.52) 52%, rgba(26,28,33,0.56) 100%)',
            boxShadow: '0 18px 44px rgba(0,0,0,0.62), 0 6px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(192,192,192,0.42), inset 0 -1px 0 rgba(192,192,192,0.16)',
            backdropFilter: 'blur(16px) saturate(135%)',
            WebkitBackdropFilter: 'blur(16px) saturate(135%)',
            padding: 8,
            opacity: currentBeat ? 0.93 : 0.58,
            transform: currentBeat ? 'translateY(0)' : 'translateY(2px)',
            transition: 'opacity .25s ease, transform .25s ease',
            cursor: miniDesktop && miniDragRef.current.active ? 'grabbing' : (miniDesktop ? 'grab' : 'default'),
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 10,
              border: '1px solid #8a8f95',
              background: 'linear-gradient(180deg, rgba(17,18,22,0.74), rgba(24,26,31,0.64))',
              boxShadow: 'inset 0 1px 0 rgba(192,192,192,0.25)',
              padding: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setMiniCollapsed(true)}
              aria-label="Close mini player"
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 18,
                height: 18,
                borderRadius: 999,
                border: '1px solid rgba(192,192,192,0.7)',
                background: 'rgba(0,0,0,0.24)',
                color: '#d9d9d9',
                fontSize: 10,
                lineHeight: 1,
                padding: 0,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              x
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: 10, alignItems: 'center' }}>
              <button
                type="button"
                onClick={jumpToMainPlayer}
                aria-label="Open main player"
                style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #c0c0c0', background: '#0f1012', padding: 0 }}
              >
                {currentBeat?.artwork ? (
                  <img src={currentBeat.artwork} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : null}
              </button>
              <div style={{ minWidth: 0 }}>
                <button
                  type="button"
                  onClick={jumpToMainPlayer}
                  style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9a9fa5', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  MP3 Player
                </button>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f2f2f2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentBeat?.title || 'Select a beat'}
                </div>
                <div style={{ fontSize: 11, color: '#b9bec4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {currentBeat?.key || 'Key N/A'} • {currentBeat?.bpm ? `${currentBeat.bpm} BPM` : 'BPM N/A'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '34px 1fr 34px', gap: 6, alignItems: 'center', marginTop: 8 }}>
            <small style={{ color: '#d6d6d6', fontVariantNumeric: 'tabular-nums' }}>{formatTime(miniCurrentTime)}</small>
            <input
              type="range"
              min={0}
              max={miniDuration > 0 ? miniDuration : 0}
              step="0.1"
              value={Math.min(miniCurrentTime, miniDuration || 0)}
              onChange={(e) => handleMiniSeek(e.target.value)}
              onInput={(e) => handleMiniSeek(e.target.value)}
              disabled={!currentBeat?.preview || miniDuration <= 0}
              style={{ width: '100%', accentColor: '#c0c0c0' }}
            />
            <small style={{ color: '#d6d6d6', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatTime(miniDuration)}</small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, alignItems: 'center', marginTop: 8 }}>
            <button
              type="button"
              onClick={playPreviousBeat}
              disabled={!miniQueue.length}
              aria-label="Previous beat"
              style={{ height: 30, borderRadius: 8, border: '1px solid #979ca2', background: '#16181c', color: '#d9dde2', display: 'grid', placeItems: 'center', padding: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <rect x="2" y="2" width="2" height="12" fill="currentColor" />
                <path d="M13 2L5 8L13 14V2Z" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleMiniPlayback}
              disabled={!currentBeat?.preview}
              aria-label={miniPlaying ? 'Pause' : 'Play'}
              style={{
                height: 32,
                borderRadius: 9,
                border: '1px solid #b0b0b0',
                background: 'linear-gradient(180deg, #d5d5d5, #b5b5b5)',
                color: '#111',
                display: 'grid',
                placeItems: 'center',
                padding: 0,
                opacity: currentBeat?.preview ? 1 : 0.6,
              }}
            >
              {miniPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <rect x="2" y="1.5" width="3.5" height="11" fill="currentColor" />
                  <rect x="8.5" y="1.5" width="3.5" height="11" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={playNextBeat}
              disabled={!miniQueue.length}
              aria-label="Next beat"
              style={{ height: 30, borderRadius: 8, border: '1px solid #979ca2', background: '#16181c', color: '#d9dde2', display: 'grid', placeItems: 'center', padding: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 2L11 8L3 14V2Z" fill="currentColor" />
                <rect x="12" y="2" width="2" height="12" fill="currentColor" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto 1fr', gap: 6, alignItems: 'center', marginTop: 6 }}>
            <button
              type="button"
              onClick={shuffleBeat}
              disabled={!miniQueue.length}
              aria-label="Shuffle"
              style={{ width: 30, height: 26, borderRadius: 7, border: '1px solid #8d8d8d', background: '#17191d', color: '#c0c0c0', display: 'grid', placeItems: 'center', padding: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 4H5L7 7L9 9L11 12H14" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 10L14 12L12 14" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12H5L7 9" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2L14 4L12 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 7L11 4H14" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleMiniLoop}
              disabled={!currentBeat?.preview}
              aria-label="Loop"
              style={{
                width: 30,
                height: 26,
                borderRadius: 7,
                border: miniLoop ? '1px solid #c0c0c0' : '1px solid #8d8d8d',
                background: miniLoop ? 'rgba(192,192,192,0.18)' : '#17191d',
                color: '#c0c0c0',
                display: 'grid',
                placeItems: 'center',
                padding: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.5 5.5A3.5 3.5 0 0 1 6 2h5v2l3-2-3-2v2H6A5.5 5.5 0 0 0 .5 5.5" fill="currentColor" />
                <path d="M13.5 10.5A3.5 3.5 0 0 1 10 14H5v-2l-3 2 3 2v-2h5a5.5 5.5 0 0 0 5.5-5.5" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleMiniMute}
              disabled={!currentBeat?.preview}
              aria-label={miniMuted ? 'Unmute' : 'Mute'}
              style={{ width: 30, height: 26, borderRadius: 7, border: '1px solid #8d8d8d', background: '#17191d', color: '#c0c0c0', display: 'grid', placeItems: 'center', padding: 0 }}
            >
              {miniMuted ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 5H4L7 2V12L4 9H1V5Z" fill="currentColor" />
                  <path d="M9 5L13 9M13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 5H4L7 2V12L4 9H1V5Z" fill="currentColor" />
                  <path d="M9 5.5C9.8 6.3 9.8 7.7 9 8.5M10.8 4C12.3 5.6 12.3 8.4 10.8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={miniMuted ? 0 : miniVolume}
              onChange={(e) => handleMiniVolume(e.target.value)}
              onInput={(e) => handleMiniVolume(e.target.value)}
              disabled={!currentBeat?.preview}
              aria-label="Volume"
              style={{ width: '100%', accentColor: '#c0c0c0' }}
            />
          </div>
        </div>
      )}

      {showCompare && <CompareLicensesModal onClose={() => setShowCompare(false)} endsInText={endsInText} />}
    </main>
  );
}




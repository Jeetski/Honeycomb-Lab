import { useEffect, useMemo, useRef, useState } from 'react'
import beatsData from '../data/beats.json'
import { DynamicVisualiser } from '../lib/dynamic_visualiser.js'

// Flat-top hex grid helpers (axial coordinates)
const SQRT3 = Math.sqrt(3)

function axialToPixel(q, r, size) {
  const x = size * (1.5 * q)
  const y = size * (SQRT3 / 2 * q + SQRT3 * r)
  return { x, y }
}

function pixelToAxial(x, y, size) {
  const q = (2 / 3) * (x / size)
  const r = (-1 / 3) * (x / size) + (1 / Math.sqrt(3)) * (y / size)
  return { q, r }
}

function axialToCube(q, r) {
  return { x: q, y: -q - r, z: r }
}

function cubeToAxial(x, y, z) {
  return { q: x, r: z }
}

function cubeRound(x, y, z) {
  let rx = Math.round(x)
  let ry = Math.round(y)
  let rz = Math.round(z)

  const xDiff = Math.abs(rx - x)
  const yDiff = Math.abs(ry - y)
  const zDiff = Math.abs(rz - z)

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz
  } else if (yDiff > zDiff) {
    ry = -rx - rz
  } else {
    rz = -rx - ry
  }
  return { x: rx, y: ry, z: rz }
}

function axialRound(q, r) {
  const c = cubeRound(q, -q - r, r)
  return cubeToAxial(c.x, c.y, c.z)
}

function hexPath(ctx, cx, cy, size) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i)
    const x = cx + size * Math.cos(angle)
    const y = cy + size * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function hexDistance(a, b) {
  const ac = axialToCube(a.q, a.r)
  const bc = axialToCube(b.q, b.r)
  return (Math.abs(ac.x - bc.x) + Math.abs(ac.y - bc.y) + Math.abs(ac.z - bc.z)) / 2
}

function makeClusterOffsets(radius) {
  const offsets = []
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius)
    const r2 = Math.min(radius, -q + radius)
    for (let r = r1; r <= r2; r++) offsets.push({ q, r })
  }
  return offsets
}

export default function HexGallery({ radius = 2, onSelect, audioRef }) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const [sizeState, setSizeState] = useState({ w: 0, h: 0 })
  const [imagesReady, setImagesReady] = useState(false)
  const [beats, setBeats] = useState(Array.isArray(beatsData) ? beatsData : [])
  const [selectedBeatId, setSelectedBeatId] = useState(null)
  const [flippingHexes, setFlippingHexes] = useState({})

  

  const visualiserRef = useRef(null)
  const analysisRef = useRef({ sub: 0, low: 0, mid: 0, high: 0 })

  const panRef = useRef({ x: 0, y: 0 })
  const panTargetRef = useRef(null) // {x,y}
  const draggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const pointerRef = useRef({ x: 0, y: 0, inside: false })
  const rafRef = useRef(0)
  const selectedRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      visualiserRef.current = new DynamicVisualiser(audioRef.current)
    }
  }, [audioRef])

  const cluster = useMemo(() => makeClusterOffsets(radius), [radius])

  // Order offsets: center, then rings clockwise
  const orderedOffsets = useMemo(() => {
    const tmp = [...cluster]
    tmp.sort((a, b) => {
      const da = (Math.abs(a.q) + Math.abs(a.r) + Math.abs(-a.q - a.r)) / 2
      const db = (Math.abs(b.q) + Math.abs(b.r) + Math.abs(-b.q - b.r)) / 2
      if (da !== db) return da - db
      const pa = axialToPixel(a.q, a.r, 1)
      const pb = axialToPixel(b.q, b.r, 1)
      return Math.atan2(pa.y, pa.x) - Math.atan2(pb.y, pb.x)
    })
    return tmp
  }, [cluster])

  

  // Assign first N beats to offsets
  const assigned = useMemo(() => {
    const n = Math.min(beats.length, orderedOffsets.length)
    const list = []
    
    const centeredBeatIndex = beats.findIndex(b => b.id === selectedBeatId)
    const centeredBeat = centeredBeatIndex !== -1 ? beats[centeredBeatIndex] : beats[0]

    const otherBeats = beats.filter(b => b.id !== centeredBeat.id)

    for (let i = 0; i < n; i++) {
      const offset = orderedOffsets[i]
      if (offset.q === 0 && offset.r === 0) {
        list.push({ beat: centeredBeat, offset })
      } else {
        const beat = otherBeats.shift()
        if(beat) {
          list.push({ beat, offset })
        }
      }
    }
    return list
  }, [orderedOffsets, beats, selectedBeatId])

  // Preload artwork images from public paths
  const imageMapRef = useRef(new Map())
  useEffect(() => {
    let alive = true
    const promises = assigned.map(({ beat }) => new Promise((resolve) => {
      if (!beat.artwork) return resolve()
      const img = new Image()
      img.onload = () => { if (alive) { imageMapRef.current.set(beat.id, img); resolve() } }
      img.onerror = () => { console.warn('Artwork failed to load:', beat.artwork); resolve() }
      img.src = beat.artwork
    }))
    Promise.all(promises).then(() => { if (alive) setImagesReady(true) })
    return () => { alive = false }
  }, [assigned])

  function computeHexSize(w, h) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (const o of cluster) {
      const p = axialToPixel(o.q, o.r, 1)
      minX = Math.min(minX, p.x)
      maxX = Math.max(maxX, p.x)
      minY = Math.min(minY, p.y)
      maxY = Math.max(maxY, p.y)
    }
    const pad = 24
    const clusterW = (maxX - minX) + 2
    const clusterH = (maxY - minY) + 2
    const scaleX = (w - pad * 2) / clusterW
    const scaleY = (h - pad * 2) / clusterH
    return 0.9 * Math.min(scaleX, scaleY)
  }

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    function onResize() {
      const rect = el.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      setSizeState({ w: Math.max(1, w), h: Math.max(1, h) })
    }
    onResize()
    const ro = new ResizeObserver(onResize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const lastMidRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const el = wrapperRef.current
    if (!canvas || !el) return
    const ctx = canvas.getContext('2d')
    let last = performance.now()

    function getAccent() {
      try {
        const styles = getComputedStyle(el)
        const c = styles.getPropertyValue('--accent')?.trim()
        return c || '#e4a010'
      } catch {
        return '#e4a010'
      }
    }

    function step(now) {
      if (visualiserRef.current) {
        analysisRef.current = visualiserRef.current.getAnalysis()
      }

      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // Pull current band levels for animations
      const { sub, low, mid } = analysisRef.current
      // Remove auto flip on audio — flips now happen only on click
      lastMidRef.current = mid

      // Update flipping progress
      const newFlippingHexes = { ...flippingHexes }
      let changed = false
      for (const id in newFlippingHexes) {
        const hex = newFlippingHexes[id]
        if (hex.progress < 1) {
          hex.progress += dt / hex.duration
          changed = true
        } else {
          delete newFlippingHexes[id]
          changed = true
        }
      }
      if (changed) setFlippingHexes(newFlippingHexes)
      // No burst state to advance (removed)

      const dpr = window.devicePixelRatio || 1
      const { w, h } = sizeState
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(step)
        return
      }
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
        // Keep CSS-based sizing (width/height 100%) to avoid layout thrash
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      const pan = panRef.current

      ctx.clearRect(0, 0, w, h)
      const size = computeHexSize(w, h)

      const centerScreen = { x: w / 2 - pan.x, y: h / 2 - pan.y }
      const axFrac = pixelToAxial(centerScreen.x, centerScreen.y, size)
      const centerAx = axialRound(axFrac.q, axFrac.r)

      const accent = getAccent()
      const stroke = '#000'
      ctx.lineWidth = 1.25
      // Determine hovered hex once per frame (in world coords)
      let hoverAx = null
      if (pointerRef.current.inside) {
        const local = { x: pointerRef.current.x, y: pointerRef.current.y }
        const world = { x: local.x - pan.x, y: local.y - pan.y }
        const tmp = pixelToAxial(world.x, world.y, size)
        hoverAx = axialRound(tmp.q, tmp.r)
      }

      // use sub/low/mid/high from earlier destructure

      for (const off of cluster) {
        const q = centerAx.q + off.q
        const r = centerAx.r + off.r
        const pos = axialToPixel(q, r, size)
        const sx = pos.x + pan.x
        const sy = pos.y + pan.y
        if (sx < -100 || sy < -100 || sx > w + 100 || sy > h + 100) continue
        ctx.save()

        const match = assigned.find(a => a.offset.q === off.q && a.offset.r === off.r)

        // ANIMATIONS
        let currentSize = size * 0.98
        if (match && match.beat.id === selectedBeatId) {
          currentSize *= 1 + sub * 0.02
        }
        const ringDistance = hexDistance({q: 0, r: 0}, off)
        // Soften growth tied to low band; cap the max growth to prevent oversized scaling
        const maxGrow = 0.25
        const grow = Math.min(maxGrow, low * 0.2 * ringDistance)
        const ringExpansion = 1 + grow
        const rotation = mid * 0.8 * (off.q % 2 === 0 ? 1 : -1)

        ctx.translate(sx, sy)
        ctx.rotate(rotation)
        ctx.scale(ringExpansion, ringExpansion)

        // No burst glow (removed)

        const flippingHex = match ? flippingHexes[match.beat.id] : null
        if (flippingHex) {
          const flipScaleX = Math.cos(flippingHex.progress * Math.PI * 2)
          ctx.scale(flipScaleX, 1)
        }

        hexPath(ctx, 0, 0, currentSize)

        const img = match ? imageMapRef.current.get(match.beat.id) : null
        if (img) {
          ctx.save()
          ctx.clip()
          const inner = size * 0.95
          const targetW = inner * 2
          const targetH = inner * 2
          const iw = img.width, ih = img.height
          const scale = Math.max(targetW / iw, targetH / ih)
          const dw = iw * scale
          const dh = ih * scale
          ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh)
          ctx.restore()
        } else {
          // Neutral placeholder until artwork loads
          ctx.fillStyle = '#2b2b2b'
          ctx.globalAlpha = 1
          ctx.fill()
        }
        // Overlay "COMING SOON" for beats not yet available (exclude playable ones)
        if (match && match.beat && !['ambivalence-1','gold-1','digital-strings-1'].includes(match.beat.id)) {
          ctx.save()
          ctx.globalAlpha = 0.6
          ctx.fillStyle = '#000'
          hexPath(ctx, 0, 0, currentSize)
          ctx.fill()
          ctx.globalAlpha = 1
          ctx.fillStyle = '#fff'
          ctx.font = '700 12px system-ui, -apple-system, Segoe UI, Roboto, Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('COMING SOON', 0, 0)
          ctx.restore()
        }

        ctx.strokeStyle = stroke
        ctx.globalAlpha = 0.35
        ctx.stroke()
        ctx.restore()

        // Selected highlight
        if (match && match.beat.id === selectedBeatId) {
          ctx.save()
          hexPath(ctx, sx, sy, size * 0.96)
          ctx.lineWidth = 2
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'
          ctx.stroke()
          // subtle honey glow
          ctx.shadowColor = 'rgba(228,160,16,0.6)'
          ctx.shadowBlur = 18
          ctx.stroke()
          ctx.restore()
        }

        // Hover highlight (within cluster only)
        if (hoverAx && hoverAx.q === q && hoverAx.r === r) {
          const offset = { q: q - centerAx.q, r: r - centerAx.r }
          if (cluster.some(c => c.q === offset.q && c.r === offset.r)) {
            ctx.save()
            hexPath(ctx, sx, sy, size * 0.985)
            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'
            ctx.stroke()
            // hover glow
            ctx.shadowColor = 'rgba(228,160,16,0.35)'
            ctx.shadowBlur = 12
            ctx.stroke()
            ctx.restore()
          }
        }

        ctx.save()
        hexPath(ctx, sx, sy, size * 0.55)
        ctx.strokeStyle = 'rgba(0,0,0,0.45)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      // Hover title overlay
      if (hoverAx) {
        const offset = { q: hoverAx.q - centerAx.q, r: hoverAx.r - centerAx.r }
        const match = assigned.find(a => a.offset.q === offset.q && a.offset.r === offset.r)
        if (match) {
          const pos = axialToPixel(hoverAx.q, hoverAx.r, size)
          const sx = pos.x + pan.x
          const sy = pos.y + pan.y
          const label = match.beat.title || match.beat.id
          ctx.save()
          ctx.font = '600 14px system-ui, -apple-system, Segoe UI, Roboto, Arial'
          const textW = ctx.measureText(label).width
          const padX = 8
          const bw = textW + padX * 2
          const bh = 22
          ctx.fillStyle = 'rgba(0,0,0,0.55)'
          ctx.strokeStyle = 'rgba(255,255,255,0.25)'
          ctx.lineWidth = 1
          if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(sx - bw / 2, sy + size * 0.8, bw, bh, 6); ctx.fill(); ctx.stroke(); }
          else { ctx.fillRect(sx - bw / 2, sy + size * 0.8, bw, bh); ctx.strokeRect(sx - bw / 2, sy + size * 0.8, bw, bh) }
          ctx.fillStyle = '#fff'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, sx - textW / 2, sy + size * 0.8 + bh / 2)
          ctx.restore()
        }
      }


      }

      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.7)
      grad.addColorStop(0, 'rgba(228,160,16,0.2)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      rafRef.current = requestAnimationFrame(step)
    }

    // Kick off the animation loop
    rafRef.current = requestAnimationFrame(step)

    function onPointerDown(e) {
      if (visualiserRef.current) {
        visualiserRef.current.connect()
      }
      draggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      panStartRef.current = { ...panRef.current }
      canvas.setPointerCapture(e.pointerId)
    }
    function onPointerMove(e) {
      if (!draggingRef.current) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      panRef.current = {
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      }
      pointerRef.current = { ...pointerRef.current, x: e.clientX, y: e.clientY }
    }
    function onPointerUp(e) {
      draggingRef.current = false
      canvas.releasePointerCapture(e.pointerId)
      // Click-to-select (only if not moved much)
      const moved = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y)
      if (moved < 5) {
        const rect = canvas.getBoundingClientRect()
        const local = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        const { w, h } = sizeState
        const size = computeHexSize(w, h)
        const pan = panRef.current
        const world = { x: local.x - pan.x, y: local.y - pan.y }
        const ax = axialRound(...Object.values(pixelToAxial(world.x, world.y, size)))
        // center axial at this moment
        const centerWorld = { x: w / 2 - pan.x, y: h / 2 - pan.y }
        const centerAx = axialRound(...Object.values(pixelToAxial(centerWorld.x, centerWorld.y, size)))
        if (hexDistance(ax, centerAx) <= radius) {
          const offset = { q: ax.q - centerAx.q, r: ax.r - centerAx.r }
          const match = assigned.find(a => a.offset.q === offset.q && a.offset.r === offset.r)
          if (match) {
            setSelectedBeatId(match.beat.id)
            if (typeof onSelect === 'function') onSelect(match.beat)
            // Trigger a flip animation on click for the selected hex
            setFlippingHexes(prev => ({ ...prev, [match.beat.id]: { progress: 0, duration: 0.35 } }))
          }
        }
      }
    }

    function onEnter() { pointerRef.current.inside = true }
    function onLeave() { pointerRef.current.inside = false }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerenter', onEnter)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerenter', onEnter)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [sizeState, radius, assigned, audioRef, flippingHexes])

    

      

  // Auto-select center beat once images/data are ready
  useEffect(() => {
    if (!onSelect || !beats.length) return
    const centerBeat = beats[Math.floor(beats.length / 2)]
    setSelectedBeatId(centerBeat.id)
    onSelect(centerBeat)
  }, [beats, onSelect])
  
  // Render canvas wrapper so the gallery is visible and measurable
  return (
    <div
      ref={wrapperRef}
      aria-label="Interactive beat gallery"
      style={{
        width: '100%',
        height: '520px',
        position: 'relative',
        borderRadius: '16px',
        border: '1px solid var(--line)',
        background: '#0e0e0f',
        overflow: 'hidden',
        contain: 'layout paint',
        maxWidth: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}

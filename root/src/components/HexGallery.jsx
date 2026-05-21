import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import beatsData from '../data/beats.json'
import { DynamicVisualiser } from '../lib/dynamic_visualiser.js'

const SQRT3 = Math.sqrt(3)
const PANEL_STORAGE_KEYS = { q: 'q', key: 'key', genre: 'genre', instruments: 'instruments', moods: 'moods', tags: 'tags', bpm: 'bpm' }
const BPM_RANGES = [
  { value: 'all', label: 'All BPM' },
  { value: 'lt130', label: '< 130 BPM' },
  { value: '130-139', label: '130-139 BPM' },
  { value: '140-149', label: '140-149 BPM' },
  { value: 'gte150', label: '150+ BPM' },
  { value: 'unknown', label: 'Unknown BPM' },
]

function axialToPixel(q, r, size) {
  return { x: size * (1.5 * q), y: size * (SQRT3 / 2 * q + SQRT3 * r) }
}
function pixelToAxial(x, y, size) {
  return { q: (2 / 3) * (x / size), r: (-1 / 3) * (x / size) + (1 / Math.sqrt(3)) * (y / size) }
}
function axialToCube(q, r) { return { x: q, y: -q - r, z: r } }
function cubeToAxial(x, _y, z) { return { q: x, r: z } }

function cubeRound(x, y, z) {
  let rx = Math.round(x)
  let ry = Math.round(y)
  let rz = Math.round(z)
  const xDiff = Math.abs(rx - x)
  const yDiff = Math.abs(ry - y)
  const zDiff = Math.abs(rz - z)
  if (xDiff > yDiff && xDiff > zDiff) rx = -ry - rz
  else if (yDiff > zDiff) ry = -rx - rz
  else rz = -rx - ry
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

function toToken(raw) {
  return String(raw || '').toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}
function toTitleCase(raw) {
  return String(raw || '').split(' ').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
function normalizeList(list) {
  if (!Array.isArray(list)) return []
  const unique = new Set()
  for (const item of list) {
    const token = toToken(item)
    if (token) unique.add(token)
  }
  return [...unique]
}

function normalizeBeat(beat) {
  const bpmValue = Number(beat?.bpm)
  return {
    ...beat,
    bpm: Number.isFinite(bpmValue) ? bpmValue : null,
    genre: normalizeList(beat?.genre),
    instruments: normalizeList(beat?.instruments),
    mood: normalizeList(beat?.mood),
    tags: normalizeList(beat?.tags),
    description: String(beat?.description || '').trim(),
    key: String(beat?.key || '').trim() || null,
  }
}

function bpmMatchesRange(bpm, range) {
  if (range === 'all') return true
  if (range === 'unknown') return bpm == null
  if (bpm == null) return false
  if (range === 'lt130') return bpm < 130
  if (range === '130-139') return bpm >= 130 && bpm <= 139
  if (range === '140-149') return bpm >= 140 && bpm <= 149
  if (range === 'gte150') return bpm >= 150
  return true
}

function parseUrlFilters(moodOptions, tagOptions) {
  const params = new URLSearchParams(window.location.search)
  const q = params.get(PANEL_STORAGE_KEYS.q) || ''
  const key = params.get(PANEL_STORAGE_KEYS.key) || ''
  const genre = params.get(PANEL_STORAGE_KEYS.genre) || ''
  const instruments = params.get(PANEL_STORAGE_KEYS.instruments) || ''
  const bpm = params.get(PANEL_STORAGE_KEYS.bpm) || 'all'
  const allowedMood = new Set(moodOptions)
  const allowedTag = new Set(tagOptions)
  const moods = (params.get(PANEL_STORAGE_KEYS.moods) || '')
    .split(',').map(toToken).filter((v) => v && allowedMood.has(v))
  const tags = (params.get(PANEL_STORAGE_KEYS.tags) || '')
    .split(',').map(toToken).filter((v) => v && allowedTag.has(v))
  return { q, key, genre, instruments, bpm, moods, tags }
}

export default function HexGallery({ radius = 2, onSelect, audioRef, requestedBeatId = null }) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const rafRef = useRef(0)
  const visualiserRef = useRef(null)
  const analysisRef = useRef({ sub: 0, low: 0, mid: 0, high: 0 })
  const imageMapRef = useRef(new Map())
  const pointerRef = useRef({ x: 0, y: 0, inside: false })
  const panRef = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const panelDragRef = useRef({ active: false, startX: 0, startY: 0, baseX: 14, baseY: 14 })
  const lastRequestedRef = useRef(null)
  const hasParsedInitialFiltersRef = useRef(false)

  const [sizeState, setSizeState] = useState({ w: 0, h: 0 })
  const [selectedBeatId, setSelectedBeatId] = useState(null)
  const [flippingHexes, setFlippingHexes] = useState({})
  const [imageVersion, setImageVersion] = useState(0)
  const [search, setSearch] = useState('')
  const [keySearch, setKeySearch] = useState('')
  const [genreSearch, setGenreSearch] = useState('')
  const [instrumentSearch, setInstrumentSearch] = useState('')
  const [selectedMoods, setSelectedMoods] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [bpmRange, setBpmRange] = useState('all')
  const [isMobilePanel, setIsMobilePanel] = useState(false)
  const [mobileCollapsed, setMobileCollapsed] = useState(true)
  const [panelPos, setPanelPos] = useState({ x: 14, y: 14 })

  const allBeats = useMemo(() => (Array.isArray(beatsData) ? beatsData.map(normalizeBeat) : []), [])
  const moodOptions = useMemo(() => {
    const s = new Set()
    for (const beat of allBeats) for (const mood of beat.mood) s.add(mood)
    return [...s].sort()
  }, [allBeats])
  const tagOptions = useMemo(() => {
    const s = new Set()
    for (const beat of allBeats) for (const tag of beat.tags) s.add(tag)
    return [...s].sort()
  }, [allBeats])
  const keyOptions = useMemo(() => {
    const map = new Map()
    for (const beat of allBeats) {
      const raw = String(beat.key || '').trim()
      if (!raw) continue
      const token = toToken(raw)
      if (token && !map.has(token)) map.set(token, raw)
    }
    return [...map.entries()].map(([value, label]) => ({ value, label }))
  }, [allBeats])
  const genreOptions = useMemo(() => (
    [...new Set(allBeats.flatMap((beat) => beat.genre || []))].sort()
  ), [allBeats])
  const instrumentOptions = useMemo(() => (
    [...new Set(allBeats.flatMap((beat) => beat.instruments || []))].sort()
  ), [allBeats])

  useEffect(() => {
    if (audioRef.current) visualiserRef.current = new DynamicVisualiser(audioRef.current)
  }, [audioRef])

  useEffect(() => {
    if (hasParsedInitialFiltersRef.current) return
    if (!moodOptions.length && !tagOptions.length) return
    const parsed = parseUrlFilters(moodOptions, tagOptions)
    setSearch(parsed.q)
    setKeySearch(toToken(parsed.key))
    setGenreSearch(toToken(parsed.genre))
    setInstrumentSearch(toToken(parsed.instruments))
    setBpmRange(BPM_RANGES.some((r) => r.value === parsed.bpm) ? parsed.bpm : 'all')
    setSelectedMoods(parsed.moods)
    setSelectedTags(parsed.tags)
    hasParsedInitialFiltersRef.current = true
  }, [moodOptions, tagOptions])

  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < 900
      setIsMobilePanel(isMobile)
      if (isMobile) {
        setPanelPos({ x: 8, y: 8 })
        setMobileCollapsed(true)
      }
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const assign = (key, value) => {
      if (!value) params.delete(key)
      else params.set(key, value)
    }
    assign(PANEL_STORAGE_KEYS.q, search.trim())
    assign(PANEL_STORAGE_KEYS.key, keySearch.trim())
    assign(PANEL_STORAGE_KEYS.genre, genreSearch.trim())
    assign(PANEL_STORAGE_KEYS.instruments, instrumentSearch.trim())
    assign(PANEL_STORAGE_KEYS.bpm, bpmRange === 'all' ? '' : bpmRange)
    assign(PANEL_STORAGE_KEYS.moods, selectedMoods.length ? selectedMoods.join(',') : '')
    assign(PANEL_STORAGE_KEYS.tags, selectedTags.length ? selectedTags.join(',') : '')
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash || ''}`
    window.history.replaceState({}, '', next)
  }, [search, keySearch, genreSearch, instrumentSearch, bpmRange, selectedMoods, selectedTags])

  const filteredBeats = useMemo(() => {
    const query = toToken(search)
    return allBeats.filter((beat) => {
      if (!bpmMatchesRange(beat.bpm, bpmRange)) return false
      if (keySearch.trim() && toToken(beat.key) !== keySearch) return false
      if (genreSearch.trim() && !beat.genre.includes(genreSearch)) return false
      if (instrumentSearch.trim() && !beat.instruments.includes(instrumentSearch)) return false
      if (selectedMoods.length && !selectedMoods.every((mood) => beat.mood.includes(mood))) return false
      if (selectedTags.length && !selectedTags.every((tag) => beat.tags.includes(tag))) return false
      if (!query) return true
      const haystack = [beat.title || '', beat.key || '', beat.description || '', ...beat.genre, ...beat.instruments, ...beat.mood, ...beat.tags].map(toToken).join(' ')
      return haystack.includes(query)
    })
  }, [allBeats, bpmRange, keySearch, genreSearch, instrumentSearch, search, selectedMoods, selectedTags])

  useEffect(() => {
    if (!requestedBeatId || requestedBeatId === lastRequestedRef.current) return
    const target = allBeats.find((beat) => beat.id === requestedBeatId)
    if (!target) return
    lastRequestedRef.current = requestedBeatId
    setSearch('')
    setKeySearch('')
    setGenreSearch('')
    setInstrumentSearch('')
    setSelectedMoods([])
    setSelectedTags([])
    setBpmRange('all')
    setSelectedBeatId(target.id)
    if (typeof onSelect === 'function') onSelect(target)
  }, [requestedBeatId, allBeats, onSelect])

  useEffect(() => {
    if (!onSelect) return
    if (!filteredBeats.length) {
      setSelectedBeatId(null)
      onSelect(null)
      return
    }
    if (selectedBeatId && filteredBeats.some((beat) => beat.id === selectedBeatId)) return
    const centerBeat = filteredBeats[Math.floor(filteredBeats.length / 2)]
    setSelectedBeatId(centerBeat.id)
    onSelect(centerBeat)
  }, [filteredBeats, selectedBeatId, onSelect])

  const cluster = useMemo(() => makeClusterOffsets(radius), [radius])
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

  const assigned = useMemo(() => {
    const n = Math.min(filteredBeats.length, orderedOffsets.length)
    if (n <= 0) return []
    const centeredBeat = filteredBeats.find((b) => b.id === selectedBeatId) || filteredBeats[0]
    const otherBeats = filteredBeats.filter((b) => b.id !== centeredBeat.id)
    const list = []
    for (let i = 0; i < n; i++) {
      const offset = orderedOffsets[i]
      if (offset.q === 0 && offset.r === 0) list.push({ beat: centeredBeat, offset })
      else {
        const beat = otherBeats.shift()
        if (beat) list.push({ beat, offset })
      }
    }
    return list
  }, [filteredBeats, orderedOffsets, selectedBeatId])

  useEffect(() => {
    let alive = true
    let loaded = 0
    const promises = assigned.map(({ beat }) => new Promise((resolve) => {
      if (!beat.artwork || imageMapRef.current.get(beat.id)) return resolve()
      const img = new Image()
      img.onload = () => {
        if (alive) {
          imageMapRef.current.set(beat.id, img)
          loaded += 1
        }
        resolve()
      }
      img.onerror = () => resolve()
      img.src = beat.artwork
    }))
    Promise.all(promises).then(() => { if (alive && loaded > 0) setImageVersion((v) => v + 1) })
    return () => { alive = false }
  }, [assigned])

  const computeHexSize = useCallback((w, h) => {
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const o of cluster) {
      const p = axialToPixel(o.q, o.r, 1)
      minX = Math.min(minX, p.x)
      maxX = Math.max(maxX, p.x)
      minY = Math.min(minY, p.y)
      maxY = Math.max(maxY, p.y)
    }
    const clusterW = (maxX - minX) + 2
    const clusterH = (maxY - minY) + 2
    return 0.9 * Math.min((w - 48) / clusterW, (h - 48) / clusterH)
  }, [cluster])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const onResize = () => {
      const rect = el.getBoundingClientRect()
      setSizeState({ w: Math.max(1, Math.round(rect.width)), h: Math.max(1, Math.round(rect.height)) })
    }
    onResize()
    const ro = new ResizeObserver(onResize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let last = performance.now()

    function step(now) {
      if (visualiserRef.current) analysisRef.current = visualiserRef.current.getAnalysis()
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const nextFlips = { ...flippingHexes }
      let changed = false
      for (const id in nextFlips) {
        const hex = nextFlips[id]
        if (hex.progress < 1) {
          hex.progress += dt / hex.duration
          changed = true
        } else {
          delete nextFlips[id]
          changed = true
        }
      }
      if (changed) setFlippingHexes(nextFlips)

      const dpr = window.devicePixelRatio || 1
      const { w, h } = sizeState
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(step)
        return
      }
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      const { sub, low, mid } = analysisRef.current
      const pan = panRef.current
      const size = computeHexSize(w, h)
      ctx.clearRect(0, 0, w, h)

      const centerScreen = { x: w / 2 - pan.x, y: h / 2 - pan.y }
      const centerAx = axialRound(...Object.values(pixelToAxial(centerScreen.x, centerScreen.y, size)))
      let hoverAx = null
      if (pointerRef.current.inside) hoverAx = axialRound(...Object.values(pixelToAxial(pointerRef.current.x - pan.x, pointerRef.current.y - pan.y, size)))

      for (const off of cluster) {
        const q = centerAx.q + off.q
        const r = centerAx.r + off.r
        const pos = axialToPixel(q, r, size)
        const sx = pos.x + pan.x
        const sy = pos.y + pan.y
        if (sx < -100 || sy < -100 || sx > w + 100 || sy > h + 100) continue
        const match = assigned.find((a) => a.offset.q === off.q && a.offset.r === off.r)

        ctx.save()
        let currentSize = size * 0.98
        if (match && match.beat.id === selectedBeatId) currentSize *= 1 + sub * 0.02
        const ringDistance = hexDistance({ q: 0, r: 0 }, off)
        ctx.translate(sx, sy)
        ctx.rotate(mid * 0.8 * (off.q % 2 === 0 ? 1 : -1))
        ctx.scale(1 + Math.min(0.25, low * 0.2 * ringDistance), 1 + Math.min(0.25, low * 0.2 * ringDistance))
        const flippingHex = match ? flippingHexes[match.beat.id] : null
        if (flippingHex) ctx.scale(Math.cos(flippingHex.progress * Math.PI * 2), 1)
        hexPath(ctx, 0, 0, currentSize)
        const img = match ? imageMapRef.current.get(match.beat.id) : null
        if (img) {
          ctx.save()
          ctx.clip()
          const inner = size * 0.95
          const iw = img.width
          const ih = img.height
          const scale = Math.max((inner * 2) / iw, (inner * 2) / ih)
          ctx.drawImage(img, -(iw * scale) / 2, -(ih * scale) / 2, iw * scale, ih * scale)
          ctx.restore()
        } else {
          ctx.fillStyle = '#2b2b2b'
          ctx.fill()
        }
        if (match && !['ambivalence-1', 'gold-1', 'digital-strings-1', 'beatitude-1', 'malice-1', 'quixotic-1'].includes(match.beat.id)) {
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
        ctx.strokeStyle = '#000'
        ctx.globalAlpha = 0.35
        ctx.lineWidth = 1.25
        ctx.stroke()
        ctx.restore()

        if (match && match.beat.id === selectedBeatId) {
          ctx.save()
          hexPath(ctx, sx, sy, size * 0.96)
          ctx.lineWidth = 2
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'
          ctx.stroke()
          ctx.shadowColor = 'rgba(228,160,16,0.6)'
          ctx.shadowBlur = 18
          ctx.stroke()
          ctx.restore()
        }
        if (hoverAx && hoverAx.q === q && hoverAx.r === r) {
          const offset = { q: q - centerAx.q, r: r - centerAx.r }
          if (cluster.some((c) => c.q === offset.q && c.r === offset.r)) {
            ctx.save()
            hexPath(ctx, sx, sy, size * 0.985)
            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'
            ctx.stroke()
            ctx.shadowColor = 'rgba(228,160,16,0.35)'
            ctx.shadowBlur = 12
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      if (hoverAx) {
        const offset = { q: hoverAx.q - centerAx.q, r: hoverAx.r - centerAx.r }
        const match = assigned.find((a) => a.offset.q === offset.q && a.offset.r === offset.r)
        if (match) {
          const pos = axialToPixel(hoverAx.q, hoverAx.r, size)
          const sx = pos.x + pan.x
          const sy = pos.y + pan.y
          const label = match.beat.title || match.beat.id
          ctx.save()
          ctx.font = '600 14px system-ui, -apple-system, Segoe UI, Roboto, Arial'
          const textW = ctx.measureText(label).width
          const bw = textW + 16
          const bh = 22
          ctx.fillStyle = 'rgba(0,0,0,0.55)'
          ctx.strokeStyle = 'rgba(255,255,255,0.25)'
          ctx.lineWidth = 1
          if (ctx.roundRect) {
            ctx.beginPath(); ctx.roundRect(sx - bw / 2, sy + size * 0.8, bw, bh, 6); ctx.fill(); ctx.stroke()
          } else {
            ctx.fillRect(sx - bw / 2, sy + size * 0.8, bw, bh); ctx.strokeRect(sx - bw / 2, sy + size * 0.8, bw, bh)
          }
          ctx.fillStyle = '#fff'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, sx - textW / 2, sy + size * 0.8 + bh / 2)
          ctx.restore()
        }
      }

      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.7)
      grad.addColorStop(0, 'rgba(228,160,16,0.2)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    const onPointerDown = (e) => {
      if (visualiserRef.current) visualiserRef.current.connect()
      draggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      panStartRef.current = { ...panRef.current }
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true }
      if (!draggingRef.current) return
      panRef.current = { x: panStartRef.current.x + (e.clientX - dragStartRef.current.x), y: panStartRef.current.y + (e.clientY - dragStartRef.current.y) }
    }
    const onPointerUp = (e) => {
      draggingRef.current = false
      canvas.releasePointerCapture(e.pointerId)
      if (Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y) >= 5) return
      const rect = canvas.getBoundingClientRect()
      const local = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      const { w, h } = sizeState
      const size = computeHexSize(w, h)
      const pan = panRef.current
      const ax = axialRound(...Object.values(pixelToAxial(local.x - pan.x, local.y - pan.y, size)))
      const centerAx = axialRound(...Object.values(pixelToAxial(w / 2 - pan.x, h / 2 - pan.y, size)))
      if (hexDistance(ax, centerAx) > radius) return
      const offset = { q: ax.q - centerAx.q, r: ax.r - centerAx.r }
      const match = assigned.find((a) => a.offset.q === offset.q && a.offset.r === offset.r)
      if (!match) return
      setSelectedBeatId(match.beat.id)
      if (typeof onSelect === 'function') onSelect(match.beat)
      setFlippingHexes((prev) => ({ ...prev, [match.beat.id]: { progress: 0, duration: 0.35 } }))
    }
    const onLeave = () => { pointerRef.current.inside = false }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [sizeState, radius, assigned, audioRef, flippingHexes, imageVersion, onSelect, cluster, computeHexSize, selectedBeatId])

  const toggleChoice = (value, state, setter) => {
    setter(state.includes(value) ? state.filter((v) => v !== value) : [...state, value])
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedMoods([])
    setSelectedTags([])
    setBpmRange('all')
  }

  const hasActiveFilters = Boolean(search || keySearch || genreSearch || instrumentSearch || selectedMoods.length || selectedTags.length || bpmRange !== 'all')

  const onPanelDragStart = (e) => {
    if (isMobilePanel) return
    panelDragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: panelPos.x,
      baseY: panelPos.y,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  useEffect(() => {
    const onMove = (e) => {
      if (!panelDragRef.current.active || isMobilePanel) return
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      const nx = panelDragRef.current.baseX + (e.clientX - panelDragRef.current.startX)
      const ny = panelDragRef.current.baseY + (e.clientY - panelDragRef.current.startY)
      const maxX = Math.max(8, rect.width - 340)
      const maxY = Math.max(8, rect.height - 200)
      setPanelPos({ x: Math.min(maxX, Math.max(8, nx)), y: Math.min(maxY, Math.max(8, ny)) })
    }
    const onUp = () => { panelDragRef.current.active = false }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [isMobilePanel])

  return (
    <div
      ref={wrapperRef}
      aria-label="Interactive beat gallery"
      style={{ width: '100%', height: '520px', position: 'relative', borderRadius: 16, border: 'none', background: 'transparent', overflow: 'hidden', contain: 'layout paint', maxWidth: '100%' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 10,
          color: 'var(--accent)',
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: 0.2,
          textShadow: '0 2px 10px rgba(0,0,0,0.45)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        Click on a hexagon!
      </div>

      <aside
        style={{
          position: 'absolute',
          left: isMobilePanel ? 8 : panelPos.x,
          top: isMobilePanel ? 8 : panelPos.y,
          width: isMobilePanel ? 'calc(100% - 16px)' : 330,
          maxHeight: isMobilePanel ? '52%' : 'calc(100% - 24px)',
          overflowY: 'auto',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.5)',
          background: 'linear-gradient(160deg, rgba(28,30,38,0.97), rgba(22,24,31,0.92))',
          backdropFilter: 'blur(18px) saturate(175%)',
          WebkitBackdropFilter: 'blur(18px) saturate(175%)',
          padding: 10,
          zIndex: 7,
          boxShadow: '0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            pointerEvents: 'none',
            background: 'radial-gradient(120% 70% at 14% 0%, rgba(255,255,255,0.24), rgba(255,255,255,0) 52%), radial-gradient(100% 60% at 100% 100%, rgba(120,180,255,0.15), rgba(120,180,255,0) 55%)',
          }}
        />
        <div
          onPointerDown={onPanelDragStart}
          style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, cursor: isMobilePanel ? 'default' : 'grab', userSelect: 'none' }}
        >
          <strong style={{ fontSize: isMobilePanel ? 13 : 14 }}>Beat Finder</strong>
          <small style={{ color: 'var(--muted)' }}>{filteredBeats.length} match{filteredBeats.length === 1 ? '' : 'es'}</small>
        </div>

        {isMobilePanel && (
          <button type="button" onClick={() => setMobileCollapsed((v) => !v)} style={{ width: '100%', height: 34, marginBottom: 8, background: '#24262d', color: '#fff', border: '1px solid rgba(255,255,255,0.22)' }}>
            {mobileCollapsed ? 'Open Filters' : 'Hide Filters'}
          </button>
        )}

        {(!isMobilePanel || !mobileCollapsed) && (
          <>
            <label style={{ position: 'relative', display: 'grid', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginBottom: 8 }}>
              Search
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, mood, tags..." style={{ height: 34, fontSize: 13 }} />
            </label>

            <label style={{ position: 'relative', display: 'grid', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginBottom: 8 }}>
              Key
              <select value={keySearch} onChange={(e) => setKeySearch(e.target.value)} style={{ height: 34, fontSize: 13 }}>
                <option value="">All keys</option>
                {keyOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </label>

            <label style={{ position: 'relative', display: 'grid', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginBottom: 8 }}>
              Genre
              <select value={genreSearch} onChange={(e) => setGenreSearch(e.target.value)} style={{ height: 34, fontSize: 13 }}>
                <option value="">All genres</option>
                {genreOptions.map((value) => <option key={value} value={value}>{toTitleCase(value)}</option>)}
              </select>
            </label>

            <label style={{ position: 'relative', display: 'grid', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginBottom: 8 }}>
              Instruments
              <select value={instrumentSearch} onChange={(e) => setInstrumentSearch(e.target.value)} style={{ height: 34, fontSize: 13 }}>
                <option value="">All instruments</option>
                {instrumentOptions.map((value) => <option key={value} value={value}>{toTitleCase(value)}</option>)}
              </select>
            </label>

            <label style={{ position: 'relative', display: 'grid', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginBottom: 8 }}>
              BPM Range
              <select value={bpmRange} onChange={(e) => setBpmRange(e.target.value)} style={{ height: 34 }}>
                {BPM_RANGES.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
              </select>
            </label>

            <div style={{ marginBottom: 8 }}>
              <small style={{ display: 'block', marginBottom: 6, color: 'rgba(255,255,255,0.82)', fontWeight: 700 }}>Moods (multi-select)</small>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => toggleChoice(mood, selectedMoods, setSelectedMoods)}
                    style={{
                      padding: '5px 9px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.25)',
                      background: selectedMoods.includes(mood) ? 'rgba(228,160,16,0.42)' : 'rgba(14,15,20,0.74)',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  >
                    {toTitleCase(mood)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <small style={{ display: 'block', marginBottom: 6, color: 'rgba(255,255,255,0.82)', fontWeight: 700 }}>Tags (multi-select)</small>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleChoice(tag, selectedTags, setSelectedTags)}
                    style={{
                      padding: '5px 9px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.25)',
                      background: selectedTags.includes(tag) ? 'rgba(83,179,255,0.42)' : 'rgba(14,15,20,0.74)',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  >
                    #{toTitleCase(tag)}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} style={{ width: '100%', height: 34, background: '#1f2024', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>
                Reset Filters
              </button>
            )}
            {filteredBeats.length === 0 && (
              <small style={{ marginTop: 8, display: 'block', color: '#ffd1b6', fontWeight: 700 }}>No beats match these filters.</small>
            )}
          </>
        )}
      </aside>
    </div>
  )
}

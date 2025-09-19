// src/lib/dynamic_visualiser.js

const BANDS = {
  sub: [20, 60],
  low: [60, 250],
  mid: [250, 2000],
  high: [2000, 20000],
}

export class DynamicVisualiser {
  constructor(audioEl) {
    if (!audioEl) throw new Error('Audio element not provided')
    this.audioEl = audioEl
    this.audioCtx = null
    this.source = null
    this.analyser = null
    this.freqData = null
  }

  connect() {
    if (this.audioCtx) return // Already connected
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      this.source = this.audioCtx.createMediaElementSource(this.audioEl)
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 2048
      this.source.connect(this.analyser)
      this.analyser.connect(this.audioCtx.destination)
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount)
    } catch (e) {
      console.error('Failed to initialize Web Audio API', e)
    }
  }

  getAnalysis() {
    if (!this.analyser) return { sub: 0, low: 0, mid: 0, high: 0 }

    this.analyser.getByteFrequencyData(this.freqData)

    const bandEnergy = { sub: 0, low: 0, mid: 0, high: 0 }
    const bandCounts = { sub: 0, low: 0, mid: 0, high: 0 }

    const nyquist = this.audioCtx.sampleRate / 2
    const binWidth = nyquist / this.analyser.frequencyBinCount

    for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
      const freq = i * binWidth
      const energy = this.freqData[i] / 255 // Normalize to 0-1

      if (freq >= BANDS.sub[0] && freq < BANDS.sub[1]) {
        bandEnergy.sub += energy
        bandCounts.sub++
      } else if (freq >= BANDS.low[0] && freq < BANDS.low[1]) {
        bandEnergy.low += energy
        bandCounts.low++
      } else if (freq >= BANDS.mid[0] && freq < BANDS.mid[1]) {
        bandEnergy.mid += energy
        bandCounts.mid++
      } else if (freq >= BANDS.high[0] && freq < BANDS.high[1]) {
        bandEnergy.high += energy
        bandCounts.high++
      }
    }

    const avgEnergy = {
      sub: bandCounts.sub > 0 ? bandEnergy.sub / bandCounts.sub : 0,
      low: bandCounts.low > 0 ? bandEnergy.low / bandCounts.low : 0,
      mid: bandCounts.mid > 0 ? bandEnergy.mid / bandCounts.mid : 0,
      high: bandCounts.high > 0 ? bandEnergy.high / bandCounts.high : 0,
    }

    return avgEnergy
  }
}

export function getContrastColor(hexColor) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1A1410' : '#FAF7F2'
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 }
}

export function formatHex(hex) {
  return hex.toUpperCase()
}

export function getRgbString(hex) {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function savePalette(palette, name) {
  const saved = getSavedPalettes()
  const newPalette = { id: Date.now(), name, colors: palette, date: new Date().toISOString() }
  saved.unshift(newPalette)
  localStorage.setItem('saved_palettes', JSON.stringify(saved.slice(0, 20)))
  return newPalette
}

export function getSavedPalettes() {
  try {
    return JSON.parse(localStorage.getItem('saved_palettes') || '[]')
  } catch {
    return []
  }
}

export function deleteSavedPalette(id) {
  const saved = getSavedPalettes().filter(p => p.id !== id)
  localStorage.setItem('saved_palettes', JSON.stringify(saved))
}

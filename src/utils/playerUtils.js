export function cleanPlayerName(name) {
  return String(name || '')
    .replace(/KODIK>/, 'Kodik - ')
    .replace(/VEOVEO>/, 'VeoVeo - ')
    .replace(/KINOBOX>/, '')
    .trim()
}


export function getProviderDisplayName(player) {
  return player.name
}


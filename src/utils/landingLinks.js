/** Externe Smartium-app. Alle CTA's op de landing verwijzen hierheen. */
export const APP_URL = 'https://app.smartium.nl'

export function assetUrl(relativePath) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${relativePath.replace(/^\//, '')}`
}

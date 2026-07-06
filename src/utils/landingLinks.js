import { useAuth } from '../context/AuthContext'

export function assetUrl(relativePath) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${relativePath.replace(/^\//, '')}`
}

export function getStartedPath() {
  return '/login'
}

export function useGetStartedPath() {
  const { user } = useAuth()
  return user ? '/summary' : '/login'
}

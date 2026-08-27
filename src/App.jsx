import { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './landing/HomePage'
import OverOnsPage from './landing/OverOnsPage'
import ContactPage from './landing/ContactPage'
import { scrollPageToTop } from './landing/smoothScroll'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    scrollPageToTop()
  }, [pathname, search])

  useEffect(() => {
    scrollPageToTop()
    const id = requestAnimationFrame(() => scrollPageToTop())
    // Lenis start async; opnieuw forceren na mount
    const t1 = window.setTimeout(scrollPageToTop, 50)
    const t2 = window.setTimeout(scrollPageToTop, 200)
    return () => {
      cancelAnimationFrame(id)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [pathname, search])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/over-ons" element={<OverOnsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { initLenis } from './lib/lenis'
import { ScrollTrigger } from './lib/gsap'
import { TransitionProvider } from './components/Transition'
import Menu from './components/Menu'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Footer from './components/Footer'
import { LeadProvider } from './components/LeadModal'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function Pages() {
  const location = useLocation()
  return (
    <main key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default function App() {
  useEffect(() => {
    initLenis()
    // refresh trigger positions once images/fonts settle
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <TransitionProvider>
      <LeadProvider>
        <Preloader />
        <Menu />
        <Pages />
        <Cursor />
      </LeadProvider>
    </TransitionProvider>
  )
}

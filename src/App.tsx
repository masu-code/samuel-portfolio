import Nav, { NAV_LINKS } from './components/layout/Nav'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Software from './components/sections/Software'
import { useScrollSpy } from './hooks/useScrollSpy'

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace('#', ''))

function App() {
  const activeId = useScrollSpy(SECTION_IDS)

  return (
    <>
      <Nav activeHref={`#${activeId}`} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Software />
      </main>
      <Footer />
    </>
  )
}

export default App

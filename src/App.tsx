import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowDown, ArrowUpRight, Code2, CircleUserRound, Mail, Sparkles } from 'lucide-react'

const projects = [
  { index: '01', name: 'Bikes R Us', type: 'Sales & returns module · NAIT team project', stack: ['Blazor Server', 'MudBlazor', 'EF Core', 'SQL Server'], tone: 'blue', href: 'https://github.com/firzenfu' },
  { index: '02', name: 'Job Board', type: 'Full-stack coursework application', stack: ['Next.js', 'Prisma', 'REST API', 'Jest'], tone: 'violet', href: 'https://github.com/firzenfu' },
  { index: '03', name: 'Next Experiment', type: 'AI-native product — in progress', stack: ['AI Workflow', 'TypeScript', 'Product Design'], tone: 'amber', href: 'https://github.com/firzenfu' },
]

const skills = [
  { n: '01', title: 'Frontend', text: 'HTML5, CSS3, JavaScript, TypeScript, React, Next.js and responsive interface development.' },
  { n: '02', title: 'Backend', text: 'C#/.NET, Blazor Server, SQL Server, Entity Framework Core, Prisma and REST APIs.' },
  { n: '03', title: 'AI Workflow', text: 'GitHub Copilot and Claude used daily for development, debugging, content and automation.' },
  { n: '04', title: 'Communication', text: 'Fluent in English and Mandarin, with native Cantonese for multilingual collaboration.' },
]

const reveal = { initial: { opacity: 0, y: 36, filter: 'blur(10px)' }, whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' }, viewport: { once: true, margin: '-8%' }, transition: { duration: .8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }

function App() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => { cancelAnimationFrame(frame); lenis.destroy(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return <>
    <motion.div className="progress" style={{ scaleX: progress }} />
    <header className={scrolled ? 'nav scrolled' : 'nav'}>
      <a className="mark" href="#top">FF<span>.</span></a>
      <nav><a href="#about">About</a><a href="#work">Work</a><a href="#expertise">Expertise</a></nav>
      <a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={14}/></a>
    </header>

    <main>
      <section className="hero" id="top">
        <div className="hero-atmosphere"><i/><i/><i/></div>
        <div className="noise" />
        <div className="eyebrow"><span/> Edmonton, Canada · Available for work</div>
        <div className="hero-title">
          <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16,1,.3,1] }}>BUILDING</motion.h1>
          <motion.h1 className="outline" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [0.16,1,.3,1] }}>DIGITAL</motion.h1>
          <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .16, ease: [0.16,1,.3,1] }}>EXPERIENCES</motion.h1>
        </div>
        <div className="hero-bottom">
          <p><b>Franky Fu</b><br/>Software engineer crafting modern web products with AI-assisted development.</p>
          <a href="#work" className="round-link"><ArrowDown size={20}/><span>Explore work</span></a>
        </div>
      </section>

      <section className="statement shell">
        <motion.p {...reveal}>I build modern web applications with <em>engineering precision</em> and AI-powered workflows.</motion.p>
        <div className="ticker"><span>REACT</span><i/> <span>NEXT.JS</span><i/> <span>.NET</span><i/> <span>AI</span><i/> <span>DESIGN</span></div>
      </section>

      <section className="about shell" id="about">
        <div className="section-label"><span>01</span> About</div>
        <div className="about-grid">
          <motion.div className="portrait" {...reveal}>
            <img src="/images/franky-avatar.jpg" alt="Franky Fu avatar" />
            <span>Franky Fu · Edmonton</span>
          </motion.div>
          <motion.div className="about-copy" {...reveal}>
            <p className="kicker">Hello. I’m Franky Fu.</p>
            <h2>Developer by training.<br/><span>Designer in spirit.</span></h2>
            <p>I’m a Software Development Diploma student at NAIT, graduating in April 2026. I build full-stack web applications across React, Next.js, C#/.NET and Blazor, and integrate AI tools into daily development while reviewing every result with care.</p>
            <div className="facts"><div><b>2026</b><span>NAIT Graduate</span></div><div><b>2</b><span>Featured builds</span></div><div><b>3</b><span>Languages</span></div></div>
          </motion.div>
        </div>
      </section>

      <section className="work shell" id="work">
        <div className="section-label"><span>02</span> Selected work</div>
        <motion.div className="section-heading" {...reveal}><h2>Projects built to<br/>solve, not decorate.</h2><p>A selection of product and engineering work across modern web stacks.</p></motion.div>
        <div className="project-list">
          {projects.map((p) => <motion.a {...reveal} className={`project ${p.tone}`} href={p.href} target="_blank" rel="noreferrer" key={p.name}>
            <div className="project-visual">{p.index === '01' ? <div className="bikes-screens">
              <img className="screen-sales" src="/images/bikes-r-us-sales.png" alt="Bikes R Us customer search and sales workflow" />
              <img className="screen-returns" src="/images/bikes-r-us-returns.png" alt="Bikes R Us returns workflow" />
            </div> : p.index === '02' ? <div className="job-screen">
              <span>Next.js · Prisma · REST API</span>
              <img src="/images/job-board.png" alt="Job Board open positions and application interface" />
            </div> : <div className="window"><div className="window-bar"><i/><i/><i/></div><div className="window-content"><span>{p.index}</span><b>{p.name}</b><small>CASE STUDY</small></div></div>}</div>
            <div className="project-meta"><span>{p.index}</span><div><h3>{p.name}</h3><p>{p.type}</p><div className="tags">{p.stack.map(s=><em key={s}>{s}</em>)}</div></div><ArrowUpRight/></div>
          </motion.a>)}
        </div>
      </section>

      <section className="expertise shell" id="expertise">
        <div className="section-label"><span>03</span> Expertise</div>
        <motion.div className="section-heading" {...reveal}><h2>One mind.<br/>Multiple modes.</h2><p>From architecture to interface, I work across the product surface.</p></motion.div>
        <div className="skill-grid">{skills.map(s=><motion.article {...reveal} key={s.title}><span>{s.n}</span><Sparkles/><h3>{s.title}</h3><p>{s.text}</p></motion.article>)}</div>
      </section>

      <section className="github shell">
        <div className="github-card">
          <div><Code2/><span>Open source & experiments</span></div>
          <h2>Follow the work,<br/>not just the highlights.</h2>
          <a href="https://github.com/firzenfu" target="_blank" rel="noreferrer">github.com/firzenfu <ArrowUpRight/></a>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-glow"/>
        <div className="section-label"><span>04</span> Contact</div>
        <motion.div {...reveal}><p>Have a project, role, or interesting idea?</p><h2>LET’S BUILD<br/><span>SOMETHING GREAT.</span></h2></motion.div>
        <a className="email" href="mailto:firzenfu@gmail.com">firzenfu@gmail.com <ArrowUpRight/></a>
        <footer><span>© 2026 Franky Fu</span><div><a href="https://github.com/firzenfu"><Code2/> GitHub</a><a href="/Franky_Fu_Resume.docx" download><CircleUserRound/> Resume</a><a href="mailto:firzenfu@gmail.com"><Mail/> Email</a></div><a href="#top">Back to top ↑</a></footer>
      </section>
    </main>
  </>
}

export default App

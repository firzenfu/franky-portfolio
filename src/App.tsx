import { FormEvent, PointerEvent, useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowDown, ArrowUpRight, Code2, Mail, MapPin, Send, Sparkles } from 'lucide-react'

const projects = [
  { number: '01', title: 'Bikes R Us', subtitle: 'Sales & Returns System', year: '2025', image: '/images/bikes-r-us-sales.png', href: 'https://github.com/firzenfu', stack: ['Blazor Server', 'MudBlazor', 'EF Core', 'SQL Server'] },
  { number: '02', title: 'Job Board', subtitle: 'Recruitment Web App', year: '2025', image: '/images/job-board.png', href: 'https://github.com/firzenfu', stack: ['Next.js', 'Prisma', 'REST API', 'Jest'] },
  { number: '03', title: 'Next Experiment', subtitle: 'AI-native Product', year: 'Soon', image: '/images/next-experiment-v2.png', href: 'https://github.com/firzenfu', stack: ['AI Workflow', 'TypeScript', 'Product Design'] },
]

const experience = [
  { period: '2024 — 2026', company: 'NAIT', role: 'Software Development', description: 'Full-stack development across modern frontend, backend, database and testing workflows.' },
  { period: '2021 — 2022', company: 'Victoria International Tubular', role: 'Quality Control', description: 'Maintained precise production records and communicated findings across teams.' },
  { period: '2020 — 2021', company: 'Tokyo Express / UW Insure', role: 'Operations & Accounting', description: 'Led daily operations and managed confidential financial records with accuracy.' },
]

const skills = [
  { icon: 'FE', title: 'Frontend Engineering', text: 'React, Next.js, TypeScript, HTML5 and CSS3 for responsive, accessible product interfaces.', tags: ['React', 'Next.js', 'TypeScript'] },
  { icon: 'BE', title: 'Backend Systems', text: 'C#/.NET, Blazor Server, SQL Server, Entity Framework Core, Prisma and REST APIs.', tags: ['.NET', 'Blazor', 'SQL'] },
  { icon: 'AI', title: 'AI Workflow', text: 'GitHub Copilot and Claude integrated into development, debugging and automation.', tags: ['Copilot', 'Claude', 'Automation'] },
  { icon: 'UX', title: 'Product Craft', text: 'A visual eye for hierarchy, interaction, clarity and polished digital experiences.', tags: ['Figma', 'Canva', 'UI'] },
  { icon: 'CM', title: 'Communication', text: 'English, Mandarin and native Cantonese for thoughtful multilingual collaboration.', tags: ['English', 'Mandarin', 'Cantonese'] },
]

const reveal = {
  initial: { opacity: 0, y: 42, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-10%' },
  transition: { duration: .85, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    const onScroll = () => setScrolled(window.scrollY > 44)
    window.addEventListener('scroll', onScroll)
    return () => { cancelAnimationFrame(frame); lenis.destroy(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const trackProject = (event: PointerEvent<HTMLAnchorElement>, index: number) => {
    setActiveProject(index)
    setPointer({ x: event.clientX, y: event.clientY })
  }

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`)
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`)
    window.location.href = `mailto:firzenfu@gmail.com?subject=${subject}&body=${body}`
  }

  return <>
    <motion.div className="progress" style={{ scaleX: progress }} />
    <div className="lamp" aria-hidden="true"><div className="lamp-beam"/><div className="lamp-line"/><div className="orb orb-one"/><div className="orb orb-two"/></div>

    <header className={scrolled ? 'nav scrolled' : 'nav'}>
      <div className="nav-pill">
        <a className="brand" href="#top"><span>FF</span><i/></a>
        <nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Works</a><a href="#skills">Skills</a></nav>
        <a className="nav-contact" href="#contact">Let's talk <ArrowUpRight size={14}/></a>
      </div>
    </header>

    <main>
      <section className="hero" id="top">
        <div className="hero-content">
          <motion.div className="availability" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}><i/> Edmonton, Canada &middot; Available for work</motion.div>
          <div className="hero-lines">
            <div><motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16,1,.3,1] }}>FRANKY</motion.h1></div>
            <div><motion.h1 className="accent-word" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease: [0.16,1,.3,1] }}>FU</motion.h1><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}>SOFTWARE<br/>DEVELOPER</motion.span></div>
            <div><motion.h1 className="outline-word" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: .16, ease: [0.16,1,.3,1] }}>PORTFOLIO</motion.h1></div>
          </div>
          <div className="hero-bottom"><p>I build modern web applications with engineering precision and AI-powered workflows.</p><a href="#about"><ArrowDown/><span>Discover</span></a></div>
        </div>
      </section>

      <section className="intro container">
        <motion.p {...reveal}>Turning complex ideas into <span>clear, useful digital products</span> across design, code and AI.</motion.p>
        <div className="tech-marquee"><span>REACT</span><i/><span>NEXT.JS</span><i/><span>.NET</span><i/><span>BLAZOR</span><i/><span>AI WORKFLOW</span></div>
      </section>

      <section className="about container" id="about">
        <SectionHead number="01" label="About me" title={<>Developer by training.<br/><span>Designer in spirit.</span></>} description="A full-stack developer with a visual eye and an AI-enhanced workflow." />
        <div className="about-layout">
          <motion.div className="avatar-wrap" {...reveal}>
            <div className="avatar-card"><img src="/images/franky-avatar.jpg" alt="Franky Fu avatar"/><div className="avatar-caption"><span>Franky Fu</span><span>Edmonton &middot; CA</span></div></div>
          </motion.div>
          <motion.div className="bio" {...reveal}>
            <p className="bio-lead">Hello, I'm Franky.</p>
            <p>I'm a Software Development Diploma student at NAIT, graduating in 2026. I build full-stack applications with React, Next.js, C#/.NET and Blazor, using AI tools thoughtfully throughout the development process.</p>
            <div className="bio-info"><div><small>EDUCATION</small><b>NAIT Software Development</b></div><div><small>LOCATION</small><b>Edmonton, Alberta</b></div></div>
            <div className="stats"><div><strong>02</strong><span>Featured projects</span></div><div><strong>03</strong><span>Languages</span></div><div><strong>2026</strong><span>Graduation</span></div></div>
            <div className="building"><small>BUILDING WITH</small><div><span>React</span><span>Next.js</span><span>.NET</span><span>Blazor</span><span>AI</span></div></div>
          </motion.div>
        </div>

        <motion.div className="career" {...reveal}>
          <div className="career-title"><span>CAREER JOURNEY</span><span>Experience</span></div>
          <div className="timeline-line"><i/><i/><i/></div>
          <div className="experience-grid">{experience.map(item => <article key={item.company}><span>{item.period}</span><h3>{item.company}</h3><em>{item.role}</em><p>{item.description}</p></article>)}</div>
        </motion.div>
      </section>

      <section className="works container" id="work">
        <SectionHead number="02" label="Selected works" title={<>Work that solves,<br/><span>not just decorates.</span></>} description="Selected product and engineering work across modern web stacks." />
        <div className="work-list">{projects.map((project, index) => <motion.a {...reveal} href={project.href} target="_blank" rel="noreferrer" className="work-row" key={project.title} onPointerEnter={e => trackProject(e,index)} onPointerMove={e => trackProject(e,index)} onPointerLeave={() => setActiveProject(null)}>
          <span className="work-number">{project.number}</span>
          <div className="work-info"><h3>{project.title}</h3><p>{project.subtitle}</p><div>{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          <span className="work-year">{project.year}</span><ArrowUpRight/>
        </motion.a>)}</div>
        {activeProject !== null && <div className="work-preview" style={{ left: pointer.x, top: pointer.y }}><img src={projects[activeProject].image} alt=""/></div>}
      </section>

      <section className="skills container" id="skills">
        <SectionHead number="03" label="Capabilities" title={<>One mind.<br/><span>Multiple modes.</span></>} description="From interface to database, I work across the product surface." />
        <div className="skill-grid">{skills.map((skill, index) => <motion.article {...reveal} className={index < 2 ? 'wide' : ''} key={skill.title}><div className="skill-icon">{skill.icon}</div><Sparkles/><h3>{skill.title}</h3><p>{skill.text}</p><div>{skill.tags.map(tag => <span key={tag}>{tag}</span>)}</div></motion.article>)}</div>
      </section>

      <section className="github container">
        <motion.div className="github-panel" {...reveal}><div><Code2/><span>OPEN SOURCE & EXPERIMENTS</span></div><h2>Follow the work,<br/><span>not just the highlights.</span></h2><a href="https://github.com/firzenfu" target="_blank" rel="noreferrer">github.com/firzenfu <ArrowUpRight/></a></motion.div>
      </section>

      <section className="contact container" id="contact">
        <div className="contact-grid">
          <motion.div className="contact-copy" {...reveal}><span>04 / CONTACT</span><h2>Let's build<br/><em>something great.</em></h2><p>Have a role, project or interesting idea? Tell me about it.</p><div><a href="mailto:firzenfu@gmail.com"><Mail/> firzenfu@gmail.com</a><span><MapPin/> Edmonton, Alberta</span></div></motion.div>
          <motion.form className="contact-form" onSubmit={sendMessage} {...reveal}>
            <label>Name<input name="name" placeholder="Your name" required/></label>
            <label>Email<input name="email" type="email" placeholder="you@email.com" required/></label>
            <label>Message<textarea name="message" placeholder="Tell me about your idea..." required/></label>
            <button type="submit">Send message <Send size={16}/></button>
          </motion.form>
        </div>
        <footer><span>© 2026 Franky Fu</span><div><a href="https://github.com/firzenfu">GitHub</a><a href="mailto:firzenfu@gmail.com">Email</a></div><a href="#top">Back to top ↑</a></footer>
      </section>
    </main>
  </>
}

function SectionHead({ number, label, title, description }: { number: string, label: string, title: React.ReactNode, description: string }) {
  return <motion.div className="section-head" {...reveal}><div className="section-label"><span>{number}</span>{label}</div><div className="section-title"><h2>{title}</h2><p>{description}</p></div></motion.div>
}

export default App

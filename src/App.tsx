import { HeroScene } from './components/HeroScene'
import { ProjectChapter } from './components/ProjectChapter'
import { SiteNav } from './components/SiteNav'
import { sceneMedia, type SceneKey } from './data/media'
import { projects } from './data/portfolio'

const projectMedia: SceneKey[] = ['bikes', 'jobs', 'experiment']

function App() {
  return (
    <>
      <SiteNav />
      <main>
        <HeroScene />

        <section className="interim-section about-section" id="about">
          <div className="section-shell section-grid">
            <h2>Developer by training. Designer in spirit.</h2>
            <div className="section-copy">
              <p>I'm a Software Development Diploma student at NAIT, graduating in 2026.</p>
              <p>I build full-stack applications with React, Next.js, C#/.NET, and Blazor, using AI tools thoughtfully.</p>
              <dl className="fact-list">
                <div><dt>Location</dt><dd>Edmonton, Alberta</dd></div>
                <div><dt>Languages</dt><dd>English, Mandarin, Cantonese</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-shell work-heading">
            <h2>Work that solves, not just decorates.</h2>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <ProjectChapter
                key={project.slug}
                project={project}
                media={sceneMedia[projectMedia[index]]}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="interim-section skills-section" id="skills">
          <div className="section-shell section-grid">
            <h2>One mind. Multiple modes.</h2>
            <div className="capability-list">
              <p><strong>Frontend engineering</strong> React, Next.js, TypeScript, HTML, and CSS.</p>
              <p><strong>Backend systems</strong> C#/.NET, Blazor Server, SQL Server, EF Core, Prisma, and REST APIs.</p>
              <p><strong>AI workflow</strong> Copilot and Claude integrated into development, debugging, and automation.</p>
              <p><strong>Product craft</strong> Clear hierarchy, accessible interaction, and polished digital experiences.</p>
            </div>
          </div>
        </section>

        <section className="interim-section contact-section" id="contact">
          <div className="section-shell contact-layout">
            <div>
              <h2>Let's talk.</h2>
              <p>Have a role, project, or interesting idea? Tell me about it.</p>
            </div>
            <div className="contact-links">
              <a href="mailto:firzenfu@gmail.com">firzenfu@gmail.com</a>
              <a href="https://github.com/firzenfu" target="_blank" rel="noreferrer">GitHub profile</a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App

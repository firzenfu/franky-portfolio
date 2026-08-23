import { AboutStatement } from './components/AboutStatement'
import { AiSupportDemo } from './components/AiSupportDemo'
import { BackgroundMusic } from './components/BackgroundMusic'
import { CapabilityIndex } from './components/CapabilityIndex'
import { ContactScene } from './components/ContactScene'
import { ExperienceTimeline } from './components/ExperienceTimeline'
import { HeroScene } from './components/HeroScene'
import { ProjectChapter } from './components/ProjectChapter'
import { MotionProjectChapter } from './components/MotionProjectChapter'
import { SiteNav } from './components/SiteNav'
import { AiSupportCaseStudy } from './components/AiSupportCaseStudy'
import { CommandPalette } from './components/CommandPalette'
import { WorksIndex } from './components/WorksIndex'
import { sceneMedia, type SceneKey } from './data/media'
import { spellBoundaryProject } from './data/motionProjects'
import { projects } from './data/portfolio'

const projectMedia: Partial<Record<string, SceneKey>> = {
  'bikes-r-us': 'bikes',
  'ai-support-assistant': 'experiment',
}

function App() {
  if (window.location.pathname === '/projects/ai-support-assistant') {
    return (
      <>
        <AiSupportCaseStudy />
        <CommandPalette />
      </>
    )
  }

  if (window.location.pathname === '/works') {
    return (
      <>
        <SiteNav />
        <BackgroundMusic />
        <WorksIndex />
        <CommandPalette />
      </>
    )
  }

  const featuredProjects = projects.filter((project) => (
    project.slug === 'bikes-r-us' || project.slug === 'ai-support-assistant'
  ))

  return (
    <>
      <SiteNav />
      <BackgroundMusic />
      <main>
        <HeroScene />
        <AboutStatement />

        <section className="work-section" id="work">
          <div className="section-shell work-heading">
            <h2>Work that solves, not just decorates.</h2>
          </div>
          <div className="project-list">
            {featuredProjects.map((project, index) => (
              <ProjectChapter
                key={project.slug}
                project={project}
                media={sceneMedia[projectMedia[project.slug] ?? 'experiment']}
                index={index}
              />
            ))}
            <MotionProjectChapter project={spellBoundaryProject} />
          </div>
          <div className="work-index-cta">
            <p>Products, experiments, games, and motion work live in one growing archive.</p>
            <a className="button button-primary" href="/works">View all works</a>
          </div>
          <AiSupportDemo />
        </section>

        <CapabilityIndex />
        <ExperienceTimeline />
        <ContactScene />
      </main>
      <CommandPalette />
    </>
  )
}

export default App

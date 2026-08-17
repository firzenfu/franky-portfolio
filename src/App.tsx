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
import { sceneMedia, type SceneKey } from './data/media'
import { projects } from './data/portfolio'

const projectMedia: SceneKey[] = ['bikes', 'jobs', 'experiment']

function App() {
  if (window.location.pathname === '/projects/ai-support-assistant') {
    return (
      <>
        <AiSupportCaseStudy />
        <CommandPalette />
      </>
    )
  }

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
            {projects.map((project, index) => (
              <ProjectChapter
                key={project.slug}
                project={project}
                media={sceneMedia[projectMedia[index]]}
                index={index}
              />
            ))}
            <MotionProjectChapter />
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

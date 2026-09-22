import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { workCategories, workItems, type WorkFilter } from '../data/works'

export function WorksIndex() {
  const [filter, setFilter] = useState<WorkFilter>('All')
  const reducedMotion = Boolean(useReducedMotion())
  const visibleWorks = useMemo(
    () => filter === 'All' ? workItems : workItems.filter((work) => work.category === filter),
    [filter],
  )

  return (
    <main className="works-page" id="top">
      <section className="works-hero" aria-labelledby="works-title">
        <div className="works-hero-copy">
          <p>Selected and ongoing work</p>
          <h1 id="works-title">Built across product, AI, and motion.</h1>
        </div>
        <div className="works-hero-note">
          <span>{workItems.length.toString().padStart(2, '0')} projects</span>
          <p>A growing archive of software systems, experiments, and visual stories.</p>
        </div>
      </section>

      <section className="works-catalogue" aria-label="Project archive">
        <div className="works-toolbar">
          <p>Browse by discipline</p>
          <div className="works-filters" aria-label="Filter works">
            {workCategories.map((category) => (
              <button
                key={category}
                className={filter === category ? 'is-active' : ''}
                type="button"
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div className="works-grid" layout={!reducedMotion}>
          {visibleWorks.map((work, index) => (
            <motion.article
              className="work-card"
              key={work.id}
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: reducedMotion ? 0 : Math.min(index * 0.04, 0.16) }}
            >
              <a
                className="work-card-link"
                href={work.href}
                target={work.external ? '_blank' : undefined}
                rel={work.external ? 'noreferrer' : undefined}
                aria-label={`View ${work.title}`}
              >
                <figure className="work-card-media">
                  <img src={work.image} alt={work.imageAlt} loading={index > 1 ? 'lazy' : 'eager'} />
                </figure>
                <div className="work-card-body">
                  <div className="work-card-index" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{work.category}</span>
                    <span>{work.year}</span>
                  </div>
                  <h2>{work.title}</h2>
                  <p className="work-card-subtitle">{work.subtitle}</p>
                  <p className="work-card-summary">{work.summary}</p>
                  <ul aria-label={`${work.title} tools`}>
                    {work.tools.slice(0, 4).map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                  <span className="work-card-action">{work.actionLabel ?? 'Open project'} <span aria-hidden="true">↗</span></span>
                </div>
              </a>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <footer className="works-footer">
        <p>More work is always in progress.</p>
        <a href="/#contact">Start a conversation</a>
      </footer>
    </main>
  )
}

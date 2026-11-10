import { tools } from '../data/tools'

export function ToolsPage() {
  return (
    <main className="works-page tools-page" id="top">
      <section className="works-hero tools-hero" aria-labelledby="tools-title">
        <div className="works-hero-copy">
          <p>實用工具 / Utilities</p>
          <h1 id="tools-title">Tools for everyday decisions.</h1>
        </div>
        <div className="works-hero-note">
          <span>{tools.length} {tools.length === 1 ? 'tool' : 'tools'}</span>
          <p>A collection of useful tools for comparing, tracking, and making sense of everyday information.</p>
        </div>
      </section>
      <section className="tools-directory" aria-label="Available tools">
        {tools.map((tool) => (
          <article className="tool-entry" key={tool.id} aria-labelledby={`${tool.id}-title`}>
            <a className="tool-preview" href={tool.href} target="_blank" rel="noreferrer" aria-label={`Preview ${tool.title} (owner access only)`}>
              <img src={tool.image} alt="GPU Ticker 顯卡行情 dashboard showing Canadian price snapshots, watchlists, and store comparisons" />
            </a>
            <div className="tool-details">
              <p className="tool-access-label">私人展示 / Private preview</p>
              <h2 id={`${tool.id}-title`}>{tool.title}</h2>
              <p className="tool-subtitle">{tool.subtitle}</p>
              <p className="tool-description">{tool.description}</p>
              <ul className="tool-features" aria-label={`${tool.title} features`}>
                {tool.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <p className="tool-note">{tool.dataNote}</p>
              <p className="tool-note" id={`${tool.id}-access`}>{tool.accessNote}</p>
              <a className="button button-primary" href={tool.href} target="_blank" rel="noreferrer" aria-describedby={`${tool.id}-access`}>
                Open private preview <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </section>
      <footer className="works-footer">
        <p>Useful ideas, made usable.</p>
        <a href="/#contact">Start a conversation</a>
      </footer>
    </main>
  )
}

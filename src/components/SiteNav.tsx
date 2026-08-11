export function SiteNav() {
  return (
    <header className="site-header">
      <div className="site-nav-shell">
        <a className="site-brand" href="#top">Home</a>
        <nav className="site-nav-links" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Works</a>
          <a href="#skills">Skills</a>
        </nav>
        <a className="nav-cta" href="#contact">Let's talk</a>
      </div>
    </header>
  )
}

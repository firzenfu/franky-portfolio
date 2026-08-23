export function SiteNav() {
  const isHome = window.location.pathname === '/'

  function homeHref(anchor: string) {
    return isHome ? anchor : `/${anchor}`
  }

  return (
    <header className="site-header">
      <div className="site-nav-shell">
        <a className="site-brand" href={homeHref('#top')}>Home</a>
        <nav className="site-nav-links" aria-label="Main navigation">
          <a href={homeHref('#about')}>About</a>
          <a href="/works" aria-current={isHome ? undefined : 'page'}>Works</a>
          <a href={homeHref('#skills')}>Skills</a>
        </nav>
        <a className="nav-cta" href={homeHref('#contact')}>Let's talk</a>
      </div>
    </header>
  )
}

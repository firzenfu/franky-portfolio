import type { FormEvent } from 'react'
import { sceneMedia } from '../data/media'
import { buildMailtoUrl } from '../lib/mailto'
import { SceneVideo } from './SceneVideo'

export function ContactScene() {
  const contactMedia = sceneMedia.contact

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const url = buildMailtoUrl({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    })

    window.location.href = url
  }

  return (
    <section className="contact-scene" id="contact">
      <SceneVideo
        className="contact-media"
        src={contactMedia.video}
        mobileSrc={contactMedia.mobileVideo}
        poster={contactMedia.poster}
      />
      <div className="section-shell contact-scene-layout">
        <div className="contact-intro">
          <h2>Bring me the next problem.</h2>
          <p>Have a product role, project, or useful idea? Send the context and I will get back to you.</p>
          <a className="contact-text-link" href="mailto:firzenfu@gmail.com" aria-label="Email Franky Fu">
            Let's talk
          </a>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows={5} required />
          </div>
          <button className="button button-primary contact-submit" type="submit">Send message</button>
        </form>
      </div>
      <footer className="section-shell site-footer">
        <p>Franky Fu. Software developer.</p>
        <a href="https://github.com/firzenfu" target="_blank" rel="noreferrer">GitHub profile</a>
      </footer>
    </section>
  )
}

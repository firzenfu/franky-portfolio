export type MotionProject = {
  id: string
  title: string
  subtitle: string
  kicker: string
  brief: string
  craft: string
  disciplines: string[]
  year: string
  video: string
  poster: string
  posterAlt: string
  videoTitle: string
  duration: number
}

export const monicaEverettProject: MotionProject = {
  id: 'monica-everett',
  title: 'Monica Everett',
  subtitle: 'Cinematic anime edit',
  kicker: 'Motion direction / 00:20 / 2026',
  brief: 'A compact character film that moves from quiet restraint to magical impact without losing visual continuity.',
  craft: 'Close framing, rhythmic reveals, color-led escalation, and sound shape a complete arc in twenty seconds.',
  disciplines: ['AI Direction', 'Editing', 'Sound Design', 'Visual Storytelling'],
  year: '2026',
  video: '/videos/monica-everett-cinematic-edit.mp4',
  poster: '/images/monica-everett-poster.jpg',
  posterAlt: 'Monica Everett anime character in a cinematic scene',
  videoTitle: 'Monica Everett cinematic anime edit',
  duration: 20.06,
}

export const spellBoundaryProject: MotionProject = {
  id: 'spell-boundary',
  title: '术式边界',
  subtitle: 'Concept trailer',
  kicker: 'Motion design / 00:10 / 2026',
  brief: 'A ten-second concept trailer that turns a static character illustration into a controlled magical awakening.',
  craft: 'Layered particles, light sweeps, camera motion, and timed escalation shape the boundary-opening reveal.',
  disciplines: ['Remotion', 'Art Direction', 'Motion Design', 'Compositing'],
  year: '2026',
  video: '/videos/spell-boundary-trailer.mp4',
  poster: '/images/spell-boundary-poster.jpg',
  posterAlt: 'White-haired spellcaster holding a crescent staff in a violet magical field',
  videoTitle: '术式边界 concept trailer',
  duration: 10.05,
}

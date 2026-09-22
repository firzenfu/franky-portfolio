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

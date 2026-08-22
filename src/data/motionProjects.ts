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
  subtitle: 'Turn-based squad RPG',
  kicker: 'Game design / Godot 4 / 2026',
  brief: 'An original Chinese-language squad RPG built around speed-based turns, shared skill points, elemental weaknesses, and toughness breaks.',
  craft: 'Designed eight operators, a playable three-character squad, battle UI, procedural combat effects, and full-screen ultimate cinematics.',
  disciplines: ['Godot 4', 'GDScript', 'Game Design', 'Combat UI'],
  year: '2026',
  video: '/videos/spell-boundary-trailer.mp4',
  poster: '/images/spell-boundary-battle.png',
  posterAlt: 'Turn-based battle scene from 术式边界 with three operators facing rock enemies',
  videoTitle: '术式边界 Baijin ultimate preview',
  duration: 5.09,
}

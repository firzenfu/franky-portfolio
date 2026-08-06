export type SceneKey = 'hero' | 'bikes' | 'jobs' | 'experiment' | 'contact'

export type SceneMedia = {
  video: string
  mobileVideo?: string
  poster: string
}

const referenceBase = 'https://raw.githubusercontent.com/ryota-kk/personal-homepage/main/assets'

export const sceneMedia: Record<SceneKey, SceneMedia> = {
  hero: { video: `${referenceBase}/scene1.mp4`, poster: '/images/franky-avatar.jpg' },
  bikes: { video: `${referenceBase}/scene2.mp4`, poster: '/images/bikes-r-us-sales.png' },
  jobs: { video: `${referenceBase}/scene2_idle_loop.mp4`, poster: '/images/job-board.png' },
  experiment: { video: `${referenceBase}/scene3.mp4`, poster: '/images/next-experiment-v2.png' },
  contact: { video: `${referenceBase}/transition_1_2.mp4`, poster: '/images/franky-avatar.jpg' },
}

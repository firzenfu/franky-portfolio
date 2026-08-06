export type MediaModeInput = {
  reducedMotion: boolean
  failed: boolean
}

export function selectMediaMode({ reducedMotion, failed }: MediaModeInput) {
  return reducedMotion || failed ? 'poster' : 'video'
}

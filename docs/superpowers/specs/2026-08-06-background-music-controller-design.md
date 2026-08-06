# Background Music Controller Design

## Design read

This is a cinematic developer portfolio for recruiters. The audio feature should deepen the atmosphere without becoming another primary call to action. It must preserve the existing cold-charcoal theme, acid-yellow accent, compact interaction language, and accessibility standards.

Design dials remain `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 8`, and `VISUAL_DENSITY: 3`.

## Goal

Add `Title_Arcana_Ver2.mp3` as optional looping background music. Playback begins only after the visitor's first click, touch, or keyboard interaction, satisfying browser autoplay restrictions. A fixed musical-note control lets the visitor mute or resume playback at any time.

## Asset contract

- Copy the supplied source file from `C:\Users\Admin\Downloads\Title_Arcana_Ver2.mp3` into a stable public audio path using a lowercase web-safe filename.
- Preserve the original MP3 without transcoding in this change.
- Load audio metadata only until the first eligible user interaction.
- Loop the track and set its playback volume to `0.22`.

## Interaction behavior

The controller has four meaningful states:

1. `idle`: no playback has been attempted in the current page session.
2. `playing`: the track is playing and the control exposes a mute action.
3. `muted`: playback is paused and the preference is persisted.
4. `unavailable`: loading or playback failed; the control is disabled without affecting the page.

On the first `pointerdown` or `keydown` interaction, the controller attempts playback once. The initiating event may occur anywhere on the document, including the controller itself. If a stored muted preference exists, automatic playback is skipped until the visitor explicitly activates the musical-note control.

Activating the control while playing pauses the track and stores the muted preference. Activating it while idle or muted attempts playback and clears the muted preference only after playback succeeds.

When the document becomes hidden, active audio pauses. When it becomes visible again, playback resumes only if the visitor had not muted it and playback had previously started. Visibility changes never override the stored preference.

## Visual design

- Place a fixed circular control in the lower-right safe area, clear of the contact form and mobile viewport edges.
- Use a musical-note glyph as the visible symbol; do not add an icon-library dependency for one control.
- Playing state uses the existing acid-yellow accent with dark foreground text.
- Idle and muted states use the existing cold-charcoal surface and muted foreground color.
- A restrained transform/opacity pulse may indicate active playback. It must stop under `prefers-reduced-motion`.
- Hover, active, and focus-visible states follow the existing interaction system and maintain WCAG AA contrast.
- The control remains secondary to `View work`, `Let's talk`, and form submission actions.

## Accessibility

- Render a native `button` with `type="button"`.
- Use state-specific accessible names: `Mute background music`, `Play background music`, or `Background music unavailable`.
- Expose pressed state with `aria-pressed` when the action is available.
- Ensure the visible musical note is hidden from assistive technology so the accessible name is unambiguous.
- Keyboard activation uses native button behavior; the first global key interaction must not interfere with form fields or anchor navigation.

## Architecture

Create a focused `BackgroundMusic` leaf component mounted once beside the navigation in `App`. It owns the audio element, playback state, preference persistence, first-interaction listener, visibility listener, and cleanup.

Keep small deterministic preference helpers separate only if doing so makes storage behavior independently testable. No global React context is needed because no other component consumes music state.

The audio element remains outside the tab order and is not announced. The button is the only interactive surface.

## Failure and edge cases

- Catch rejected `HTMLMediaElement.play()` promises. A browser-policy rejection keeps the control usable for a later explicit attempt; a media error moves to `unavailable`.
- Treat malformed or inaccessible stored values as the default unmuted preference.
- Remove global event listeners on successful first-interaction handling and on component unmount.
- Cancel visibility-based resume when the visitor mutes while the document is hidden.
- Do not restart the track on ordinary React rerenders.

## Testing

Use TDD with component-level tests covering:

- no playback before interaction;
- playback after the first eligible interaction;
- stored mute preference suppressing automatic playback;
- mute and resume behavior plus preference persistence;
- hidden-page pause and visible-page conditional resume;
- play-promise rejection without an unhandled error;
- media failure disabling the control;
- correct accessible names, pressed state, and reduced-motion-safe class behavior.

Run the focused test first, then the full Vitest suite and production build. Browser QA should confirm fixed placement, mobile clearance, focus visibility, contrast, first-interaction playback, mute persistence, and that the music does not restart during navigation.

## Explicit non-goals

- No playlist, timeline, volume slider, waveform, track title, equalizer, or visualizer.
- No forced playback before user interaction.
- No autoplay override tricks.
- No new primary CTA, icon package, or global state library.

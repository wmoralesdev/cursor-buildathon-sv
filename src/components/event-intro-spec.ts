/** ~8.67s @ 30fps — snappy pacing with seamless loop to frame 0. */
export const EVENT_INTRO_DURATION_FRAMES = 260;

/**
 * Frames added vs. legacy lock-out start at 26 (`lockOut.start = 26 + this`).
 * Full-opacity hold (after lock-in through last frame before lock-out) extends 1:1.
 * `lockIn` / `lockOut` ramp lengths are unchanged; composition length grows with larger holds.
 */
export const EVENT_INTRO_LOCK_HOLD_EXTRA_FRAMES = 34;

export const EVENT_INTRO_TIMELINE = {
  emptyStart: { startFrame: 0, endFrame: 6 },
  lockIn: { startFrame: 6, endFrame: 20 },
  lockHold: { startFrame: 20, endFrame: 60 },
  /** Cursor holds solo centered; × AI Labs slides in from the right. */
  ailabsJoin: { startFrame: 24, endFrame: 44 },
  lockOut: { startFrame: 60, endFrame: 74 },
  /** Header/footer chrome animates in place (final layout), overlaps end of lock out. */
  chromeIn: { startFrame: 62, endFrame: 78 },
  sponsorsIn: { startFrame: 80, endFrame: 162 },
  sponsorsHold: { startFrame: 162, endFrame: 202 },
  sponsorsOut: { startFrame: 202, endFrame: 220 },
  loopClose: { startFrame: 220, endFrame: 252 },
  emptyEnd: { startFrame: 252, endFrame: 260 },
} as const;

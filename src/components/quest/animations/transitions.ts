// Common transition presets for consistent animations throughout the quest system

// Standard transitions
export const defaultTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3
};

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

export const gentleSpringTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1
};

export const bounceTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 10,
  mass: 1.2
};

// Duration-based transitions
export const fastTransition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut'
};

export const slowTransition = {
  type: 'tween',
  duration: 0.6,
  ease: 'easeInOut'
};

// Easing presets
export const easeOutTransition = {
  type: 'tween',
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1] // Cubic bezier curve for easeOut
};

export const easeInOutTransition = {
  type: 'tween',
  duration: 0.5,
  ease: [0.42, 0, 0.58, 1] // Cubic bezier curve for easeInOut
};

// Special transitions
export const staggerChildrenTransition = {
  staggerChildren: 0.1,
  delayChildren: 0.1
};

export const dragTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 50
};

// Psychological comfort transitions
export const calmingTransition = {
  type: 'tween',
  duration: 0.7,
  ease: 'easeInOut'
};

export const trustTransition = {
  type: 'spring',
  stiffness: 70,
  damping: 20
};

// Export a map for easy access
export const transitions = {
  default: defaultTransition,
  spring: springTransition,
  gentleSpring: gentleSpringTransition,
  bounce: bounceTransition,
  fast: fastTransition,
  slow: slowTransition,
  easeOut: easeOutTransition,
  easeInOut: easeInOutTransition,
  staggerChildren: staggerChildrenTransition,
  drag: dragTransition,
  calming: calmingTransition,
  trust: trustTransition
};

export default transitions;
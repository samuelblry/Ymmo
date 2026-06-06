export const easeOut = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

export const spring = { type: 'spring', stiffness: 260, damping: 24 }

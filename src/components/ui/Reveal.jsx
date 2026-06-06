import { motion } from 'framer-motion'
import { fadeUp, stagger, staggerItem } from '../../lib/motion'

const viewport = { once: true, margin: '-80px' }

export function Reveal({ children, className, as = 'div', delay = 0 }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
    >
      {children}
    </Comp>
  )
}

export function Stagger({ children, className, as = 'div' }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({ children, className, as = 'div' }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp className={className} variants={staggerItem}>
      {children}
    </Comp>
  )
}

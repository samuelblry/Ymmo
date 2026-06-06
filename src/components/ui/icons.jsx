const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function SlidersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="8" cy="16" r="2" />
    </svg>
  )
}

export function HeartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.6-9.3-9C1.4 8.5 2.6 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.4 0 4.6 3.5 3.3 6-2.3 4.4-9.3 9-9.3 9Z" transform="translate(2 0)" />
    </svg>
  )
}

export function BedIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17v-5h13a4 4 0 0 1 4 4v1" />
      <path d="M3 8v9M21 17v2M3 12h0" />
      <path d="M7 12V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3" />
    </svg>
  )
}

export function BathIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12V6a2 2 0 0 1 4 0" />
      <path d="M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z" />
      <path d="M7 18l-1 2M18 18l1 2" />
    </svg>
  )
}

export function AreaIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 9h3M4 14h3M9 20v-3M14 20v-3" />
    </svg>
  )
}

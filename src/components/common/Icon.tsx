import type React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  size?: number
}

const paths: Record<string, React.ReactNode> = {
  home: <path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" />,
  cart: <><path d="M2 3h3l2.5 12h11L21 6H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  price: <><path d="m20 12-8 8-9-9V3h8z" /><circle cx="7.5" cy="7.5" r="1" /></>,
  filter: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" fill="var(--color-bg-primary)" /><circle cx="15" cy="12" r="2" fill="var(--color-bg-primary)" /><circle cx="9" cy="18" r="2" fill="var(--color-bg-primary)" /></>,
  sort: <><path d="M8 3v18m-4-4 4 4 4-4M16 21V3m-4 4 4-4 4 4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2z" />,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></>,
  map: <path d="m3 8 6-3 6 3 6-3v14l-6 3-6-3-6 3zM9 5v14m6-11v14" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  snow: <path d="M12 2v20M3.4 7l17.2 10M3.4 17 20.6 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4m13 9-4 1 1 4M4 14l4 1-1 4m13-9-4-1 1-4" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>,
  alert: <path d="m12 3 10 18H2zM12 9v5m0 3h.01" />,
  card: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20M6 15h3" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  tire: <><ellipse cx="12" cy="12" rx="8" ry="10" /><ellipse cx="12" cy="12" rx="3.5" ry="7" /><path d="m5 6 3 1M4 12h4m-3 6 3-1m8-10 3-1m-3 6h4m-4 5 3 1" /></>,
  wheel: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" /><path d="m12 10-2-7m4 8 7-1m-8 4 3 7m-5-7-5 5m4-8-7-3" /></>,
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={props['aria-label'] ? undefined : true}
    focusable="false"
    className={className}
    style={{ flexShrink: 0, ...props.style }}
    {...props}
  >
    {paths[name] || paths.info}
  </svg>
)

// Íconos SVG en línea (sin librerías externas)
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export const ChevronDown = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRight = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" {...base} strokeWidth={1.8} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.9-3.6 3.9-5.8 7.5-5.8s6.6 2.2 7.5 5.8" />
  </svg>
);

export const CalculatorIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth={1.8} {...props}>
    <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
    <rect x="8" y="5.5" width="8" height="3.5" rx="0.8" />
    <path d="M8.5 12.5h.01M12 12.5h.01M15.5 12.5h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 18.5h.01M12 18.5h.01M15.5 18.5h.01" strokeWidth={2.4} />
  </svg>
);

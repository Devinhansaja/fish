/** Central animation configuration (durations, easings) */
export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const duration = {
  micro: 0.2,
  base: 0.7,
  scenic: 14,
  page: 0.7,
};

/** Hard caps for decorative particles on small screens */
export const particleLimits = {
  desktop: { bubbles: 32, fish: 5 },
  mobile: { bubbles: 12, fish: 2 },
};

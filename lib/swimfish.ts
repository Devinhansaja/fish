/** Registry of the supplied swimming-fish videos (VP9 + alpha WebM, plus a still WebP fallback). */
export const swimFish = {
  tang: { file: "blue-tang", faces: "left" },
  angel: { file: "blue", faces: "right" },
  ray: { file: "ray", faces: "right" },
  clown: { file: "clown", faces: "right" },
} as const;

export type FishKind = keyof typeof swimFish;

"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { swimFish, type FishKind } from "@/lib/swimfish";

/**
 * Swimming fish from the supplied videos, keyed to real transparency (VP9 alpha WebM).
 * Safari/iOS cannot play VP9 alpha, so they get the still WebP frame instead; the fish still
 * swims across the page via CSS.
 *
 * `heading` is the direction the fish should face; the artwork is mirrored when needed.
 */
const noop = () => () => {};

function alphaVideoSupported() {
  const ua = navigator.userAgent;
  const webkitOnly = /iP(hone|ad|od)/.test(ua) || (/Safari/.test(ua) && !/Chrome|Chromium|Edg|Android|Firefox/.test(ua));
  if (webkitOnly) return false;
  return document.createElement("video").canPlayType('video/webm; codecs="vp9"') !== "";
}

export function useAlphaVideo() {
  return useSyncExternalStore(noop, alphaVideoSupported, () => false);
}

export function SwimFish({
  kind,
  heading = "right",
  className = "",
  paused = false,
  still = false,
  playbackRate = 1,
}: {
  kind: FishKind;
  heading?: "left" | "right";
  className?: string;
  paused?: boolean;
  /** always use the still image */
  still?: boolean;
  playbackRate?: number;
}) {
  const { file, faces } = swimFish[kind];
  const supported = useAlphaVideo();
  const ref = useRef<HTMLVideoElement>(null);
  const style = faces !== heading ? { transform: "scaleX(-1)" } : undefined;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = playbackRate;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused, playbackRate, supported, still]);

  if (!supported || still) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/media/${file}.webp`} alt="" aria-hidden="true" draggable={false} className={`block h-auto w-full select-none ${className}`} style={style} />
    );
  }
  return (
    <video
      ref={ref}
      className={`block h-auto w-full select-none ${className}`}
      style={style}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={`/media/${file}.webp`}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      disableRemotePlayback
    >
      <source src={`/media/${file}.webm`} type="video/webm" />
    </video>
  );
}

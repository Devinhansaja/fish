"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { destinations, origin } from "@/lib/site";
import { ease } from "@/lib/motion";

const W = 1000;
const H = 440;
const LAT_MAX = 80;
const LAT_MIN = -58;

const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;

/** Very coarse continent outlines [lon, lat] - used only to build a decorative dot-matrix map. */
const land: [number, number][][] = [
  // North America
  [[-168,66],[-150,71],[-125,70],[-100,70],[-85,70],[-80,63],[-94,58],[-82,52],[-78,57],[-70,60],[-62,57],[-56,52],[-65,45],[-70,42],[-76,38],[-76,34],[-81,31],[-80,26],[-83,29],[-90,29],[-97,27],[-97,21],[-90,21],[-87,21],[-88,16],[-83,15],[-83,10],[-78,8],[-80,7],[-86,11],[-92,15],[-98,16],[-105,20],[-110,24],[-117,32],[-121,35],[-124,40],[-124,47],[-130,54],[-140,60],[-152,59],[-165,55],[-160,60]],
  // Greenland
  [[-72,78],[-55,83],[-25,82],[-20,72],[-40,65],[-50,62],[-58,70]],
  // South America
  [[-78,8],[-72,12],[-62,10],[-52,5],[-50,0],[-44,-2],[-35,-6],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-65,-41],[-66,-47],[-69,-52],[-72,-52],[-74,-45],[-73,-37],[-71,-28],[-70,-18],[-76,-14],[-81,-6],[-80,0]],
  // Europe
  [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[10,57],[5,60],[5,62],[15,69],[25,71],[40,68],[30,60],[28,55],[30,48],[28,41],[22,37],[16,38],[12,38],[8,44],[3,43],[-5,36]],
  // British Isles
  [[-5,50],[2,51],[0,56],[-3,58],[-6,56]],
  [[-10,52],[-6,52],[-6,55],[-10,54]],
  // Africa
  [[-17,21],[-10,29],[-6,36],[10,37],[11,33],[20,31],[32,31],[34,28],[43,12],[51,12],[44,2],[40,-4],[40,-15],[35,-24],[32,-29],[27,-34],[20,-35],[17,-30],[12,-17],[13,-8],[9,-1],[9,4],[-5,5],[-13,8],[-17,14]],
  // Madagascar
  [[44,-25],[50,-15],[49,-13],[44,-17]],
  // Arabia
  [[35,30],[43,29],[48,30],[56,26],[59,22],[52,16],[44,12],[39,20]],
  // Asia
  [[40,68],[60,70],[80,73],[105,77],[130,72],[160,70],[180,68],[170,60],[162,57],[156,51],[142,54],[140,48],[135,43],[128,40],[126,35],[121,40],[122,30],[120,24],[110,20],[108,15],[105,9],[100,13],[100,5],[104,1],[98,8],[97,17],[92,22],[88,22],[80,15],[78,8],[73,16],[72,22],[67,25],[60,25],[56,26],[48,30],[43,37],[36,36],[28,41],[30,48],[30,60]],
  // Japan
  [[130,32],[135,34],[141,40],[142,45],[140,41],[136,36],[131,34]],
  // Sumatra, Borneo, Java, New Guinea, Philippines
  [[95,5],[98,4],[106,-6],[102,-4]],
  [[109,2],[117,7],[119,1],[116,-4],[110,-3]],
  [[105,-6],[114,-8],[106,-7]],
  [[131,-1],[141,-3],[150,-10],[142,-9],[135,-4]],
  [[120,18],[124,12],[126,7],[122,10]],
  // Australia, New Zealand
  [[114,-22],[122,-18],[130,-12],[136,-12],[142,-11],[146,-19],[153,-26],[150,-37],[145,-39],[138,-35],[131,-31],[115,-34]],
  [[172,-34],[178,-38],[174,-41],[168,-46],[172,-41]],
];

function inside(x: number, y: number, poly: [number, number][]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function buildDots() {
  const dots: { x: number; y: number }[] = [];
  for (let lat = LAT_MAX - 1; lat > LAT_MIN; lat -= 3.4) {
    for (let lon = -178; lon < 180; lon += 3.4) {
      if (land.some((p) => inside(lon, lat, p))) dots.push({ x: px(lon), y: py(lat) });
    }
  }
  return dots;
}

function arc(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const my = Math.min(y1, y2) - dist * 0.32;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

export function WorldExportMap() {
  const dots = useMemo(() => buildDots(), []);
  const [hover, setHover] = useState<string | null>(null);
  const o = { x: px(origin.lon), y: py(origin.lat) };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="World map showing placeholder export routes from Sri Lanka">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={2.1} fill="#6fd8e3" opacity={0.5} />
        ))}

        {destinations.map((d, i) => {
          const x = px(d.lon);
          const y = py(d.lat);
          const path = arc(o.x, o.y, x, y);
          const id = `route-${d.id}`;
          return (
            <g key={d.id}>
              <motion.path
                id={id}
                d={path}
                fill="none"
                stroke={hover === d.id ? "#ffd166" : "#00b4c6"}
                strokeWidth={hover === d.id ? 3 : 2}
                strokeLinecap="round"
                strokeDasharray="2 7"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.6, delay: 0.25 + i * 0.28, ease: ease.out }}
              />
              {/* plane travelling along the route */}
              <g className="motion-decor">
                <path d="M0 -6 L5 6 L0 3 L-5 6 Z" fill="#ffd166" transform="rotate(90)">
                  <animateMotion dur={`${7 + i * 1.3}s`} repeatCount="indefinite" rotate="auto" begin={`${1.5 + i * 0.4}s`}>
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </path>
              </g>
            </g>
          );
        })}

        {/* destination markers (placeholder) */}
        {destinations.map((d) => (
          <g key={d.id} transform={`translate(${px(d.lon)} ${py(d.lat)})`}>
            <circle r={5} fill="#ffd166" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "pulse-dot 2.6s ease-out infinite" }} opacity={0.7} />
            <circle r={5} fill="#ffd166" stroke="#071a33" strokeWidth={1.5} />
          </g>
        ))}

        {/* origin */}
        <g transform={`translate(${o.x} ${o.y})`}>
          <circle r={7} fill="#ff7b63" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "pulse-dot 2s ease-out infinite" }} />
          <circle r={7} fill="#ff7b63" stroke="#ffffff" strokeWidth={2.5} />
        </g>
      </svg>

      {/* accessible hover/focus targets with tooltips */}
      {destinations.map((d) => {
        const left = (px(d.lon) / W) * 100;
        const top = (py(d.lat) / H) * 100;
        return (
          <button
            key={d.id}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-3.5"
            style={{ left: `${left}%`, top: `${top}%` }}
            onMouseEnter={() => setHover(d.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(d.id)}
            onBlur={() => setHover(null)}
            aria-label={`${d.label}: placeholder region, destination to be confirmed`}
          >
            {hover === d.id && (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="glass pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-white"
              >
                {d.label}
              </motion.span>
            )}
          </button>
        );
      })}
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(o.x / W) * 100}%`, top: `${(o.y / H) * 100}%` }}
      >
        <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-coral px-2.5 py-0.5 text-[0.7rem] font-bold text-navy-900">
          Sri Lanka
        </span>
      </span>
    </div>
  );
}

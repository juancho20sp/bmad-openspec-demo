import { intro } from "./c0.mjs";
import { phase1, phase2, phase3 } from "./c1.mjs";
import { phase4, phase5 } from "./c2.mjs";
import { phase6, branches as br, phase7, phase8, closing } from "./c3.mjs";

export const slides = [...intro, ...phase1, ...phase2, ...phase3, ...phase4, ...phase5, ...phase6, ...phase7, ...phase8, ...closing];
// one sequence per hotspot target
export const branches = br.flatMap((b) => b.slides.map((sl) => ({ id: sl.id, label: sl.label || sl.kicker, slides: [sl] })));

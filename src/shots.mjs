// Snapshot the final hold of the given slide ids (or all): node src/shots.mjs [id,id,...|all] [dir]
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const island = JSON.parse(fs.readFileSync(path.join(root, "src/island.json"), "utf8"));
const want = (process.argv[2] || "all").split(",");
const out = process.argv[3] || path.join(root, ".hyperframes/shots");
const all = [...island.slides, ...island.slideSequences.flatMap((q) => q.slides)];
const times = all
  .filter((s) => want[0] === "all" || want.includes(s.sceneId))
  .map((s) => (s.fragments ? s.fragments[s.fragments.length - 1] : (s.startTime + s.endTime) / 2) + 0.4);
fs.rmSync(out, { recursive: true, force: true });
const r = execFileSync("npx", ["hyperframes", "snapshot", "--at", times.join(","), "--no-end", "-o", out, "--json"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const j = JSON.parse(r.slice(r.indexOf("{")));
console.log((j.contactSheets || []).join("\n"));
console.log(j.frames ? j.frames.map((f) => f.path).slice(0, 3).join("\n") : "");

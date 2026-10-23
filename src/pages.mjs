// Builds docs/ for GitHub Pages: the wrapper page `hyperframes present` serves, as static files.
// Run `node src/build.mjs` first so index.html and src/island.json are current.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs");
const island = fs.readFileSync(path.join(root, "src/island.json"), "utf8");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "composition"), { recursive: true });
fs.copyFileSync(path.join(root, "index.html"), path.join(out, "composition/index.html"));
fs.copyFileSync(path.join(root, "vendor/hyperframes-player.js"), path.join(out, "player.js"));
fs.copyFileSync(path.join(root, "vendor/hyperframes-slideshow.js"), path.join(out, "slideshow.js"));
fs.writeFileSync(path.join(out, ".nojekyll"), "");

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BMAD + OpenSpec en equipo</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { height: 100%; background: #0a0a0a; overflow: hidden; }
      hyperframes-slideshow { display: block; position: relative; width: 100vw; height: 100vh; }
      hyperframes-player { position: absolute; inset: 0; }
    </style>
    <script src="player.js"></script>
    <script src="slideshow.js"></script>
  </head>
  <body>
    <hyperframes-slideshow tabindex="0" sound>
      <hyperframes-player interactive src="composition/index.html"></hyperframes-player>
      <script type="application/hyperframes-slideshow+json">
${island}
      </script>
    </hyperframes-slideshow>
  </body>
</html>
`;
fs.writeFileSync(path.join(out, "index.html"), html);
console.log("docs/ ready:", fs.readdirSync(out).join(", "));

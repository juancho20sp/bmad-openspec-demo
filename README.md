# BMAD + OpenSpec en equipo (presentación)

Presentación interactiva en español para estudiantes: cómo desarrollar una feature full stack
(React + Express) en equipo con **BMAD** y **OpenSpec**, siguiendo un caso único de principio a fin
(«Buscador de grupos de estudio»). 67 diapositivas + 3 de ramificación, con notas del presentador.

## Presentar

```bash
npm run present        # abre el modo presentador en http://localhost:3004 (o el siguiente puerto libre)
```

Haz clic en **Present** (o pulsa `P`) para abrir la vista del público. Flechas para avanzar,
`P` para presentador. En la diapositiva 49 hay una decisión con tres ramas: haz clic en la
etiqueta ⊕ de cada opción; el botón Atrás vuelve a la decisión.

> No uses `hyperframes render` con esta presentación: solo renderizaría la primera diapositiva.

## Publicar (GitHub Pages)

Cada push a `main` ejecuta `.github/workflows/pages.yml`, que regenera el sitio (`npm run build:pages`)
y lo despliega. Requiere, una sola vez, en *Settings → Pages → Source*: **GitHub Actions**.
`docs/` es una salida generada y no se versiona.

## Editar el contenido

El `index.html` se **genera**; no lo edites a mano.

| Archivo | Contenido |
|---|---|
| `src/c0.mjs` | Introducción, herramientas, setup, reglas del equipo |
| `src/c1.mjs` | Fases 1–3: necesidad, gran plan, épicas e historias |
| `src/c2.mjs` | Fases 4–5: spec viva (OpenSpec) y aplicar cambios |
| `src/c3.mjs` | Fases 6–8, ramas de la decisión y cierre |
| `src/kit.mjs` | Componentes (terminal, código, tarjetas, tablas) |
| `src/build.mjs` | Estilos, animación y ensamblado |

```bash
npm run build:deck     # regenera index.html
npm run check          # valida la composición
node src/shots.mjs all # capturas del estado final de cada diapositiva
```

## Qué se verificó contra las herramientas reales

Se instalaron en un repo de prueba: **BMAD 6.12.4** (`npx bmad-method install`) y
**OpenSpec 1.14.3** (`openspec init --tools claude`). Los comandos, nombres de agentes y rutas de
archivos de las diapositivas salen de esa instalación. Los extractos de documentos (brief, PRD,
spec, tareas, hallazgos de revisión) son **ilustrativos**: tienen el formato real, pero el texto
exacto que genere cada herramienta variará. Los comandos cambian entre versiones; confirma con
la documentación oficial antes de dar la clase.

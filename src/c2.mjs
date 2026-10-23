import { cards, bullets, term, code, tree, table, call, chip, row, col, g } from "./kit.mjs";
import { SOF, AND, CAM, MAT } from "./c0.mjs";

const NOTE = `<div class="dim" style="font-size:32px">Extracto ilustrativo con el formato real. El texto exacto de tu proyecto variará.</div>`;

const phaseCard = (phase, id, title, line, who, notes, tool) => ({
  id,
  phase,
  label: `Fase ${phase}`,
  title,
  tool,
  who,
  bignum: phase,
  body: `${g(0, `<div style="font-size:52px;color:#c4cfe0;max-width:1060px;line-height:1.25">${line}</div>`)}`,
  notes,
});

export const phase4 = [
  phaseCard(
    4,
    "f4-titulo",
    "Una spec <em>viva</em> por ticket",
    "Aquí cambia la herramienta: de ahora en adelante <b style='color:#3ee6b0'>OpenSpec</b> manda. <b style='color:#fff'>Una historia, un cambio.</b>",
    [MAT, CAM],
    "A partir de aquí el ciclo se repite por cada historia. Tomamos la 3.1. Mateo y Camila la trabajan; antes de escribir una sola línea de código, escriben qué va a cambiar. OpenSpec llama 'cambio' a cada unidad de trabajo.",
    "openspec",
  ),
  {
    id: "f4-rama",
    phase: 4,
    title: "Una rama y un <em>cambio</em>",
    tool: "both",
    who: [MAT, CAM],
    body: `
      ${term(
        [
          { cmd: "git switch -c feat/3-1-unirse-grupo", g: 0 },
          { cmd: "/opsx:propose join-study-group", g: 1 },
          { out: "› Pega aquí la historia 3.1 con sus criterios", g: 2 },
          { out: "✓ Cambio creado en openspec/changes/join-study-group/", ok: true, g: 3 },
        ],
        { title: "Claude Code · Mateo" },
      )}
      ${g(4, call(`<b>Importante:</b> <span class="ic">propose</span> solo <b>escribe planes</b>. No toca el código todavía.`, { kind: "warn" }), "up")}`,
    notes:
      "Primero la rama de Git con el nombre de la historia. Luego el comando de OpenSpec. El nombre del cambio, join-study-group, va en minúsculas y con guiones. Una cosa que sorprende a los estudiantes: propose se detiene después de escribir los documentos, aunque le pidan que construya. Eso es una protección intencional.",
  },
  {
    id: "f4-estructura",
    phase: 4,
    title: "Lo que <em>propose</em> genera",
    tool: "openspec",
    who: [MAT, CAM],
    body: `
      ${tree(
        [
          { t: "openspec/changes/join-study-group/", hot: true, g: 0 },
          { t: "├─ proposal.md", n: "qué y por qué", g: 1 },
          { t: "├─ design.md", n: "cómo, a grandes rasgos", g: 2 },
          { t: "├─ tasks.md", n: "lista de tareas", g: 3 },
          { t: "└─ specs/group-membership/spec.md", n: "los requisitos nuevos", g: 4, hot: true },
        ],
        {},
      )}
      ${g(5, call(`Cuatro archivos. <b>Una persona los lee en cinco minutos.</b>`), "up")}`,
    notes:
      "Estos son los cuatro artefactos del esquema por defecto (spec-driven). La estrella es el spec.md dentro de specs: es una 'delta', es decir, solo describe lo que se añade, modifica o elimina respecto al sistema actual. Más adelante veremos cómo se fusiona en la spec oficial.",
  },
  {
    id: "f4-proposal",
    phase: 4,
    title: "<em>proposal.md</em>: qué y por qué",
    tool: "openspec",
    who: [MAT, CAM],
    body: `
      ${code(
        "openspec/changes/join-study-group/proposal.md",
        [
          { t: "## Why", g: 0 },
          { t: "Los estudiantes necesitan unirse a grupos,", g: 1 },
          { t: "sin sobrepasar el cupo definido al crearlos.", g: 1 },
          { t: "", g: 1 },
          { t: "## What Changes", g: 2 },
          { t: "- Nuevo endpoint POST /api/groups/:id/join", g: 2 },
          { t: "- Botón «Unirme» en la tarjeta del grupo", g: 2 },
          { t: "- Respuesta 409 cuando el grupo está lleno", g: 2 },
        ],
        { lang: "md", size: "sm" },
      )}
      ${g(3, NOTE, "fade")}`,
    notes:
      "El proposal es corto: Por qué y Qué cambia. Fíjense en que no menciona librerías ni nombres de variables: es una descripción para humanos. Los encabezados quedan en inglés porque OpenSpec los usa como estructura; el contenido puede ir en español (se puede configurar en openspec/config.yaml).",
  },
  {
    id: "f4-delta",
    phase: 4,
    title: "El <em>delta</em> de la spec",
    tool: "openspec",
    who: [MAT, CAM],
    body: `
      ${code(
        "…/specs/group-membership/spec.md",
        [
          { t: "## ADDED Requirements", g: 0 },
          { t: "### Requirement: Join a study group", g: 1 },
          { t: "The system SHALL let a student join a group", g: 1 },
          { t: "that still has free seats.", g: 1 },
          { t: "#### Scenario: Group has free seats", g: 2 },
          { t: "- **WHEN** a student joins the group", g: 2 },
          { t: "- **THEN** the student appears as a member", g: 2 },
          { t: "#### Scenario: Group is full", g: 3 },
          { t: "- **WHEN** a student joins a full group", g: 3 },
          { t: "- **THEN** the API answers 409 «Grupo lleno»", g: 3 },
        ],
        { lang: "md", size: "sm" },
      )}
      ${g(4, NOTE, "fade")}`,
    notes:
      "Este es el archivo más importante. 'ADDED Requirements' indica que es nuevo. Cada requisito usa SHALL (debe) y se prueba con escenarios WHEN/THEN. Fíjense: la regla del cupo ya es un escenario, igual que el criterio de aceptación de BMAD. Las palabras clave están en inglés porque la herramienta las reconoce.",
  },
  {
    id: "f4-tasks",
    phase: 4,
    title: "<em>tasks.md</em>: el trabajo, dividido",
    tool: "openspec",
    who: [MAT, CAM],
    body: `
      ${code(
        "…/join-study-group/tasks.md",
        [
          { t: "## 1. Backend (Mateo)", g: 0 },
          { t: "- [ ] 1.1 Ruta POST /groups/:id/join", g: 1 },
          { t: "- [ ] 1.2 Validar cupo y membresía", g: 1 },
          { t: "- [ ] 1.3 Tests: cupo, duplicado", g: 1 },
          { t: "## 2. Frontend (Camila)", g: 2 },
          { t: "- [ ] 2.1 Botón Unirme y estado «Lleno»", g: 3 },
          { t: "- [ ] 2.2 Mostrar el error 409", g: 3 },
          { t: "- [ ] 2.3 Test del componente", g: 3 },
        ],
        { lang: "md", size: "sm" },
      )}
      ${g(4, call(`Cada casilla <span class="ic">[ ]</span> se marcará sola cuando se implemente.`), "up")}`,
    notes:
      "Las tareas son pequeñas y tienen dueño. Aquí vemos por qué el contrato de la API de la fase 2 es tan útil: las dos secciones pueden avanzar en paralelo. Las casillas se marcan automáticamente cuando corramos apply, y eso nos da un progreso visible.",
  },
  {
    id: "f4-revision-spec",
    phase: 4,
    title: "Revisar la spec <em>antes</em> del código",
    tool: "both",
    who: [MAT + " + " + CAM, AND],
    body: `
      ${term(
        [
          { cmd: "git add openspec && git commit -m 'spec: unirse a grupo'", g: 0 },
          { cmd: "gh pr create --title 'Spec 3.1: unirse a un grupo'", g: 1 },
        ],
        { title: "terminal" },
      )}
      ${bullets(
        [`Andrés revisa <b>solo texto</b>: ¿el escenario de cupo lleno está claro?`, `¿Falta algún <b>caso límite</b>?`, `Se aprueba el PR de la spec.`],
        { g0: 2, step: 1, cls: "sm" },
      )}`,
    notes:
      "Este es el momento de mayor valor. Revisar cinco minutos de texto es mucho más barato que revisar cien líneas de código con el bug ya dentro. Andrés, que es otra persona, lee la spec. Si el comando gh no está instalado, también se puede abrir el pull request desde la página del repositorio.",
  },
  {
    id: "f4-turno",
    phase: 4,
    title: "<em>Tu turno</em>: un escenario más",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 4 · Checkpoint",
    body: `
      ${call(`Lean el requisito <b>Join a study group</b>. Falta un caso.`, { g: 0 })}
      ${call(`Escriban el escenario <b>«Student already joined»</b> con su <span class="ic">WHEN</span> y su <span class="ic">THEN</span>.`, { g: 1, kind: "good" })}`,
    notes:
      "Los estudiantes escriben el tercer escenario: un estudiante que ya es miembro intenta unirse otra vez. La respuesta esperada es un 409 con el mensaje 'Ya eres miembro'. Esto muestra lo fácil que es olvidar casos si no se escribe el escenario.",
  },
];

export const phase5 = [
  phaseCard(
    5,
    "f5-titulo",
    "Aplicar los <em>cambios</em>",
    "Con la spec aprobada, ahora sí: <b style='color:#fff'>el código sale de las tareas</b>, una por una.",
    [MAT, CAM],
    "Fase cinco. El código se escribe siguiendo la lista de tareas. La IA hace el trabajo pesado, pero el contexto viene de los documentos, no de la memoria de la conversación.",
    "openspec",
  ),
  {
    id: "f5-apply",
    phase: 5,
    title: "<em>/opsx:apply</em> y las tareas se marcan",
    tool: "openspec",
    who: [MAT, CAM],
    body: `
      ${term(
        [
          { cmd: "/opsx:apply join-study-group", g: 0 },
          { out: "Using change: join-study-group", g: 1 },
          { out: "✓ 1.1 Ruta POST /groups/:id/join", ok: true, g: 2 },
          { out: "✓ 1.2 Validar cupo y membresía", ok: true, g: 3 },
          { out: "✓ 1.3 Tests: cupo, duplicado", ok: true, g: 4 },
          { out: "✓ 2.1 Botón Unirme y estado «Lleno»", ok: true, g: 5 },
        ],
        { title: "Claude Code · Mateo y Camila" },
      )}
      ${g(6, call(`Cada ✓ aparece en <span class="ic">tasks.md</span> como <span class="ic">[x]</span>.`, { kind: "good" }), "up")}`,
    notes:
      "Cuando se ejecuta apply, la IA lee los documentos del cambio y los implementa tarea por tarea. En pantalla verán el progreso. Aunque BMAD tiene su propio flujo de construcción (bmad-build), nosotros usamos solo apply para no tener dos fuentes de verdad en el mismo ticket.",
  },
  {
    id: "f5-backend",
    phase: 5,
    title: "El código del <em>backend</em>",
    tool: "openspec",
    who: [MAT, null],
    body: `
      ${code(
        "server/routes/groups.js",
        [
          { t: "router.post('/groups/:id/join', (req, res) => {", g: 0 },
          { t: "  const g = getGroup(req.params.id);", g: 1 },
          { t: "  if (g.members >= g.capacity) {", g: 1 },
          { t: "    return res.status(409).json({ error: 'Grupo lleno' });", g: 2 },
          { t: "  }", g: 2 },
          { t: "  addMember(g.id, req.studentId);", g: 3 },
          { t: "  res.status(201).json(getGroup(g.id));", g: 3 },
          { t: "});", g: 0 },
        ],
        { lang: "js", size: "sm" },
      )}
      ${g(4, call(`Funciona en una prueba rápida. <b>¿Seguro que no hay problemas?</b>`, { kind: "warn" }), "up")}`,
    notes:
      "Este es el resultado inicial de apply. Se ve razonable: comprueba el cupo, devuelve 409 si está lleno, añade al miembro. Guárdense esta pregunta: ¿qué pasa si dos estudiantes llegan al mismo tiempo cuando queda un solo cupo? La revisión de código lo descubrirá. Mejor no spoilear todavía.",
  },
  {
    id: "f5-frontend",
    phase: 5,
    title: "El código del <em>frontend</em>",
    tool: "openspec",
    who: [CAM, null],
    body: `
      ${code(
        "client/src/JoinButton.jsx",
        [
          { t: "export function JoinButton({ group, onJoin }) {", g: 0 },
          { t: "  const full = group.members >= group.capacity;", g: 1 },
          { t: "  return (", g: 1 },
          { t: "    <button disabled={full}", g: 2 },
          { t: "      onClick={() => onJoin(group.id)}>", g: 2 },
          { t: "      {full ? 'Lleno' : 'Unirme'}", g: 3 },
          { t: "    </button>", g: 3 },
          { t: "  );", g: 3 },
          { t: "}", g: 0 },
        ],
        { lang: "js", size: "sm" },
      )}`,
    notes:
      "El componente de Camila. Deshabilita el botón si el grupo está lleno y cambia la etiqueta. Noten que Camila sabe exactamente qué responde la API gracias al contrato y a la spec; no tuvo que esperar a que Mateo terminara.",
  },
  {
    id: "f5-paralelo",
    phase: 5,
    title: "La spec es el <em>contrato</em> entre los dos",
    tool: "openspec",
    who: [MAT + " + " + CAM, null],
    body: `
      <div class="flow" style="justify-content:center;gap:28px">
        ${g(1, `<div class="node" style="--nc:#2ee6a8;width:480px;font-size:46px;padding:38px 28px">Camila<small>React · JoinButton</small></div>`, "left")}
        ${g(0, `<div class="node" style="--nc:#3ee6b0;width:560px;font-size:46px;padding:38px 28px">spec.md<small>POST …/join → 201 · 409</small></div>`, "pop")}
        ${g(1, `<div class="node" style="--nc:#ffc233;width:480px;font-size:46px;padding:38px 28px">Mateo<small>Express · ruta /join</small></div>`, "right")}
      </div>
      ${g(2, call(`Los dos leen <b>la misma spec</b>. Si no coinciden, el problema se ve <b>antes</b> de integrar.`, { kind: "good" }), "up")}
      ${g(3, call(`Se integran en la <b>misma rama</b> y hacen commits pequeños.`), "up")}`,
    notes:
      "Este es el diagrama que explica por qué la spec importa en equipo. En vez de preguntarse mutuamente 'qué devuelve tu ruta', los dos leen un único documento. Cuando alguno descubre que la spec está incompleta, la corrige con update (siguiente diapositiva).",
  },
  {
    id: "f5-update",
    phase: 5,
    title: "Si la realidad cambia, <em>actualiza la spec</em>",
    tool: "openspec",
    who: [MAT, CAM],
    body: `
      ${term(
        [
          { out: "Mateo descubre: un estudiante ya miembro puede unirse otra vez.", g: 0 },
          { cmd: "/opsx:update join-study-group", g: 1 },
          { out: "✓ Escenario «Already joined» agregado a spec.md y tasks.md", ok: true, g: 2 },
        ],
        { title: "Claude Code · Mateo" },
      )}
      ${g(3, call(`<span class="ic">update</span> revisa los <b>documentos</b>, nunca el código. Después ejecutas <span class="ic">apply</span> otra vez.`), "up")}
      ${g(4, call(`Esto es lo que hace la spec <b>«viva»</b>.`, { kind: "good" }), "up")}`,
    notes:
      "Esta es la regla cuatro del equipo. El comando update incorpora una decisión nueva en los documentos del cambio, los mantiene coherentes entre sí, y nunca edita el código. Después se vuelve a ejecutar apply para implementar lo nuevo. Así la spec nunca queda desactualizada.",
  },
  {
    id: "f5-turno",
    phase: 5,
    title: "<em>Tu turno</em>: la rama y el commit",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 5 · Checkpoint",
    body: `
      ${call(`Escriban un <b>mensaje de commit</b> para la tarea 1.2 que explique <b>por qué</b>, no solo qué.`, { g: 0 })}
      ${call(`Mal: <span class="ic">fix stuff</span> &nbsp;·&nbsp; Mejor: <span class="ic">feat: rechazar unión si el grupo está lleno</span>`, { g: 1, kind: "good" })}`,
    notes:
      "Un buen mensaje de commit es una pista para el revisor. Pidan que reescriban uno propio. Conecten con la siguiente fase: quien revise el PR leerá primero los mensajes.",
  },
];

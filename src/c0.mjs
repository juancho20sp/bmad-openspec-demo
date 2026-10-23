import { PHASES, cards, bullets, term, code, tree, table, call, chip, row, col, g, code1 } from "./kit.mjs";

export const SOF = "Sofía (PO)";
export const AND = "Andrés (Tech Lead)";
export const CAM = "Camila (Front)";
export const MAT = "Mateo (Back)";

const pipeline = PHASES.map(
  (p, i) =>
    `<div class="node" data-g="${i + 1}" data-fx="pop" style="--nc:${p.c};flex:1"><span class="num" style="color:${p.c}">${i + 1}</span><small style="color:#fff;font-size:30px;margin-top:2px">${p.k}</small></div>`,
).join('<div class="arr" style="font-size:34px">›</div>');

export const intro = [
  {
    id: "cover",
    label: "Portada",
    bigTitle: true,
    kicker: "Clase · Desarrollo full stack en equipo",
    title: "De la idea al código, <em>en equipo</em>",
    tool: "both",
    color: "#6ea8ff",
    body: `
      ${g(0, `<div style="font-size:54px;color:#c4cfe0;max-width:1400px;line-height:1.25">Cómo construir una feature <b style="color:#fff">React + Express</b> con <b style="color:#6ea8ff">BMAD</b> y <b style="color:#3ee6b0">OpenSpec</b>, paso a paso.</div>`)}
      ${row(
        g(1, chip("Entender", "#4cc9f0"), "pop") +
          g(1, chip("Planear", "#5b9bff"), "pop") +
          g(1, chip("Especificar", "#2ee6a8"), "pop") +
          g(1, chip("Construir", "#8ee35a"), "pop") +
          g(1, chip("Revisar", "#ffc233"), "pop") +
          g(1, chip("Aprender", "#ff6b9d"), "pop"),
        18,
      )}
      ${g(2, `<div class="dim" style="font-size:40px">Usa las flechas para avanzar · <span class="ic">P</span> abre el modo presentador</div>`, "fade")}`,
    notes:
      "Bienvenida. Hoy no vamos a ver teoría suelta: vamos a seguir UNA feature real (un buscador de grupos de estudio) desde que el cliente la pide hasta que el equipo hace la retrospectiva. Al final del curso ustedes deben poder repetir este recorrido solos. Pregunta de calentamiento: ¿quién ha pedido a una IA 'hazme una app' y le salió algo que no era lo que querían?",
  },
  {
    id: "mapa",
    label: "El recorrido completo",
    kicker: "El mapa de hoy",
    title: "Ocho fases, <em>un solo hilo</em>",
    tool: "both",
    color: "#6ea8ff",
    body: `
      <div class="flow" style="margin-top:6px">${pipeline}</div>
      ${g(1, call(`<b>Fases 1–3</b> las lidera <b style="color:#6ea8ff">BMAD</b>: qué construir y por qué, para todo el proyecto.`, { kind: "" }), "up")}
      ${g(4, call(`<b>Fases 4–5</b> las lidera <b style="color:#3ee6b0">OpenSpec</b>: cómo cambiar el código, un ticket a la vez.`, { kind: "good" }), "up")}
      ${g(6, call(`<b>Fases 6–8</b> cierran el ciclo: revisar, evaluar y aprender para el siguiente ticket.`, { kind: "warn" }), "up")}`,
    notes:
      "Este es el mapa que verán en la franja superior de cada diapositiva. Las fases 1 a 3 pasan una vez por proyecto (o por épica). Las fases 4 a 8 se repiten por cada ticket. Si se pierden en cualquier momento, miren la franja de arriba.",
  },
  {
    id: "cliente",
    label: "El cliente y su necesidad",
    kicker: "Nuestro caso",
    title: "Valentina quiere que nadie <em>estudie solo</em>",
    tool: null,
    color: "#6ea8ff",
    body: `
      ${g(0, `<div class="card" style="--cc:#4cc9f0;font-size:44px;line-height:1.3;color:#e8eef8">
        <div class="chip" style="--cc:#4cc9f0;margin-bottom:14px">Valentina · Bienestar Universitario</div><br/>
        «Mis estudiantes me dicen que estudian solos. ¿Pueden hacer algo para que encuentren <b>grupos de estudio por materia</b>? Cada grupo debería tener un <b>cupo máximo</b>. Lo necesito para el próximo semestre.»</div>`)}
      ${g(1, `<div style="font-size:46px;color:#c4cfe0">Ese mensaje es <b style="color:#fff">todo lo que tenemos</b>.</div>`, "fade")}
      ${g(2, `<div style="font-size:46px;color:#ffc233;font-weight:700">¿Qué falta para poder programar algo útil?</div>`, "fade")}`,
    notes:
      "Aquí está el cliente ficticio. Pidan a la clase que identifique qué falta: ¿qué es 'grupo'? ¿quién lo crea? ¿qué pasa cuando se llena? ¿hay login? ¿hay fecha y hora? Ese vacío es exactamente lo que la Fase 1 va a resolver. Si le pasamos este mensaje directo a una IA, ella inventará las respuestas.",
  },
  {
    id: "equipo",
    label: "El equipo",
    kicker: "Quién hace qué",
    title: "Un equipo de <em>cuatro</em>",
    tool: null,
    color: "#6ea8ff",
    body: `
      ${cards(
        [
          { i: "🧭", h: "Sofía", p: "Product Owner. Habla con Valentina y aprueba el qué.", c: "#4cc9f0" },
          { i: "🏗️", h: "Andrés", p: "Tech Lead. Decide la arquitectura y parte el trabajo.", c: "#b388ff" },
          { i: "🎨", h: "Camila", p: "Frontend. Construye la interfaz con React.", c: "#2ee6a8" },
          { i: "⚙️", h: "Mateo", p: "Backend. Construye la API con Express.", c: "#ffc233" },
        ],
        { cols: 4, g0: 0, step: 1, fx: "up" },
      )}
      ${g(5, call(`<b>Regla de oro:</b> quien escribe el código <b>nunca</b> es quien lo revisa. Todos rotan como revisores.`), "up")}`,
    notes:
      "Presenten a los cuatro roles. Son roles, no cargos: en un equipo de estudiantes una persona puede cambiar de rol entre tickets. Lo importante es que cada entrega (cada flecha) tiene un dueño y un receptor. La regla de oro la vamos a necesitar en la fase de revisión.",
  },
  {
    id: "sin-proceso",
    label: "Por qué necesitamos proceso",
    kicker: "El problema",
    title: "Pedirle código a la IA <em>sin plan</em>",
    tool: null,
    color: "#ff6b6b",
    body: `
      ${bullets(
        [
          `La IA <b>inventa</b> lo que no le dijiste.`,
          `Cada persona le pide cosas distintas: <b>el código no encaja</b>.`,
          `Nadie sabe <b>qué se decidió</b> ni por qué.`,
          `El «ya terminé» no se puede <b>comprobar</b>.`,
        ],
        { g0: 0, step: 1 },
      )}
      ${g(5, call(`Solución: <b>poner por escrito</b> el qué, el cómo y la prueba <b>antes</b> de programar.`, { kind: "good" }), "up")}`,
    notes:
      "Este es el 'por qué'. Hagan la conexión con experiencias propias: trabajos en grupo donde cada uno hizo su parte y nada encajaba. Con IA el problema se multiplica porque genera mucho código muy rápido. La solución no es más código, es más claridad escrita.",
  },
  {
    id: "bmad-def",
    label: "Qué es BMAD",
    kicker: "Herramienta 1",
    title: "<em>BMAD</em>: el qué y el porqué de todo el proyecto",
    tool: "bmad",
    color: "#6ea8ff",
    body: `
      ${g(0, `<div style="font-size:44px;color:#c4cfe0;max-width:1500px">Un conjunto de <b style="color:#fff">agentes y flujos de trabajo</b> que convierten una idea vaga en documentos que el equipo y la IA pueden seguir.</div>`)}
      ${cards(
        [
          { h: "Brief", p: "El problema y a quién le duele.", c: "#4cc9f0" },
          { h: "PRD", p: "Requisitos funcionales y no funcionales.", c: "#5b9bff" },
          { h: "Arquitectura", p: "Las decisiones técnicas clave.", c: "#8f8bff" },
          { h: "Épicas e historias", p: "El trabajo partido en tickets.", c: "#b388ff" },
        ],
        { cols: 4, g0: 1, step: 1, fx: "pop" },
      )}`,
    notes:
      "BMAD significa Breakthrough Method for Agile AI-Driven Development. Lo importante para ustedes: produce documentos. Cada documento es la entrada del siguiente. No hace falta memorizar el nombre largo; recuerden 'BMAD = planear bien el proyecto completo'. También trae agentes con nombre: Mary analista, John product manager, Winston arquitecto y Amelia desarrolladora.",
  },
  {
    id: "ospec-def",
    label: "Qué es OpenSpec",
    kicker: "Herramienta 2",
    title: "<em>OpenSpec</em>: una spec viva por cada cambio",
    tool: "openspec",
    color: "#3ee6b0",
    body: `
      ${g(0, `<div style="font-size:44px;color:#c4cfe0;max-width:1500px">Antes de tocar código, escribes <b style="color:#fff">qué va a cambiar</b>. Cuando terminas, ese cambio pasa a ser la <b style="color:#fff">spec oficial</b> del sistema.</div>`)}
      <div class="flow" style="margin-top:10px">
        ${g(1, `<div class="node" style="--nc:#3ee6b0">/opsx:propose<small>escribe la spec y las tareas</small></div>`, "pop")}
        <div class="arr" data-g="2" data-fx="fade">›</div>
        ${g(2, `<div class="node" style="--nc:#8ee35a">/opsx:apply<small>se implementa el código</small></div>`, "pop")}
        <div class="arr" data-g="3" data-fx="fade">›</div>
        ${g(3, `<div class="node" style="--nc:#ffc233">/opsx:archive<small>la spec queda viva</small></div>`, "pop")}
      </div>`,
    notes:
      "OpenSpec trabaja con 'cambios'. Un cambio es una carpeta con una propuesta, una spec delta (solo lo que cambia), un diseño y una lista de tareas. Tres comandos: propose, apply, archive. Mencionen que existen otros (explore, update, sync) pero estos tres son el núcleo. Ojo: en versiones anteriores los comandos se llamaban /openspec:proposal; hoy son /opsx:*.",
  },
  {
    id: "se-combinan",
    label: "Cómo se combinan",
    kicker: "La idea central",
    title: "BMAD planea el proyecto, <em>OpenSpec</em> ejecuta cada ticket",
    tool: "both",
    color: "#6ea8ff",
    body: `
      ${row(
        col(
          `<div class="big" style="font-size:56px;color:#6ea8ff">BMAD</div>` +
            bullets(["Para todo el proyecto", "Responde: <b>¿qué y por qué?</b>", "Sale: PRD, arquitectura, historias"], { g0: 1, step: 1, cls: "sm" }),
          1,
          "",
        ) +
          col(
            `<div class="big" style="font-size:56px;color:#3ee6b0">OpenSpec</div>` +
              bullets(["Para un ticket a la vez", "Responde: <b>¿cómo cambia el sistema?</b>", "Sale: spec, tareas, código"], { g0: 2, step: 1, cls: "sm" }),
            1,
            "",
          ),
        60,
      )}
      ${g(5, call(`<b>1 historia de BMAD = 1 rama de Git = 1 cambio de OpenSpec.</b>`, { kind: "good" }), "up")}`,
    notes:
      "Si solo se llevan una frase de la clase, que sea esta: BMAD decide el qué para todo el proyecto, OpenSpec decide el cómo para un ticket. La historia que sale de BMAD se convierte en un cambio de OpenSpec. Una historia, una rama, un cambio. Esa correspondencia uno-a-uno evita el desorden.",
  },
  {
    id: "setup",
    label: "Instalación",
    kicker: "Antes de empezar",
    title: "Instalar las dos herramientas <em>una vez</em>",
    tool: "both",
    color: "#6ea8ff",
    body: `
      ${term(
        [
          { cmd: "npx bmad-method install", g: 0 },
          { out: "✓ BMad Method instalado · 29 skills en .claude/skills", ok: true, g: 1 },
          { cmd: "npm install -g @fission-ai/openspec", g: 2 },
          { cmd: "openspec init --tools claude", g: 3 },
          { out: "✓ Listo: comandos /opsx:* creados en .claude/", ok: true, g: 4 },
        ],
        { title: "terminal · en la raíz del repo" },
      )}
      ${g(5, `<div class="dim" style="font-size:38px">Nota: salida resumida. Tu pantalla mostrará más líneas y preguntas del instalador.</div>`, "fade")}`,
    notes:
      "Esto lo hace UNA persona y lo sube al repositorio, para que todos tengan lo mismo. El instalador de BMAD pregunta cosas (idioma, carpeta de salida); el de OpenSpec pregunta qué herramientas de IA usan; elijan Claude Code. Verifiquen que existe la carpeta _bmad y la carpeta openspec.",
  },
  {
    id: "carpetas",
    label: "Estructura de carpetas",
    kicker: "Antes de empezar",
    title: "Qué aparece en <em>tu repo</em>",
    tool: "both",
    color: "#6ea8ff",
    body: `
      ${row(
        col(
          tree(
            [
              { t: "mi-repo/" },
              { t: "├─ _bmad/", n: "motor de BMAD", g: 1 },
              { t: "├─ _bmad-output/", n: "documentos que BMAD genera", g: 2, hot: true },
              { t: "├─ openspec/", n: "specs y cambios", g: 3, hot: true },
              { t: "├─ .claude/", n: "comandos para Claude Code", g: 4 },
              { t: "├─ client/", n: "React", g: 5 },
              { t: "└─ server/", n: "Express", g: 5 },
            ],
            {},
          ),
          1,
        ),
        0,
      )}
      ${g(6, call(`Todo es <b>texto en Git</b>: se revisa en un PR como cualquier código.`), "up")}`,
    notes:
      "Muestren que todo son archivos de texto. Eso es lo poderoso: los documentos de planeación y las specs se revisan por pull request igual que el código. Dos carpetas son las que más van a mirar: _bmad-output para el plan y openspec para los cambios.",
  },
  {
    id: "reglas",
    label: "Reglas del equipo",
    kicker: "Acuerdos",
    title: "Cuatro reglas para <em>no pisarnos</em>",
    tool: null,
    color: "#6ea8ff",
    body: `
      ${bullets(
        [
          `Un repo compartido, <b>una rama por historia</b>: <span class="ic">feat/3-1-unirse-grupo</span>`,
          `Nada se programa sin una <b>spec aprobada</b> por otra persona.`,
          `Todo cambio entra por <b>Pull Request</b> con revisor distinto al autor.`,
          `Si la realidad cambia, <b>se actualiza el documento</b>, no solo el código.`,
        ],
        { g0: 0, step: 1 },
      )}`,
    notes:
      "Estas reglas las pueden pegar en el README del equipo. La cuarta es la que más se rompe: cuando descubrimos algo a mitad del trabajo, es tentador arreglar solo el código y olvidar la spec. Más adelante veremos cómo OpenSpec ayuda con eso (comando update).",
  },
];

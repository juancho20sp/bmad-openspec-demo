import { cards, bullets, term, code, tree, table, call, chip, row, col, g } from "./kit.mjs";
import { SOF, AND, CAM, MAT } from "./c0.mjs";

const ARTIFACT_NOTE = `<div class="dim" style="font-size:32px">Extracto ilustrativo con el formato real. El texto exacto de tu proyecto variará.</div>`;

// phase title card
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

export const phase1 = [
  phaseCard(
    1,
    "f1-titulo",
    "Entender la <em>necesidad</em>",
    "Antes de planear nada, hay que saber <b style='color:#fff'>qué problema</b> estamos resolviendo y <b style='color:#fff'>para quién</b>.",
    [SOF, AND],
    "Primera fase. Aquí no se programa ni se diseña: se hacen preguntas. Quien lidera es Sofía, la Product Owner, con ayuda de Mary, el agente analista de BMAD.",
    "bmad",
  ),
  {
    id: "f1-preguntas",
    phase: 1,
    title: "Las preguntas <em>que faltaban</em>",
    tool: "bmad",
    who: [SOF, AND],
    body: `
      ${cards(
        [
          { h: "¿Quién usa esto?", p: "Estudiantes de primeros semestres, desde el celular.", c: "#4cc9f0" },
          { h: "¿Qué es un grupo?", p: "Materia, horario, lugar y un cupo máximo.", c: "#4cc9f0" },
          { h: "¿Qué pasa si se llena?", p: "No deja unirse. Hay que decirlo claro.", c: "#4cc9f0" },
          { h: "¿Cómo sabremos que funcionó?", p: "Meta: 200 grupos activos en el semestre.", c: "#4cc9f0" },
        ],
        { cols: 2, g0: 0, step: 1 },
      )}`,
    notes:
      "Estas son las respuestas que Sofía consigue hablando con Valentina (en nuestro caso ficticio). Fíjense que la regla del cupo ya aparece aquí: es un requisito de negocio, no un detalle técnico. Pidan a la clase que añada una pregunta más. Es un buen momento para hablar de 'fuera de alcance': chat, pagos y notificaciones push se descartan hoy.",
  },
  {
    id: "f1-brief-cmd",
    phase: 1,
    title: "Convertirlo en un <em>brief</em>",
    tool: "bmad",
    who: [SOF, AND],
    body: `
      ${term(
        [
          { cmd: "/bmad-product-brief", g: 0 },
          { out: "Mary: cuéntame el problema con tus palabras…", g: 1 },
          { out: "› Pega aquí el mensaje de Valentina + tus respuestas", g: 2 },
          { out: "✓ Brief guardado en _bmad-output/planning-artifacts/briefs/", ok: true, g: 3 },
        ],
        { title: "Claude Code · Sofía" },
      )}
      ${g(4, call(`El agente <b>te entrevista</b>; tú no empiezas con la hoja en blanco.`), "up")}`,
    notes:
      "Este es el primer comando real. /bmad-product-brief es un skill de BMAD: lanza una conversación guiada. La salida de abajo está resumida para que quepa. Lo importante: Sofía no escribe el documento desde cero, responde preguntas. Si quieren hablar directamente con el analista, el comando es /bmad-agent-analyst.",
  },
  {
    id: "f1-brief-doc",
    phase: 1,
    title: "El brief <em>resultante</em>",
    tool: "bmad",
    who: [SOF, AND],
    body: `
      ${code(
        "_bmad-output/planning-artifacts/briefs/study-groups.md",
        [
          { t: "# Brief: Buscador de grupos de estudio", g: 0 },
          { t: "", g: 0 },
          { t: "**Problema:** los estudiantes no encuentran", g: 1 },
          { t: "con quién estudiar su materia.", g: 1 },
          { t: "**Usuarios:** estudiantes de 1.º a 4.º semestre", g: 2 },
          { t: "**Meta:** 200 grupos activos en el semestre", g: 3 },
          { t: "**Fuera de alcance:** chat, pagos, push", g: 4 },
        ],
        { lang: "md" },
      )}
      ${g(5, ARTIFACT_NOTE, "fade")}`,
    notes:
      "Así se ve un brief. Es corto a propósito: una página. Lo que importa es que ahora existe algo que todo el equipo puede leer y discutir. Antes de pasar a la siguiente fase, Sofía y Andrés lo revisan juntos.",
  },
  {
    id: "f1-turno",
    phase: 1,
    title: "<em>Tu turno</em>: el brief",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 1 · Checkpoint",
    body: `
      ${call(`<b>5 minutos, en parejas.</b> Imaginen que Valentina pidió «una app para el comedor». Escriban:`, { g: 0 })}
      ${bullets(
        [`3 preguntas que le harían a Valentina`, `1 cosa que dejarían <b>fuera de alcance</b>`, `1 meta que se pueda <b>medir</b>`],
        { g0: 1, step: 1, cls: "sm" },
      )}`,
    notes:
      "Pausa activa. Den cinco minutos. Después pidan a dos o tres parejas que compartan. Lo que buscamos: que noten que las metas medibles ('200 grupos activos') obligan a pensar en el éxito real, y que 'fuera de alcance' protege al equipo de pedidos infinitos.",
  },
];

export const phase2 = [
  phaseCard(
    2,
    "f2-titulo",
    "El <em>gran plan</em>",
    "Del brief a un <b style='color:#fff'>PRD</b> (qué debe hacer) y una <b style='color:#fff'>arquitectura</b> (con qué lo haremos).",
    [SOF, AND],
    "Fase dos. Dos documentos: el PRD lo lidera Sofía con John, el agente product manager. La arquitectura la lidera Andrés con Winston, el agente arquitecto. Los dos se aprueban entre sí.",
    "bmad",
  ),
  {
    id: "f2-prd-cmd",
    phase: 2,
    title: "Escribir el <em>PRD</em>",
    tool: "bmad",
    who: [SOF, AND],
    body: `
      ${term(
        [
          { cmd: "/bmad-prd", g: 0 },
          { out: "John: leí el brief. Empecemos por los usuarios…", g: 1 },
          { out: "› ¿Qué debe poder hacer un estudiante?", g: 2 },
          { out: "✓ PRD guardado en planning-artifacts/prds/", ok: true, g: 3 },
        ],
        { title: "Claude Code · Sofía" },
      )}
      ${g(4, call(`El PRD lista <b>requisitos numerados</b> (FR1, FR2…). Más adelante cada historia apunta a uno.`), "up")}`,
    notes:
      "/bmad-prd crea el documento de requisitos de producto. 'FR' significa Functional Requirement, requisito funcional; 'NFR' es no funcional (rendimiento, accesibilidad). La numeración es clave: nos permite comprobar después que ningún requisito quedó sin historia.",
  },
  {
    id: "f2-prd-doc",
    phase: 2,
    title: "Requisitos <em>numerados</em>",
    tool: "bmad",
    who: [SOF, AND],
    body: `
      ${row(
        col(
          `<div class="chip" style="--cc:#5b9bff;align-self:flex-start">Funcionales</div>` +
            bullets(
              [
                `<b>FR1</b> Listar grupos por materia`,
                `<b>FR2</b> Crear un grupo con cupo`,
                `<b>FR3</b> Unirse si hay cupo`,
                `<b>FR4</b> Salir de un grupo`,
                `<b>FR5</b> Ver mis grupos`,
              ],
              { g0: 0, step: 1, cls: "sm" },
            ),
          1.25,
        ) +
          col(
            `<div class="chip" style="--cc:#ffc233;align-self:flex-start">No funcionales</div>` +
              bullets(
                [`<b>NFR1</b> Lista en menos de 2 s`, `<b>NFR2</b> Usable con teclado`, `<b>NFR3</b> API valida toda entrada`],
                { g0: 5, step: 1, cls: "sm" },
              ),
            1,
          ),
        50,
      )}
      ${g(8, ARTIFACT_NOTE, "fade")}`,
    notes:
      "Aquí el PRD resumido. Noten que FR3 contiene el corazón del negocio: 'unirse si hay cupo'. Los no funcionales son cosas como rapidez y accesibilidad: no son funciones, pero si no se cumplen, la app no sirve. Pregunten: ¿qué pasaría si nadie escribiera NFR3?",
  },
  {
    id: "f2-arq-cmd",
    phase: 2,
    title: "Decidir la <em>arquitectura</em>",
    tool: "bmad",
    who: [AND, SOF],
    body: `
      ${term(
        [
          { cmd: "/bmad-architecture", g: 0 },
          { out: "Winston: partiendo del PRD, estas son las decisiones…", g: 1 },
          { out: "✓ Arquitectura en planning-artifacts/architecture/", ok: true, g: 2 },
        ],
        { title: "Claude Code · Andrés" },
      )}
      ${cards(
        [
          { h: "React + Vite", p: "Cliente", c: "#2ee6a8" },
          { h: "Express", p: "API REST en JSON", c: "#ffc233" },
          { h: "SQLite", p: "Una base en un archivo", c: "#b388ff" },
        ],
        { cols: 3, g0: 3, step: 1, fx: "pop" },
      )}`,
    notes:
      "La arquitectura responde preguntas que, si no se deciden ahora, cada desarrollador contestará distinto. Aquí: React con Vite en el cliente, Express como API REST, SQLite como base de datos (un archivo, fácil para estudiantes y con transacciones, algo que usaremos más adelante). No es la única respuesta correcta; lo importante es que quede escrita.",
  },
  {
    id: "f2-arq-api",
    phase: 2,
    title: "El <em>contrato</em> de la API",
    tool: "bmad",
    who: [AND, SOF],
    body: `
      ${table(
        ["Método", "Ruta", "Para qué"],
        [
          [`<span class="ic">GET</span>`, `<span class="ic">/api/groups</span>`, "Listar (filtra por materia)"],
          [`<span class="ic">POST</span>`, `<span class="ic">/api/groups</span>`, "Crear un grupo"],
          [`<span class="ic">POST</span>`, `<span class="ic">/api/groups/:id/join</span>`, "Unirse"],
          [`<span class="ic">DELETE</span>`, `<span class="ic">/api/groups/:id/join</span>`, "Salir"],
        ],
        { g0: 0, step: 1, cols: "190px 640px 1fr" },
      )}
      ${g(5, call(`Camila y Mateo trabajarán <b>en paralelo</b> porque ambos conocen este contrato.`, { kind: "good" }), "up")}
      ${g(6, ARTIFACT_NOTE, "fade")}`,
    notes:
      "Este contrato es lo que permite que frontend y backend avancen al mismo tiempo sin esperarse. Si Camila sabe que existe POST /api/groups/:id/join y qué responde, puede construir el botón mientras Mateo construye la ruta. Mencionen que en el MVP la identidad del estudiante se simula con una cabecera, para no complicar la autenticación.",
  },
  {
    id: "f2-gate",
    phase: 2,
    title: "Antes de seguir: la <em>puerta</em>",
    tool: "bmad",
    who: [SOF, AND],
    body: `
      ${bullets(
        [
          `Sofía <b>lee la arquitectura</b>: ¿cabe en el tiempo del semestre?`,
          `Andrés <b>lee el PRD</b>: ¿se puede construir esto?`,
          `Cada FR es <b>claro y comprobable</b>.`,
          `Los dos dicen «aprobado» en el <b>Pull Request</b>.`,
        ],
        { g0: 0, step: 1 },
      )}
      ${g(5, call(`Una puerta es un <b>alto obligatorio</b>. Corregir un documento cuesta minutos; corregir código cuesta días.`, { kind: "warn" }), "up")}`,
    notes:
      "Este es un traspaso importante. Dos personas revisan el trabajo del otro antes de que nadie programe. Es la primera vez que usamos la regla de oro del equipo. Cuenten una anécdota propia si tienen: un requisito mal entendido que costó caro.",
  },
  {
    id: "f2-turno",
    phase: 2,
    title: "<em>Tu turno</em>: encuentra el hueco",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 2 · Checkpoint",
    body: `
      ${call(`Lean los 5 FR y los 3 NFR. ¿Qué <b>requisito falta</b> o es ambiguo?`, { g: 0 })}
      ${bullets([`Pista: ¿quién puede <b>borrar</b> un grupo?`, `Pista: ¿puede un estudiante crear <b>10 grupos</b> iguales?`, `Escriban el FR6 que lo arregle.`], { g0: 1, step: 1, cls: "sm" })}`,
    notes:
      "Ejercicio de lectura crítica. No hay una única respuesta: lo valioso es que descubran que un PRD siempre tiene huecos y que es mejor encontrarlos en esta fase. Pueden dejar que propongan, por ejemplo, 'el creador puede cancelar su grupo' o 'límite de grupos por estudiante'.",
  },
];

export const phase3 = [
  phaseCard(
    3,
    "f3-titulo",
    "Épicas e <em>historias</em>",
    "Partir el plan en <b style='color:#fff'>trozos pequeños</b> que una persona pueda terminar y comprobar.",
    [AND, "Todo el equipo"],
    "Fase tres. Andrés lidera, pero todo el equipo participa porque aquí se reparte el trabajo. Una épica es una meta grande; una historia es un trozo que se puede terminar en pocos días.",
    "bmad",
  ),
  {
    id: "f3-cmd",
    phase: 3,
    title: "Generar épicas e <em>historias</em>",
    tool: "bmad",
    who: [AND, "Equipo"],
    body: `
      ${term(
        [
          { cmd: "/bmad-create-epics-and-stories", g: 0 },
          { out: "Leyendo PRD, arquitectura y brief…", g: 1 },
          { out: "✓ 3 épicas · 8 historias → planning-artifacts/epics.md", ok: true, g: 2 },
        ],
        { title: "Claude Code · Andrés" },
      )}
      ${g(3, call(`Un solo archivo, <span class="ic">epics.md</span>, con cada FR cubierto por alguna historia.`), "up")}`,
    notes:
      "Este comando lee los documentos anteriores y propone el desglose. El número exacto de historias en su pantalla puede ser distinto; aquí usamos 3 épicas y 8 historias como ejemplo. Antes de aceptar la propuesta, el equipo la lee y la ajusta.",
  },
  {
    id: "f3-epicas",
    phase: 3,
    title: "Tres épicas, <em>ocho</em> historias",
    tool: "bmad",
    who: [AND, "Equipo"],
    body: `
      ${cards(
        [
          { h: "Épica 1 · Explorar", p: "1.1 API: listar<br/>1.2 Lista con filtro<br/>1.3 Mis grupos", c: "#4cc9f0" },
          { h: "Épica 2 · Crear", p: "2.1 API: crear y validar<br/>2.2 Formulario de crear", c: "#8f8bff" },
          { h: "Épica 3 · Unirse", p: "3.1 Unirse con cupo<br/>3.2 Salir<br/>3.3 Estado «lleno»", c: "#b388ff" },
        ],
        { cols: 3, g0: 0, step: 1 },
      )}
      ${g(4, call(`Nuestro ejemplo: seguiremos la <b>historia 3.1</b> de principio a fin.`, { kind: "good" }), "up")}`,
    notes:
      "Cada épica agrupa una meta que el cliente entiende: explorar, crear, unirse. Dentro, historias pequeñas. Observen que 3.1 cubre el FR3, la regla del cupo. Esa es la historia que vamos a seguir durante el resto de la clase. Es un corte vertical: toca backend y frontend a la vez.",
  },
  {
    id: "f3-historia",
    phase: 3,
    title: "Anatomía de una <em>historia</em>",
    tool: "bmad",
    who: [AND, "Equipo"],
    body: `
      ${code(
        "epics.md · Historia 3.1",
        [
          { t: "### Story 3.1: Unirse a un grupo con cupo", g: 0 },
          { t: "Como estudiante, quiero unirme a un grupo", g: 1 },
          { t: "para estudiar con compañeros de mi materia.", g: 1 },
          { t: "**Given** un grupo con cupos libres", g: 2 },
          { t: "**When** me uno", g: 2 },
          { t: "**Then** aparezco como miembro", g: 2 },
          { t: "**Given** un grupo lleno", g: 3 },
          { t: "**When** intento unirme", g: 3 },
          { t: "**Then** recibo 409 «Grupo lleno»", g: 3 },
        ],
        { lang: "md", size: "sm" },
      )}`,
    notes:
      "Una buena historia tiene tres partes: quién, qué y para qué; y criterios de aceptación en formato Given-When-Then (dado, cuando, entonces). Esos criterios son lo que después usaremos para evaluar si terminamos. Fíjense en el segundo caso: la regla del cupo está escrita como una prueba.",
  },
  {
    id: "f3-sprint",
    phase: 3,
    title: "Preparar el <em>sprint</em>",
    tool: "bmad",
    who: [AND, "Equipo"],
    body: `
      ${term(
        [
          { cmd: "/bmad-sprint-planning", g: 0 },
          { out: "Revisando que la planeación esté completa…", g: 1 },
          { out: "✓ implementation-artifacts/sprint-status.yaml", ok: true, g: 2 },
        ],
        { title: "Claude Code · Andrés" },
      )}
      ${code(
        "sprint-status.yaml",
        [
          { t: "epic-3: in-progress", g: 3 },
          { t: "3-1-unirse-grupo: ready-for-dev", g: 3 },
          { t: "3-2-salir-grupo: backlog", g: 3 },
        ],
        { lang: "yaml", size: "sm" },
      )}`,
    notes:
      "El sprint planning comprueba que haya suficiente información para empezar y crea un archivo de estado. Ese archivo es el tablero del equipo: cada historia tiene un estado (backlog, ready-for-dev, in-progress, done). El formato exacto puede variar en su versión.",
  },
  {
    id: "f3-reparto",
    phase: 3,
    title: "Quién toma <em>qué</em>",
    tool: null,
    who: [AND, "Equipo"],
    body: `
      ${table(
        ["Historia", "Responsable", "Revisor"],
        [
          ["3.1 Unirse con cupo", `${"Mateo + Camila"}`, "Andrés"],
          ["3.2 Salir de un grupo", "Camila + Mateo", "Sofía"],
          ["2.1 API: crear y validar", "Mateo", "Camila"],
          ["2.2 Formulario de crear", "Camila", "Mateo"],
        ],
        { g0: 0, step: 1, cols: "1.5fr 1.2fr 1fr" },
      )}
      ${g(5, call(`Nadie revisa su propia historia. <b>Cada fila tiene tres nombres distintos</b> a lo largo del ciclo.`, { kind: "warn" }), "up")}`,
    notes:
      "Aquí aplicamos la regla de oro. Las historias de corte vertical (que tocan front y back) las trabajan dos personas, una por lado, y las revisa una tercera. Eso reparte el conocimiento del sistema entre todos.",
  },
  {
    id: "f3-turno",
    phase: 3,
    title: "<em>Tu turno</em>: ¿es una buena historia?",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 3 · Checkpoint",
    body: `
      ${call(`Una historia debe ser <b>I.N.V.E.S.T.</b>: Independiente, Negociable, Valiosa, Estimable, Pequeña y Testeable.`, { g: 0 })}
      ${call(`Historia mala: <b>«Hacer el backend»</b>. ¿Por qué? Reescríbanla en dos historias buenas.`, { g: 1, kind: "bad" })}`,
    notes:
      "Aquí la clase practica el criterio de una historia buena. 'Hacer el backend' es enorme, no se puede comprobar y no entrega valor al usuario por sí sola. Una buena reescritura: 'Listar grupos por materia' y 'Crear un grupo con cupo'. Cada una se puede demostrar.",
  },
];

import { cards, bullets, term, code, tree, table, call, chip, row, col, g } from "./kit.mjs";
import { SOF, AND, CAM, MAT } from "./c0.mjs";

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

// option card laid out in slide coordinates (relative to .main: left 100, top 132)
const OPT = [
  { x: 0, id: "h-ignorar", target: "br-ignorar", h: "A · Lo dejamos", p: "Es muy raro que pase." },
  { x: 590, id: "h-transaccion", target: "br-transaccion", h: "B · Transacción", p: "La base valida y guarda de una vez." },
  { x: 1180, id: "h-candado", target: "br-candado", h: "C · Candado en memoria", p: "Una variable bloquea mientras entra uno." },
];
const optHTML = OPT.map(
  (o, i) =>
    `<div class="opt" data-g="1" data-fx="up" style="left:${o.x}px;top:420px;width:540px;height:340px"><b>${o.h}</b>${o.p}</div>`,
).join("");

export const phase6 = [
  phaseCard(
    6,
    "f6-titulo",
    "Revisión de <em>código</em>",
    "Nadie revisa su propio trabajo. Primero lo revisan <b style='color:#fff'>varios revisores automáticos</b>, luego una <b style='color:#fff'>persona</b>.",
    [MAT + " + " + CAM, AND],
    "Fase seis. El código ya funciona en una prueba rápida, pero 'funciona' no es lo mismo que 'está bien'. Hay dos filtros: la revisión asistida por IA y la revisión humana por Pull Request.",
    "bmad",
  ),
  {
    id: "f6-cmd",
    phase: 6,
    title: "Varios <em>revisores</em> en paralelo",
    tool: "bmad",
    who: [AND, MAT + " + " + CAM],
    body: `
      ${term(
        [
          { cmd: "/bmad-code-review", g: 0 },
          { out: "Lanzando revisores independientes…", g: 1 },
          { out: "✓ Hallazgos clasificados por gravedad", ok: true, g: 2 },
        ],
        { title: "Claude Code · Andrés (revisor)" },
      )}
      ${cards(
        [
          { h: "El escéptico", p: "Busca fallos de lógica", c: "#ff6b6b" },
          { h: "Casos límite", p: "Qué pasa en los bordes", c: "#ffc233" },
          { h: "El de la spec", p: "¿Cumple lo acordado?", c: "#3ee6b0" },
        ],
        { cols: 3, g0: 3, step: 1, fx: "pop" },
      )}`,
    notes:
      "El comando lanza varios revisores independientes que miran el mismo cambio con enfoques distintos y luego se clasifican los hallazgos. Los nombres de las tarjetas son una simplificación didáctica de esos enfoques (crítica adversarial, casos límite, verificación contra la spec). Importante: quien ejecuta el comando es el revisor, no el autor.",
  },
  {
    id: "f6-hallazgos",
    phase: 6,
    title: "Lo que <em>encontraron</em>",
    tool: "bmad",
    who: [AND, MAT + " + " + CAM],
    body: `
      ${table(
        ["Gravedad", "Hallazgo"],
        [
          [`<span class="chip" style="--cc:#ff6b6b">Alta</span>`, "Dos personas pueden tomar el <b>último cupo</b> a la vez"],
          [`<span class="chip" style="--cc:#ffc233">Media</span>`, "El botón no tiene estado de <b>carga</b> ni error"],
          [`<span class="chip" style="--cc:#3ee6b0">Baja</span>`, "La variable <span class='ic'>g</span> tiene un nombre poco claro"],
        ],
        { g0: 0, step: 1, cols: "230px 1fr" },
      )}
      ${g(4, `<div class="dim" style="font-size:32px">Hallazgos ilustrativos. Los de tu proyecto serán otros.</div>`, "fade")}`,
    notes:
      "Tres hallazgos, ordenados por gravedad. El primero es el que anticipamos. Los otros dos son comunes: falta de estado de carga y nombres poco claros. Un buen revisor separa lo que bloquea el merge de lo que puede esperar.",
  },
  {
    id: "f6-decision",
    phase: 6,
    title: "¿Qué <em>hacemos</em> con la carrera?",
    tool: null,
    who: [MAT + " + " + CAM, AND],
    kicker: "Fase 6 · Decisión del equipo",
    bodyStyle: "justify-content:flex-start",
    body: `
      ${g(0, call(`Queda <b>1 cupo</b>. Dos estudiantes pulsan <b>Unirme</b> en el mismo instante. Resultado posible: <b>11 miembros en un grupo de 10</b>.`, { kind: "bad" }), "up")}
      ${optHTML}
      ${g(1, `<div style="position:absolute;left:0;top:380px;font-size:34px;color:#8e9bb0">Haz clic en la etiqueta ⊕ de una opción para ver qué pasa</div>`, "fade")}`,
    hotspots: OPT.map((o) => ({
      id: o.id,
      label: o.h,
      target: o.target,
      region: { x: +(((o.x + 100) / 1920) * 100).toFixed(2), y: +((552 / 1080) * 100).toFixed(2), w: +((540 / 1920) * 100).toFixed(2), h: +((340 / 1080) * 100).toFixed(2) },
    })),
    notes:
      "Momento interactivo. Pidan a la clase que vote A, B o C antes de hacer clic. Cada opción abre una diapositiva con el resultado y el botón Atrás (o la tecla de retroceso) devuelve a esta pantalla. Recomendación: abran las tres, empezando por la que la clase eligió, y terminen siempre en la B. Esta es la discusión central de la fase.",
  },
  {
    id: "f6-fix",
    phase: 6,
    title: "La corrección: <em>transacción</em> + escenario",
    tool: "both",
    who: [MAT, AND],
    body: `
      ${code(
        "server/routes/groups.js",
        [
          { t: "const join = db.transaction((id, studentId) => {", g: 0, mark: "good" },
          { t: "  const g = getGroup(id);", g: 0 },
          { t: "  if (g.members >= g.capacity) return 'FULL';", g: 0 },
          { t: "  addMember(id, studentId);", g: 0 },
          { t: "  return 'OK';", g: 0 },
          { t: "});", g: 0 },
        ],
        { lang: "js", size: "sm" },
      )}
      ${code(
        "…/specs/group-membership/spec.md",
        [
          { t: "#### Scenario: Last seat taken at once", g: 1, mark: "good" },
          { t: "- **WHEN** two students join the last seat", g: 1 },
          { t: "- **THEN** only one succeeds, the other gets 409", g: 1 },
        ],
        { lang: "md", size: "sm" },
      )}
      `,
    notes:
      "Primero se actualiza la spec con /opsx:update y luego el código con /opsx:apply. La solución correcta con SQLite: envolver la comprobación y la inserción en una transacción, de modo que sean atómicas. Pero lo más importante es lo segundo: el escenario nuevo se agrega a la spec, para que este caso nunca se olvide. Eso es la spec viva. Después de actualizar, se vuelve a ejecutar la revisión sobre el cambio.",
  },
  {
    id: "f6-humana",
    phase: 6,
    title: "La revisión <em>humana</em> del PR",
    tool: "bmad",
    who: [AND, MAT + " + " + CAM],
    body: `
      ${bullets(
        [
          `¿El código hace lo que dice la <b>spec</b>?`,
          `¿Hay <b>pruebas</b> para cada escenario?`,
          `¿Entiendo el cambio <b>sin preguntarle</b> al autor?`,
          `¿Algo se aprobó sin <b>entenderlo</b>? Pregunta.`,
        ],
        { g0: 0, step: 1, cls: "sm" },
      )}
      ${g(4, call(`<span class="ic">/bmad-walkthrough</span> te guía: <b>qué mirar</b> con atención y cómo probarlo.`), "up")}`,
    notes:
      "La IA revisa, pero el visto bueno es humano. Estas cuatro preguntas son el mínimo. El comando /bmad-walkthrough ayuda a quien revisa a recorrer el cambio: para qué sirve, qué mirar con cuidado y cómo probarlo. Insistan en la última pregunta: nadie debería aprobar lo que no entiende.",
  },
  {
    id: "f6-turno",
    phase: 6,
    title: "<em>Tu turno</em>: sé el revisor",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 6 · Checkpoint",
    body: `
      ${call(`Escriban un comentario de revisión para el hallazgo <b>«el botón no tiene estado de carga»</b>.`, { g: 0 })}
      ${bullets([`Dígalo <b>sobre el código</b>, no sobre la persona.`, `Explique <b>por qué</b> importa.`, `Proponga una <b>salida concreta</b>.`], { g0: 1, step: 1, cls: "sm" })}`,
    notes:
      "Revisar es una habilidad social. Un buen comentario es específico, respetuoso y trae una propuesta. Por ejemplo: 'Cuando el usuario pulsa Unirme y la red va lenta, no hay feedback. ¿Podemos deshabilitar el botón mientras llega la respuesta y mostrar el error 409?'.",
  },
];

export const branches = [
  {
    id: "br-decision",
    label: "Resultado de la decisión",
    slides: [
      {
        id: "br-ignorar",
        title: "A · Lo dejamos: <em>sale a producción</em>",
        tool: null,
        color: "#ff6b6b",
        kicker: "Resultado A",
        body: `
          ${bullets(
            [
              `El jueves, el grupo de Cálculo queda con <b>11 de 10</b>.`,
              `Valentina recibe quejas: <b>«me dijeron que había cupo»</b>.`,
              `Arreglarlo ahora cuesta <b>más</b>: datos ya sucios.`,
            ],
            { g0: 0, step: 1 },
          )}
          ${g(3, call(`Lección: un fallo «raro» ocurre <b>cuando más gente usa la app</b>. Atrás para elegir de nuevo.`, { kind: "bad" }), "up")}`,
        notes:
          "Esta rama muestra el costo de ignorar un hallazgo. Los errores de concurrencia son raros en pruebas y frecuentes en producción, justo cuando hay más usuarios (inicio de semestre). Usen el botón Atrás para volver a la decisión.",
      },
      {
        id: "br-transaccion",
        title: "B · Transacción: <em>la opción correcta</em>",
        tool: null,
        color: "#3ee6b0",
        kicker: "Resultado B",
        body: `
          ${bullets(
            [
              `La base de datos <b>valida y guarda en un solo paso</b>.`,
              `Funciona aunque haya <b>varios procesos</b> del servidor.`,
              `Se agrega un <b>escenario</b> a la spec y una <b>prueba</b>.`,
            ],
            { g0: 0, step: 1 },
          )}
          ${g(3, call(`Atrás, y seguimos con la <b>corrección</b> en la diapositiva siguiente.`, { kind: "good" }), "up")}`,
        notes:
          "La decisión recomendada. La atomicidad la garantiza la base de datos, no nuestro código, por lo que sigue funcionando si mañana se despliegan dos instancias del servidor. Además, el hallazgo se convierte en un escenario permanente en la spec.",
      },
      {
        id: "br-candado",
        title: "C · Candado en memoria: <em>a medias</em>",
        tool: null,
        color: "#ffc233",
        kicker: "Resultado C",
        body: `
          ${bullets(
            [
              `Funciona <b>mientras haya un solo proceso</b>.`,
              `Si el servidor se reinicia o se duplica, <b>el candado no existe</b>.`,
              `Es código extra que la base de datos <b>ya sabe hacer</b>.`,
            ],
            { g0: 0, step: 1 },
          )}
          ${g(3, call(`Lección: no reinventes lo que tu herramienta ya garantiza. Atrás para elegir de nuevo.`, { kind: "warn" }), "up")}`,
        notes:
          "Esta rama es tentadora porque parece rápida. Un candado en una variable solo vive en un proceso. En cuanto haya dos procesos o un reinicio, deja de proteger. Insistan en la idea de usar la garantía que ya ofrece la herramienta.",
      },
    ],
  },
];

export const phase7 = [
  phaseCard(
    7,
    "f7-titulo",
    "<em>Evaluar</em> el resultado",
    "¿Cumplimos los criterios de la historia? ¿Resolvimos el problema de <b style='color:#fff'>Valentina</b>?",
    [SOF, "Equipo"],
    "Fase siete. Evaluar tiene dos niveles. Primero: ¿se cumplen los criterios de aceptación de la historia? Segundo: ¿esto ayuda a lograr lo que el cliente quería? Pueden ser respuestas distintas.",
    "both",
  ),
  {
    id: "f7-criterios",
    phase: 7,
    title: "Criterios de aceptación: <em>uno por uno</em>",
    tool: "bmad",
    who: [SOF, "Equipo"],
    body: `
      ${table(
        ["Criterio", "Estado"],
        [
          ["Unirse con cupo: aparezco como miembro", `<span style="color:#3ee6b0;font-weight:700">✓ Cumple</span>`],
          ["Grupo lleno: recibo 409 «Grupo lleno»", `<span style="color:#3ee6b0;font-weight:700">✓ Cumple</span>`],
          ["Ya soy miembro: recibo 409", `<span style="color:#3ee6b0;font-weight:700">✓ Cumple</span>`],
          ["Dos personas, un cupo: solo una entra", `<span style="color:#3ee6b0;font-weight:700">✓ Cumple (tras la corrección)</span>`],
        ],
        { g0: 0, step: 1, cols: "1.5fr 1fr" },
      )}`,
    notes:
      "Cada criterio de la historia (y cada escenario de la spec) se verifica con una prueba. Noten que el cuarto solo cumple después de la corrección de la fase anterior: por eso la evaluación es un paso aparte y no se da por hecho. Si algún criterio falla, la historia vuelve a la fase 5.",
  },
  {
    id: "f7-prueba",
    phase: 7,
    title: "Probar de <em>verdad</em>",
    tool: null,
    who: [SOF, MAT + " + " + CAM],
    body: `
      ${term(
        [
          { cmd: "npm test", g: 0 },
          { out: "✓ 9 pruebas pasaron (cupo, duplicado, concurrencia)", ok: true, g: 1 },
          { cmd: "curl -X POST localhost:3000/api/groups/7/join", g: 2 },
          { out: "201 Created", ok: true, g: 3 },
          { out: "409 {\"error\":\"Grupo lleno\"}  (la segunda vez)", warn: true, g: 4 },
        ],
        { title: "terminal" },
      )}
      ${g(5, call(`Tests automáticos <b>y</b> una prueba manual: las dos cosas.`), "up")}`,
    notes:
      "Una prueba automática no sustituye usar la función. Sofía, como Product Owner, hace la prueba manual en la interfaz y con curl. Los números de la salida son ilustrativos. Cuenten que 'funciona en mi máquina' no es evaluación.",
  },
  {
    id: "f7-archive",
    phase: 7,
    title: "<em>/opsx:archive</em>: la spec se vuelve oficial",
    tool: "openspec",
    who: [MAT, AND],
    body: `
      ${term(
        [{ cmd: "/opsx:archive join-study-group", g: 0 }, { out: "✓ Delta fusionada · cambio archivado", ok: true, g: 1 }],
        { title: "Claude Code · Mateo" },
      )}
      <div class="flow" style="justify-content:center;gap:24px;margin-top:6px">
        ${g(2, `<div class="node" style="--nc:#3ee6b0;width:700px;font-size:32px">changes/join-study-group/<br/>specs/…/spec.md<small>delta: ADDED</small></div>`, "left")}
        <div class="arr" data-g="3" data-fx="pop">➜</div>
        ${g(3, `<div class="node" style="--nc:#ffc233;width:760px;font-size:32px">openspec/specs/<br/>group-membership/spec.md<small>spec oficial y viva</small></div>`, "right")}
      </div>
      ${g(4, call(`El cambio queda guardado en <span class="ic">changes/archive/</span> con su fecha, como historia.`), "up")}`,
    notes:
      "Este es el momento en que lo nuevo pasa a ser la verdad del sistema. La delta se fusiona en la spec oficial (carpeta openspec/specs) y la carpeta del cambio se mueve al archivo, con la fecha. Resultado: la próxima persona que toque este módulo lee una spec que describe cómo es hoy, no cómo era hace tres meses.",
  },
  {
    id: "f7-cliente",
    phase: 7,
    title: "¿Resolvimos el problema de <em>Valentina</em>?",
    tool: "bmad",
    who: [SOF, null],
    body: `
      ${cards(
        [
          { h: "La función", p: "Se puede crear grupos, unirse y ver el cupo.", c: "#3ee6b0" },
          { h: "La meta", p: "¿200 grupos activos? Aún no lo sabemos: se mide en el semestre.", c: "#ffc233" },
          { h: "La demo", p: "Valentina prueba y dice qué cambiaría.", c: "#4cc9f0" },
        ],
        { cols: 3, g0: 0, step: 1 },
      )}
      ${g(4, call(`Cumplir los criterios es <b>necesario</b>, pero no suficiente. La meta del brief se mide <b>con usuarios reales</b>.`, { kind: "warn" }), "up")}`,
    notes:
      "Aquí cerramos el círculo con el brief. Todas las pruebas pueden pasar y aun así no cumplir el objetivo del cliente. Sofía hace la demo, recoge la reacción de Valentina y anota qué mediremos en el semestre (grupos activos). Si hay nuevos pedidos, vuelven como historias nuevas.",
  },
  {
    id: "f7-merge",
    phase: 7,
    title: "Cerrar el <em>ticket</em>",
    tool: "bmad",
    who: [AND, "Equipo"],
    body: `
      ${bullets(
        [
          `Aprobado el PR → <b>merge a main</b>.`,
          `Se borra la rama <span class="ic">feat/3-1-unirse-grupo</span>.`,
          `Se actualiza el tablero: <span class="ic">3-1-unirse-grupo: done</span>.`,
          `Se toma la <b>siguiente historia</b>.`,
        ],
        { g0: 0, step: 1, cls: "sm" },
      )}`,
    notes:
      "Cierre administrativo pero importante: si el tablero no se actualiza, nadie sabe qué falta. Dependiendo del flujo, el estado puede actualizarse a mano o con los comandos de BMAD. Después de este paso, el equipo vuelve a la fase 4 con la siguiente historia.",
  },
  {
    id: "f7-turno",
    phase: 7,
    title: "<em>Tu turno</em>: ¿terminamos?",
    tool: null,
    who: ["Todo el equipo", null],
    kicker: "Fase 7 · Checkpoint",
    body: `
      ${call(`Todos los tests pasan, pero Valentina dice: <b>«los estudiantes no saben que existe la app»</b>.`, { g: 0, kind: "warn" })}
      ${bullets([`¿Es un fallo de la historia 3.1?`, `¿Qué documento habría que <b>actualizar</b>?`, `¿Qué historia nueva escribirían?`], { g0: 1, step: 1, cls: "sm" })}`,
    notes:
      "Discusión corta. No es un fallo de la 3.1: es un tema de producto (difusión). Probablemente se registra en el PRD como un requisito nuevo (por ejemplo, compartir un enlace) o se deja fuera de alcance. Lo importante es que la respuesta del cliente alimenta los documentos.",
  },
];

export const phase8 = [
  phaseCard(
    8,
    "f8-titulo",
    "La <em>retrospectiva</em>",
    "Mirar atrás para que el <b style='color:#fff'>siguiente ticket</b> salga mejor que este.",
    ["Todo el equipo", null],
    "Última fase del ciclo. La retrospectiva no es para buscar culpables; es para encontrar mejoras concretas. BMAD tiene un flujo para esto, que trabaja con la evidencia que el trabajo dejó: specs, historias, diffs y commits.",
    "bmad",
  ),
  {
    id: "f8-cmd",
    phase: 8,
    title: "Retro con <em>evidencia</em>",
    tool: "bmad",
    who: ["Todo el equipo", null],
    body: `
      ${term(
        [
          { cmd: "/bmad-retrospective", g: 0 },
          { out: "› Retro de la épica 3: unirse y salir", g: 1 },
          { out: "✓ implementation-artifacts/epic-3-retro-2026-10-22.md", ok: true, g: 2 },
        ],
        { title: "Claude Code · Andrés" },
      )}
      ${g(3, call(`Revisa <b>la épica completa</b> contra lo que dejó: specs, historias, commits y estado del sprint.`), "up")}
      ${g(4, call(`Resultado: hallazgos con fuente, <b>acciones</b> y una decisión de aceptación.`, { kind: "good" }), "up")}`,
    notes:
      "El comando de retrospectiva de BMAD trabaja sobre una épica terminada y se apoya en pruebas, no en recuerdos. Por eso en nuestra clase lo ejecutamos al cerrar la épica 3. El nombre del archivo generado lleva el número de la épica y la fecha. Si solo cerraron una historia, hagan una retro corta de equipo con las tres columnas de la siguiente diapositiva.",
  },
  {
    id: "f8-formato",
    phase: 8,
    title: "Tres columnas, <em>una conversación</em>",
    tool: null,
    who: ["Todo el equipo", null],
    body: `
      ${cards(
        [
          { h: "Funcionó", p: "Revisar la spec antes del código evitó un malentendido.", c: "#3ee6b0" },
          { h: "Costó", p: "La carrera por el cupo apareció tarde, en la revisión.", c: "#ffc233" },
          { h: "Probamos", p: "Escribir un escenario de concurrencia desde el propose.", c: "#ff6b9d" },
        ],
        { cols: 3, g0: 0, step: 1 },
      )}
      ${g(4, call(`Cada «Probamos» debe tener <b>un dueño</b> y una <b>fecha</b>. Si no, es un deseo.`, { kind: "warn" }), "up")}`,
    notes:
      "El formato más simple y suficiente. Pidan a cada equipo que escriba una nota por columna. La tercera es la que cambia el futuro: una acción con dueño y fecha. Reglas de convivencia: se critica el proceso, no a las personas.",
  },
  {
    id: "f8-acciones",
    phase: 8,
    title: "Acciones que <em>cambian el proceso</em>",
    tool: "both",
    who: ["Todo el equipo", null],
    body: `
      ${table(
        ["Acción", "Dueño", "Para"],
        [
          ["Añadir «concurrencia» a la lista de casos de cada propose", "Mateo", "Próx. historia"],
          ["Pedir revisión de la spec a quien <b>no</b> la escribió", "Andrés", "Siempre"],
          ["Agregar estado de carga al botón de unirse", "Camila", "Historia 3.2"],
        ],
        { g0: 0, step: 1, cols: "2.2fr 1fr 1.2fr" },
      )}
      ${g(4, call(`Las acciones se escriben en <span class="ic">openspec/config.yaml</span> o en el README del equipo, para que <b>duren</b>.`), "up")}`,
    notes:
      "Ejemplos concretos de acciones. La última nota es útil: OpenSpec permite escribir reglas del proyecto en config.yaml (por ejemplo, 'siempre incluir casos de concurrencia en las specs'), de modo que la mejora quede incorporada en el proceso y no dependa de la memoria de nadie.",
  },
  {
    id: "f8-ciclo",
    phase: 8,
    title: "Y se <em>repite</em>",
    tool: "both",
    who: ["Todo el equipo", null],
    body: `
      <div class="flow" style="justify-content:center">
        ${g(0, `<div class="node" style="--nc:#3ee6b0">Fase 4<small>Spec</small></div>`, "pop")}<div class="arr" data-g="1" data-fx="fade">›</div>
        ${g(1, `<div class="node" style="--nc:#8ee35a">Fase 5<small>Aplicar</small></div>`, "pop")}<div class="arr" data-g="2" data-fx="fade">›</div>
        ${g(2, `<div class="node" style="--nc:#ffc233">Fase 6<small>Revisión</small></div>`, "pop")}<div class="arr" data-g="3" data-fx="fade">›</div>
        ${g(3, `<div class="node" style="--nc:#ff8c3a">Fase 7<small>Evaluar</small></div>`, "pop")}<div class="arr" data-g="4" data-fx="fade">›</div>
        ${g(4, `<div class="node" style="--nc:#ff6b9d">Fase 8<small>Retro</small></div>`, "pop")}
      </div>
      ${g(5, `<div class="big ctr" style="font-size:90px;color:#ff6b9d;text-align:center">↺ siguiente historia</div>`, "pop")}
      ${g(6, call(`Cada <b>épica</b> cierra con una retro. Lo que aprendes vuelve al <b>PRD</b> y a las <b>reglas del equipo</b>.`), "up")}`,
    notes:
      "El ciclo de la fase 4 a la 8 se repite por cada historia. Las fases 1 a 3 no se repiten, salvo cuando hay cambios grandes (para eso BMAD tiene /bmad-correct-course, que evalúa el impacto de un cambio importante en el PRD, las épicas y la arquitectura). Cada épica termina con su retro.",
  },
];

export const closing = [
  {
    id: "resumen",
    kicker: "Resumen",
    title: "Los <em>comandos</em> de cada fase",
    tool: "both",
    color: "#6ea8ff",
    phase: 0,
    body: `
      ${table(
        ["Fase", "Comando", "Quién"],
        [
          ["1 Necesidad", `<span class="ic">/bmad-product-brief</span>`, "Sofía"],
          ["2 Plan", `<span class="ic">/bmad-prd</span> · <span class="ic">/bmad-architecture</span>`, "Sofía · Andrés"],
          ["3 Épicas", `<span class="ic">/bmad-create-epics-and-stories</span>`, "Andrés"],
          ["4 Spec", `<span class="ic">/opsx:propose</span>`, "Mateo + Camila"],
          ["5 Aplicar", `<span class="ic">/opsx:apply</span> · <span class="ic">/opsx:update</span>`, "Mateo + Camila"],
          ["6 Revisión", `<span class="ic">/bmad-code-review</span>`, "Andrés (revisor)"],
          ["7 Evaluar", `<span class="ic">/opsx:archive</span>`, "Mateo · Sofía"],
          ["8 Retro", `<span class="ic">/bmad-retrospective</span>`, "Equipo"],
        ],
        { g0: 0, step: 1, cols: "300px 1fr 330px", sm: true },
      )}`,
    notes:
      "Esta es la hoja de referencia: la pueden fotografiar. Cada fase tiene un comando principal y un responsable. Recuerden: BMAD para las fases 1, 2, 3, 6 y 8; OpenSpec para las fases 4, 5 y 7. Las fases se mantienen en orden porque cada una produce lo que la siguiente necesita.",
  },
  {
    id: "errores",
    kicker: "Para evitar",
    title: "Seis <em>errores</em> de principiante",
    tool: null,
    color: "#ffc233",
    phase: 0,
    body: `
      ${bullets(
        [
          `Programar <b>sin spec aprobada</b>.`,
          `Revisar <b>tu propio</b> código.`,
          `Corregir el código y <b>olvidar la spec</b>.`,
          `Historias gigantes: <b>«hacer el backend»</b>.`,
          `Mezclar <b>dos fuentes de verdad</b> en un ticket.`,
          `Retros <b>sin acciones</b> con dueño.`,
        ],
        { g0: 0, step: 1, cls: "sm" },
      )}`,
    notes:
      "Cierre práctico. Cada error corresponde a una regla que vimos. Pidan a los estudiantes que identifiquen cuál han cometido ya en un trabajo de grupo anterior. Si queda tiempo, pregunten cuál creen que es el más caro.",
  },
  {
    id: "recursos",
    kicker: "Siguientes pasos",
    title: "Ahora, <em>a practicar</em>",
    tool: "both",
    color: "#6ea8ff",
    phase: 0,
    body: `
      ${cards(
        [
          { h: "Reto", p: "Siguiendo este recorrido, construyan la historia 3.2: salir de un grupo.", c: "#3ee6b0" },
          { h: "BMAD", p: "github.com/bmad-code-org/BMAD-METHOD", c: "#6ea8ff" },
          { h: "OpenSpec", p: "github.com/Fission-AI/OpenSpec", c: "#3ee6b0" },
        ],
        { cols: 3, g0: 0, step: 1 },
      )}
      ${g(4, `<div class="big" style="font-size:72px;text-align:center;width:100%;margin-top:10px">¿Preguntas?</div>`, "pop")}`,
    notes:
      "Cierren con el reto: que el equipo repita el ciclo completo con la historia 3.2. Los enlaces llevan a la documentación oficial; ahí encontrarán las versiones nuevas de los comandos, que cambian con frecuencia. Dejen tiempo para preguntas y recuerden a los estudiantes que lo valioso no son los comandos, sino la disciplina: escribir antes de construir.",
  },
];

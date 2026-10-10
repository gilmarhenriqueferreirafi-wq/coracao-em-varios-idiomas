const fallbackPhrases = [
  "Eu te amo", "I love you", "Te quiero", "Je t'aime", "Ti amo",
  "Ich liebe dich", "Te iubesc", "Я тебя люблю", "愛してる", "사랑해",
  "我爱你", "Σ' αγαπώ", "Seni seviyorum", "أحبك"
];

const colorBank = {
  preto: "#050509",
  rosa: "#ff315d",
  vermelho: "#ff3b30",
  roxo: "#b026ff",
  azul: "#3b82ff",
  verde: "#22c55e",
  dourado: "#f5b942"
};

const fontBank = { pequena: 10, media: 12, grande: 14 };

function resolveColor(value) {
  if (colorBank[value]) return colorBank[value];
  if (/^#[\da-f]{6}$/i.test(value)) return value;
  return null;
}

function hexToRgba(hex, alpha) {
  const number = Number.parseInt(hex.slice(1), 16);
  return `rgba(${number >> 16}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
}

function applyTheme(accent, background) {
  const root = document.documentElement;
  root.style.setProperty("--pink", accent);
  root.style.setProperty("--pink-soft", accent);
  root.style.setProperty("--bg-glow", hexToRgba(background, 0.18));
}

function animateElement(element, delay, duration = 700) {
  element.style.opacity = "0";
  element.style.transform = "translate(-50%, calc(-50% + 12px)) scale(0.96)";

  if (typeof element.animate === "function") {
    element.animate([
    { opacity: 0, transform: "translate(-50%, calc(-50% + 12px)) scale(0.96)" },
    { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
    ], {
      duration,
      delay: delay * 1000,
      easing: "ease-out",
      fill: "forwards"
    });
    return;
  }

  element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  window.setTimeout(() => {
    element.style.opacity = "1";
    element.style.transform = "translate(-50%, -50%) scale(1)";
  }, delay * 1000);
}

function heartPoint(angle) {
  return {
    x: 16 * Math.sin(angle) ** 3,
    y: 13 * Math.cos(angle) - 5 * Math.cos(2 * angle)
      - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)
  };
}

function heartSpans(y, scale, centerX, centerY) {
  const polygon = Array.from({ length: 720 }, (_, i) => {
    const p = heartPoint((Math.PI * 2 * i) / 720);
    return { x: centerX + p.x * scale, y: centerY - p.y * scale };
  });
  const intersections = [];

  for (let i = 0; i < polygon.length; i += 1) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    if ((a.y <= y && y < b.y) || (b.y <= y && y < a.y)) {
      intersections.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
    }
  }

  intersections.sort((a, b) => a - b);
  const spans = [];
  for (let i = 0; i + 1 < intersections.length; i += 2) {
    spans.push([intersections[i], intersections[i + 1]]);
  }
  return spans;
}

function show404() {
  document.body.classList.add("error-page");
  document.title = "404 — Nome não encontrado";
  document.querySelector("#app").innerHTML = `
    <img class="error-art" src="fundo-404.png" alt="Página 404 romântica com um coração formado por frases">
    <section class="not-found" aria-label="Página não encontrada">
      <h1>404</h1>
      <p>Este coração precisa de um nome.</p>
      <p>Use uma URL como <code>?nome=Emanuela</code>.</p>
    </section>`;
}

async function loadPhrases() {
  try {
    const response = await fetch("eu_te_amo_em_varios_idiomas.csv");
    if (!response.ok) throw new Error("CSV indisponível");
    const lines = (await response.text()).split(/\r?\n/).slice(1);
    const loaded = lines
      .map((line) => line.split(",").slice(1).join(",").trim())
      .filter(Boolean);
    return loaded.length ? loaded : fallbackPhrases;
  } catch {
    return fallbackPhrases;
  }
}

function showHeart(name, phraseList, options) {
  document.title = `${name} — Um coração em vários idiomas`;
  const stage = document.createElement("section");
  stage.className = "stage";

  const card = document.createElement("div");
  card.className = "name-card";
  card.innerHTML = `<span></span>${options.message ? `<p></p>` : ""}`;
  card.querySelector("span").textContent = name;
  if (options.message) card.querySelector("p").textContent = options.message;
  if (options.animate) {
    card.style.opacity = "0";
    card.style.transform = "translate(-50%, calc(-50% + 12px)) scale(0.96)";
  }
  stage.appendChild(card);
  document.querySelector("#app").replaceChildren(stage);

  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const isMobile = width < 650 || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const batchSize = 30;
  const page = window.__heartPage || 0;
  const displayPhrases = isMobile
    ? phraseList.slice((page * batchSize) % phraseList.length, ((page * batchSize) % phraseList.length) + batchSize)
    : phraseList;
  const visiblePhrases = displayPhrases.length ? displayPhrases : phraseList.slice(0, batchSize);
  const scale = Math.min(width / (isMobile ? 27 : 30), height / 30);
  const rowGap = isMobile ? 15 : 19;
  const wordGap = isMobile ? 6 : 14;
  const preferredFontSize = isMobile ? Math.min(options.fontSize, 8) : options.fontSize;
  const centerX = width / 2;
  const centerY = height / 2 + 18;
  const cardLeft = centerX - card.offsetWidth / 2 - 12;
  const cardRight = centerX + card.offsetWidth / 2 + 12;
  const cardTop = centerY - card.offsetHeight / 2 - 10;
  const cardBottom = centerY + card.offsetHeight / 2 + 10;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let phraseIndex = 0;

  for (let y = centerY - 17 * scale; y <= centerY + 17 * scale; y += rowGap) {
    for (const [rawLeft, rawRight] of heartSpans(y, scale, centerX, centerY)) {
      const spans = y > cardTop && y < cardBottom
        ? [[rawLeft, Math.min(rawRight, cardLeft)], [Math.max(rawLeft, cardRight), rawRight]]
        : [[rawLeft, rawRight]];

      for (const [left, right] of spans) {
        let cursor = left + 7;
        let placedInSpan = false;
        while (cursor < right - 7 && (!isMobile || !placedInSpan)) {
          if (isMobile && phraseIndex >= visiblePhrases.length) break;
          let phrase = visiblePhrases[phraseIndex++ % visiblePhrases.length];
          let fontSize = preferredFontSize;
          context.font = `700 ${fontSize}px Arial`;
          let phraseWidth = context.measureText(phrase).width;

          if (cursor + phraseWidth > right - 7) {
            fontSize = Math.max(7, preferredFontSize - 2);
            context.font = `700 ${fontSize}px Arial`;
            phraseWidth = context.measureText(phrase).width;
          }
          if (cursor + phraseWidth > right - 7) {
            fontSize = 7;
            context.font = `700 ${fontSize}px Arial`;
            phraseWidth = context.measureText(phrase).width;
          }
          if (cursor + phraseWidth > right - 7) {
            const shortPhrases = ["Te amo", "Ti amo", "Eu te amo"];
            phrase = shortPhrases[phraseIndex++ % shortPhrases.length];
            fontSize = 7;
            context.font = `700 ${fontSize}px Arial`;
            phraseWidth = context.measureText(phrase).width;
          }
          if (cursor + phraseWidth > right - 7) break;

          const word = document.createElement("span");
          word.className = "heart-word";
          word.textContent = phrase;
          word.style.left = `${cursor + phraseWidth / 2}px`;
          word.style.top = `${y}px`;
          word.style.fontSize = `${fontSize}px`;
          const distance = Math.hypot((cursor + phraseWidth / 2) - centerX, y - centerY);
          const delay = Math.max(0, (1 - distance / (17 * scale)) * 4.1) + (phraseIndex % 3) * 0.04;
          word.style.setProperty("--delay", `${delay.toFixed(2)}s`);
          stage.appendChild(word);
          if (options.animate) animateElement(word, delay);
          placedInSpan = true;
          cursor += phraseWidth + wordGap;
        }

      }
    }
  }
  if (options.animate) {
    animateElement(card, 4.7, 800);
  }

  if (isMobile && phraseList.length > batchSize) {
    clearTimeout(window.__heartCycleTimer);
    window.__heartCycleTimer = setTimeout(() => {
      window.__heartPage = (page + 1) % Math.ceil(phraseList.length / batchSize);
      showHeart(name, phraseList, options);
    }, 7500);
  }
}

const params = new URLSearchParams(window.location.search);
const name = params.get("nome")?.trim();
const accent = resolveColor((params.get("cor") || "rosa").toLowerCase());
const background = resolveColor((params.get("fundo") || "preto").toLowerCase());
const fontSize = fontBank[(params.get("fonte") || "media").toLowerCase()];
const animationValue = (params.get("animacao") || "sim").toLowerCase();
const message = params.get("mensagem")?.trim() || "";

if (!name || !accent || !background || !fontSize || !["sim", "nao"].includes(animationValue) || message.length > 80) {
  show404();
} else {
  applyTheme(accent, background);
  loadPhrases().then((phraseList) => showHeart(name, phraseList, {
    fontSize,
    message,
    animate: animationValue === "sim"
  }));
}


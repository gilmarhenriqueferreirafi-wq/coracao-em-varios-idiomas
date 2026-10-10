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
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  element.animate([
    { opacity: 0, transform: "translate(-50%, calc(-50% + 12px)) scale(0.96)" },
    { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
  ], {
    duration,
    delay: delay * 1000,
    easing: "ease-out",
    fill: "forwards"
  });
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
  stage.appendChild(card);
  document.querySelector("#app").replaceChildren(stage);

  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const scale = Math.min(width / 30, height / 30);
  const centerX = width / 2;
  const centerY = height / 2 + 18;
  const cardLeft = centerX - card.offsetWidth / 2 - 12;
  const cardRight = centerX + card.offsetWidth / 2 + 12;
  const cardTop = centerY - card.offsetHeight / 2 - 10;
  const cardBottom = centerY + card.offsetHeight / 2 + 10;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let phraseIndex = 0;
  const lowerTipStart = centerY + scale * 0.62;

  for (let y = centerY - 17 * scale; y <= centerY + 17 * scale; y += 19) {
    for (const [rawLeft, rawRight] of heartSpans(y, scale, centerX, centerY)) {
      const spans = y > cardTop && y < cardBottom
        ? [[rawLeft, Math.min(rawRight, cardLeft)], [Math.max(rawLeft, cardRight), rawRight]]
        : [[rawLeft, rawRight]];

      for (const [left, right] of spans) {
        let cursor = left + 7;
        let placed = false;
        while (cursor < right - 7) {
          let phrase = phraseList[phraseIndex++ % phraseList.length];
          let fontSize = options.fontSize;
          context.font = `700 ${fontSize}px Arial`;
          let phraseWidth = context.measureText(phrase).width;

          if (cursor + phraseWidth > right - 7) {
            fontSize = Math.max(8, options.fontSize - 2);
            context.font = `700 ${fontSize}px Arial`;
            phraseWidth = context.measureText(phrase).width;
          }
          if (cursor + phraseWidth > right - 7) {
            fontSize = 8;
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
          placed = true;
          cursor += phraseWidth + 14;
        }

        // Completa as pontas estreitas dos lobos sem forçar uma frase a caber.
        if (!placed && right - left > 8 && y < lowerTipStart) {
          const accent = document.createElement("span");
          accent.className = "heart-word heart-accent";
          accent.textContent = "♥";
          accent.style.left = `${(left + right) / 2}px`;
          accent.style.top = `${y}px`;
          stage.appendChild(accent);
        }
      }
    }
  }

  const tip = document.createElement("span");
  tip.className = "heart-word heart-accent";
  tip.textContent = "♥";
  tip.style.left = `${centerX}px`;
  tip.style.top = `${centerY + scale * 13.3}px`;
  tip.style.setProperty("--delay", "4.2s");
  stage.appendChild(tip);
  if (options.animate) {
    animateElement(tip, 4.2);
    animateElement(card, 4.7, 800);
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


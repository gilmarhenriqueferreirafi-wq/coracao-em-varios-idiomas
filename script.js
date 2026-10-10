const fallbackPhrases = [
  "Eu te amo", "I love you", "Te quiero", "Je t'aime", "Ti amo",
  "Ich liebe dich", "Te iubesc", "Я тебя люблю", "愛してる", "사랑해",
  "我爱你", "Σ' αγαπώ", "Seni seviyorum", "أحبك"
];

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

function showHeart(name, phraseList) {
  document.title = `${name} — Um coração em vários idiomas`;
  const stage = document.createElement("section");
  stage.className = "stage";

  const card = document.createElement("div");
  card.className = "name-card";
  card.innerHTML = `<span></span>`;
  card.querySelector("span").textContent = name;
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

  for (let y = centerY - 17 * scale; y <= centerY + 17 * scale; y += 23) {
    for (const [rawLeft, rawRight] of heartSpans(y, scale, centerX, centerY)) {
      const spans = y > cardTop && y < cardBottom
        ? [[rawLeft, Math.min(rawRight, cardLeft)], [Math.max(rawLeft, cardRight), rawRight]]
        : [[rawLeft, rawRight]];

      for (const [left, right] of spans) {
        let cursor = left + 7;
        let placed = false;
        while (cursor < right - 7) {
          let phrase = phraseList[phraseIndex++ % phraseList.length];
          let fontSize = 12;
          context.font = `700 ${fontSize}px Arial`;
          let phraseWidth = context.measureText(phrase).width;

          if (cursor + phraseWidth > right - 7) {
            fontSize = 10;
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
          stage.appendChild(word);
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
  tip.style.top = `${centerY + scale * 15.5}px`;
  stage.appendChild(tip);
}

const name = new URLSearchParams(window.location.search).get("nome")?.trim();
if (name) loadPhrases().then((phraseList) => showHeart(name, phraseList));
else show404();


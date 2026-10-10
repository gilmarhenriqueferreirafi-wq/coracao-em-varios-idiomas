const phrases = [
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

function showHeart(name) {
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
  const scale = Math.min(width / 31, height / 31);
  const centerX = width / 2;
  const centerY = height / 2 + 18;
  const cardLeft = centerX - card.offsetWidth / 2 - 12;
  const cardRight = centerX + card.offsetWidth / 2 + 12;
  const cardTop = centerY - card.offsetHeight / 2 - 10;
  const cardBottom = centerY + card.offsetHeight / 2 + 10;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let phraseIndex = 0;

  for (let y = centerY - 17 * scale; y <= centerY + 17 * scale; y += 28) {
    for (const [rawLeft, rawRight] of heartSpans(y, scale, centerX, centerY)) {
      const spans = y > cardTop && y < cardBottom
        ? [[rawLeft, Math.min(rawRight, cardLeft)], [Math.max(rawLeft, cardRight), rawRight]]
        : [[rawLeft, rawRight]];

      for (const [left, right] of spans) {
        let cursor = left + 7;
        while (cursor < right - 7) {
          let phrase = phrases[phraseIndex++ % phrases.length];
          let fontSize = 12;
          context.font = `700 ${fontSize}px Arial`;
          let phraseWidth = context.measureText(phrase).width;

          if (cursor + phraseWidth > right - 7) {
            fontSize = 10;
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
          cursor += phraseWidth + 14;
        }
      }
    }
  }
}

const name = new URLSearchParams(window.location.search).get("nome")?.trim();
if (name) showHeart(name); else show404();


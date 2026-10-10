const phrases = [
  "Eu te amo", "I love you", "Te quiero", "Je t'aime", "Ti amo",
  "Ich liebe dich", "Te iubesc", "Я тебя люблю", "愛してる", "사랑해",
  "我爱你", "Σ' αγαπώ", "Seni seviyorum", "أحبك"
];

function insideHeart(x, y) {
  return Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0;
}

function heartPoints() {
  const points = [];
  let phraseIndex = 0;

  for (let y = 1.12; y >= -1.22; y -= 0.15) {
    const spans = [];
    let start = null;

    for (let x = -1.5; x <= 1.5; x += 0.01) {
      const inside = insideHeart(x, y);
      if (inside && start === null) start = x;
      if ((!inside || x >= 1.49) && start !== null) {
        spans.push([start, inside && x >= 1.49 ? x : x - 0.01]);
        start = null;
      }
    }

    for (const [left, right] of spans) {
      // Abre espaço para o cartão central sem deixar texto por baixo dele.
      const pieces = Math.abs(y) < 0.3
        ? [[left, Math.min(right, -0.5)], [Math.max(left, 0.5), right]]
        : [[left, right]];

      for (const [pieceLeft, pieceRight] of pieces) {
        if (pieceRight - pieceLeft < 0.2) continue;
        let cursor = pieceLeft + 0.02;
        while (cursor < pieceRight - 0.12) {
          const phrase = phrases[phraseIndex++ % phrases.length];
          const width = Math.max(0.19, phrase.length * 0.018);
          if (cursor + width > pieceRight) break;
          points.push({ x: cursor + width / 2, y, phrase });
          cursor += width + 0.08;
        }
      }
    }
  }
  return points;
}

function show404() {
  document.title = "404 — Nome não encontrado";
  document.querySelector("#app").innerHTML = `
    <section class="not-found">
      <h1>404</h1>
      <p>Este coração precisa de um nome.</p>
      <p>Use uma URL como <code>?nome=Emanuela</code>.</p>
    </section>`;
}

function showHeart(name) {
  document.title = `${name} — Um coração em vários idiomas`;
  const stage = document.createElement("section");
  stage.className = "stage";

  let index = 0;
  for (const point of heartPoints()) {
    const word = document.createElement("span");
    word.className = "heart-word";
    word.textContent = point.phrase || phrases[index++ % phrases.length];
    word.style.left = `${50 + point.x * 31}%`;
    word.style.top = `${50 - point.y * 35}%`;
    stage.appendChild(word);
  }

  const card = document.createElement("div");
  card.className = "name-card";
  card.innerHTML = `<span></span>`;
  card.querySelector("span").textContent = name;
  stage.appendChild(card);
  document.querySelector("#app").replaceChildren(stage);
}

const name = new URLSearchParams(window.location.search).get("nome")?.trim();
if (name) showHeart(name); else show404();


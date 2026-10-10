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
  for (let y = 1.15; y >= -1.25; y -= 0.17) {
    for (let x = -1.45; x <= 1.45; x += 0.22) {
      if (!insideHeart(x, y)) continue;
      // Reserva o centro para o cartão com o nome.
      if (Math.abs(x) < 0.48 && Math.abs(y) < 0.28) continue;
      points.push({ x, y });
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
    word.textContent = phrases[index++ % phrases.length];
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


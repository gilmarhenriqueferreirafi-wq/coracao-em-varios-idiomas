const phrases = [
  "Eu te amo", "I love you", "Te quiero", "Je t'aime", "Ti amo",
  "Ich liebe dich", "Te iubesc", "Я тебя люблю", "愛してる", "사랑해",
  "我爱你", "Σ' αγαπώ", "Seni seviyorum", "أحبك"
];

// Posições fixas deixam uma folga real entre frases de tamanhos diferentes.
const heartLayout = [
  [18, [39, 61]],
  [25, [33, 43, 57, 67]],
  [32, [28, 38, 48, 52, 62, 72]],
  [39, [25, 35, 45, 55, 65, 75]],
  [46, [24, 34, 44, 56, 66, 76]],
  [53, [26, 36, 46, 54, 64, 74]],
  [60, [30, 40, 50, 60, 70]],
  [67, [36, 46, 56, 66]],
  [74, [43, 57]],
  [81, [50]]
];

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
  for (const [top, positions] of heartLayout) {
    for (const left of positions) {
    const word = document.createElement("span");
    word.className = "heart-word";
    word.textContent = phrases[index++ % phrases.length];
    // Expande o coração sem alterar o espaçamento interno das frases.
    word.style.left = `${50 + (left - 50) * 1.45}%`;
    word.style.top = `${50 + (top - 50) * 1.25}%`;
    stage.appendChild(word);
    }
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


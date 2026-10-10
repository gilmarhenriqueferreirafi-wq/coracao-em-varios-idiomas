const phrases = [
  "Eu te amo", "I love you", "Te quiero", "Je t'aime", "Ti amo",
  "Ich liebe dich", "Te iubesc", "Я тебя люблю", "愛してる", "사랑해",
  "我爱你", "Σ' αγαπώ", "Seni seviyorum", "أحبك"
];

// Coordenadas pensadas para formar dois lobos, um corpo largo e uma ponta.
const rows = [
  [-205, [-180, -95, 95, 180]],
  [-155, [-260, -175, -90, 90, 175, 260]],
  [-105, [-305, -220, -135, -50, 35, 120, 205, 290]],
  [-55,  [-320, -235, -150, -65, 20, 105, 190, 275]],
  [-5,   [-320, -235, -150, -65, 20, 105, 190, 275]],
  [45,   [-280, -195, -110, -25, 60, 145, 230]],
  [95,   [-235, -150, -65, 20, 105, 190]],
  [145,  [-180, -95, -10, 75, 160]],
  [195,  [-120, -35, 50, 135]],
  [245,  [0]]
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
  for (const [y, xs] of rows) {
    for (const x of xs) {
      // Mantém o espaço central limpo para o cartão do nome.
      if (Math.abs(x) < 145 && Math.abs(y) < 75) continue;
      const word = document.createElement("span");
      word.className = "heart-word";
      word.textContent = phrases[index++ % phrases.length];
      word.style.left = `${50 + (x / 7.2)}%`;
      word.style.top = `${50 + (y / 4.8)}%`;
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


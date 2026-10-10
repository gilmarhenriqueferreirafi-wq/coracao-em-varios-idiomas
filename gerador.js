const form = document.querySelector("#generator-form");
const result = document.querySelector("#result");
const generatedUrl = document.querySelector("#generated-url");
const openUrl = document.querySelector("#open-url");
const copyUrl = document.querySelector("#copy-url");
const copyStatus = document.querySelector("#copy-status");
const previewName = document.querySelector("#preview-name");
const previewHeart = document.querySelector("#preview-heart");
const previewMessage = document.querySelector("#preview-message");

const accentColors = {
  rosa: "#ff4168",
  vermelho: "#ff4a43",
  roxo: "#bd63ff",
  azul: "#55a7ff",
  verde: "#4ddf9a",
  dourado: "#f4c36a"
};

function syncPreview() {
  const data = new FormData(form);
  const name = String(data.get("nome") || "").trim();
  const color = accentColors[data.get("cor")] || accentColors.rosa;
  const message = String(data.get("mensagem") || "").trim();
  previewName.textContent = name || "alguém especial";
  previewHeart.style.setProperty("--preview-color", color);
  previewHeart.style.setProperty("--preview-glow", `${color}88`);
  previewHeart.dataset.font = data.get("fonte") || "media";
  previewHeart.dataset.bg = data.get("fundo") || "preto";
  previewHeart.dataset.animation = data.get("animacao") || "sim";
  previewMessage.textContent = message;
  previewMessage.hidden = !message;
}

form.addEventListener("input", syncPreview);
form.addEventListener("change", syncPreview);
syncPreview();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("nome") || "").trim();
  if (!name) return;

  const params = new URLSearchParams({
    nome: name,
    cor: String(data.get("cor")),
    fundo: String(data.get("fundo")),
    fonte: String(data.get("fonte")),
    animacao: String(data.get("animacao"))
  });
  const message = String(data.get("mensagem") || "").trim();
  if (message) params.set("mensagem", message);

  const url = new URL("./", window.location.href);
  url.search = params.toString();
  generatedUrl.value = url.href;
  openUrl.href = url.href;
  result.hidden = false;
  copyStatus.textContent = "";
});

copyUrl.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generatedUrl.value);
    copyStatus.textContent = "Link copiado!";
  } catch {
    generatedUrl.select();
    document.execCommand("copy");
    copyStatus.textContent = "Link copiado!";
  }
});

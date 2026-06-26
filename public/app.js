const inputText = document.querySelector("#inputText");
const outputText = document.querySelector("#outputText");
const statusEl = document.querySelector("#status");
const modeHint = document.querySelector("#modeHint");
const correctButton = document.querySelector("#correctButton");
const changesButton = document.querySelector("#changesButton");
const clearButton = document.querySelector("#clearButton");
const sampleButton = document.querySelector("#sampleButton");
const copyButton = document.querySelector("#copyButton");
const changesPanel = document.querySelector("#changesPanel");
const changesList = document.querySelector("#changesList");
const changesCount = document.querySelector("#changesCount");

const sampleText = "здравей как си аз сам добре днес времето е хубаво но мисля че ще вали по късно";

correctButton.addEventListener("click", () => correctText("clean"));
changesButton.addEventListener("click", () => correctText("changes"));

clearButton.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  renderChanges([]);
  changesPanel.hidden = true;
  setStatus("Готов");
});

sampleButton.addEventListener("click", () => {
  inputText.value = sampleText;
  inputText.focus();
});

copyButton.addEventListener("click", async () => {
  if (!outputText.value.trim()) return;
  await navigator.clipboard.writeText(outputText.value);
  setStatus("Копирано");
  setTimeout(() => setStatus("Готов"), 1300);
});

async function correctText(mode) {
  const text = inputText.value.trim();
  if (!text) {
    setStatus("Няма текст");
    inputText.focus();
    return;
  }

  setBusy(true);
  setStatus("Редактиране...");

  try {
    const response = await fetch("/api/correct", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, mode }),
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Корекцията не беше успешна.");
    }

    outputText.value = payload.result.corrected || "";
    renderChanges(payload.result.changes || []);
    changesPanel.hidden = mode !== "changes";
    modeHint.textContent =
      payload.mode === "ai"
        ? `Коригирано с Gemini модел: ${payload.model}`
        : "Демо режим: добави GEMINI_API_KEY, за да получиш пълна AI редакция.";
    setStatus("Готово");
  } catch (error) {
    setStatus("Грешка");
    modeHint.textContent = error.message;
  } finally {
    setBusy(false);
  }
}

function renderChanges(changes) {
  changesCount.textContent = `${changes.length} ${changes.length === 1 ? "промяна" : "промени"}`;
  changesList.innerHTML = "";

  if (!changes.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Няма отчетени поправки.";
    changesList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const change of changes) {
    const item = document.createElement("article");
    item.className = "change-item";
    item.append(
      createChangeCell("Беше", change.from || ""),
      createChangeCell("Стана", change.to || ""),
      createReason(change.reason || "Друго")
    );
    fragment.append(item);
  }
  changesList.append(fragment);
}

function createChangeCell(label, text) {
  const cell = document.createElement("div");
  cell.className = "change-cell";

  const labelEl = document.createElement("span");
  labelEl.className = "change-label";
  labelEl.textContent = label;

  const textEl = document.createElement("div");
  textEl.className = "change-text";
  textEl.textContent = text;

  cell.append(labelEl, textEl);
  return cell;
}

function createReason(text) {
  const cell = document.createElement("div");
  cell.className = "change-cell";

  const labelEl = document.createElement("span");
  labelEl.className = "change-label";
  labelEl.textContent = "Причина";

  const reason = document.createElement("span");
  reason.className = "reason";
  reason.textContent = text;

  cell.append(labelEl, reason);
  return cell;
}

function setBusy(isBusy) {
  correctButton.disabled = isBusy;
  changesButton.disabled = isBusy;
}

function setStatus(text) {
  statusEl.textContent = text;
}

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

loadEnvFile(path.join(__dirname, ".env"));

const port = Number(process.env.PORT || 8787);
const publicDir = path.join(__dirname, "public");
const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const geminiApiKey = (process.env.GEMINI_API_KEY || "").trim();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const correctionSchema = {
  type: "object",
  required: ["original", "corrected", "changes"],
  properties: {
    original: { type: "string" },
    corrected: { type: "string" },
    changes: {
      type: "array",
      items: {
        type: "object",
        required: ["from", "to", "reason"],
        properties: {
          from: { type: "string" },
          to: { type: "string" },
          reason: {
            type: "string",
            enum: [
              "Правопис",
              "Граматика",
              "Пунктуация",
              "Главни и малки букви",
              "Съгласуване",
              "Дума",
              "Друго"
            ]
          }
        }
      }
    }
  }
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, { ok: true, ai: Boolean(geminiApiKey), model });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/correct") {
      const body = await readJson(req);
      const text = String(body.text || "").trim();
      const mode = body.mode === "changes" ? "changes" : "clean";

      if (!text) {
        sendJson(res, 400, { ok: false, error: "Въведи текст за корекция." });
        return;
      }

      const result = geminiApiKey
        ? await correctWithGemini(text, mode)
        : createLocalDemoCorrection(text);

      sendJson(res, 200, {
        ok: true,
        mode: geminiApiKey ? "ai" : "demo",
        model: geminiApiKey ? model : "Локален демо режим",
        result,
      });
      return;
    }

    if (req.method === "GET") {
      serveStatic(url.pathname, res);
      return;
    }

    sendJson(res, 405, { ok: false, error: "Методът не е позволен." });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error.message || "Възникна грешка.",
    });
  }
});

server.listen(port, () => {
  console.log("");
  console.log("Редакторът работи.");
  console.log(`Отвори: http://localhost:${port}`);
  console.log(geminiApiKey ? "AI режим: Gemini включен" : "AI режим: демо, липсва GEMINI_API_KEY");
  console.log("");
});

async function correctWithGemini(text, mode) {
  const wantsChanges = mode === "changes";
  const systemPrompt = wantsChanges
    ? `Ти си професионален редактор на български език.

Поправи правопис, граматика, пунктуация, съгласуване, главни и малки букви, неправилни окончания, повторения и неправилно използвани думи.
Запази оригиналния смисъл и стила на автора. Не добавяй нова информация и не съкращавай текста.
Върни JSON с оригиналния текст, напълно коригирания текст и конкретен списък с промените.`
    : `Ти си професионален редактор на български език.

Поправи всички правописни и граматически грешки. Добави липсващите препинателни знаци и премахни излишните. Запази оригиналния смисъл и стила на автора, освен ако промяна е необходима за правилен български език. Не добавяй нова информация и не съкращавай текста.
Върни JSON с оригиналния текст, напълно коригирания текст и кратък списък с основните промени.`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": geminiApiKey,
    },
    body: JSON.stringify({
      model,
      input: `${systemPrompt}\n\nПоправи следния текст:\n\n${text}`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: correctionSchema,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(buildGeminiErrorMessage(response.status, payload));
  }

  const content = extractGeminiText(payload);
  const parsed = JSON.parse(content);
  parsed.original = text;
  return parsed;
}

function buildGeminiErrorMessage(status, payload) {
  const apiMessage = payload.error?.message || payload.message || "";
  const apiStatus = payload.error?.status || "";
  const details = [apiStatus, apiMessage].filter(Boolean).join(": ");

  if (details) {
    return `Gemini грешка ${status}: ${details}`;
  }

  return `Gemini заявката не беше успешна. HTTP статус: ${status}.`;
}

function extractGeminiText(payload) {
  if (payload.output_text) return payload.output_text;
  if (typeof payload.text === "string") return payload.text;

  for (const output of payload.output || []) {
    if (typeof output === "string") return output;
    if (output.text) return output.text;
  }

  throw new Error("Няма върнат коригиран текст.");
}

function createLocalDemoCorrection(text) {
  const replacements = [
    [/\bсам\b/gi, "съм", "Правопис"],
    [/\bнежа\b/gi, "неща", "Правопис"],
    [/\bприпинателни\b/gi, "препинателни", "Правопис"],
    [/\bпо късно\b/gi, "по-късно", "Правопис"],
    [/\bздравей\b/g, "Здравей", "Главни и малки букви"],
  ];

  let corrected = text.replace(/\s+/g, " ").trim();
  const changes = [];

  for (const [pattern, replacement, reason] of replacements) {
    corrected = corrected.replace(pattern, (match) => {
      if (match !== replacement) {
        changes.push({ from: match, to: replacement, reason });
      }
      return replacement;
    });
  }

  corrected = addBasicPunctuation(corrected, changes);

  return {
    original: text,
    corrected,
    changes,
  };
}

function addBasicPunctuation(text, changes) {
  let corrected = text;

  corrected = corrected.replace(/\bно\b/g, (match, offset, fullText) => {
    const before = fullText.slice(Math.max(0, offset - 2), offset);
    if (before.includes(",")) return match;
    changes.push({ from: "но", to: ", но", reason: "Пунктуация" });
    return ", но";
  });

  corrected = corrected.replace(/\bче\b/g, (match, offset, fullText) => {
    const before = fullText.slice(Math.max(0, offset - 2), offset);
    if (before.includes(",")) return match;
    changes.push({ from: "че", to: ", че", reason: "Пунктуация" });
    return ", че";
  });

  if (corrected && !/[.!?]$/.test(corrected)) {
    changes.push({ from: corrected, to: `${corrected}.`, reason: "Пунктуация" });
    corrected += ".";
  }

  return corrected;
}

function serveStatic(requestPath, res) {
  const safePath = requestPath === "/" ? "/index.html" : decodeURIComponent(requestPath);
  const filePath = path.normalize(path.join(publicDir, safePath));

  if (!filePath.startsWith(publicDir)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }

    res.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 250_000) {
        reject(new Error("Текстът е твърде дълъг за тази локална версия."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Невалидни данни."));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
  res.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  res.end(text);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

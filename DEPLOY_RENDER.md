# Качване онлайн чрез Render

GitHub Pages не е подходящ за това приложение, защото Gemini API ключът трябва да остане скрит на сървъра.

## Стъпки

1. Вземи Gemini API ключ от Google AI Studio:

```text
https://aistudio.google.com/app/apikey
```

2. Качи проекта в GitHub.
3. Отвори:

```text
https://render.com/
```

4. Избери `New` -> `Web Service`.
5. Свържи GitHub repository-то `bg-text-corrector`.
6. Настройки:

```text
Runtime: Node
Build command: npm install
Start command: npm start
```

7. В `Environment` добави:

```text
GEMINI_API_KEY=твоя_ключ_от_Google_AI_Studio
GEMINI_MODEL=gemini-3.5-flash
```

8. Натисни `Deploy`.

След няколко минути Render ще даде публичен линк към приложението.

Ако преди това си добавял `OPENAI_API_KEY` или `OPENAI_MODEL`, можеш да ги изтриеш от Render. Те вече не се използват.

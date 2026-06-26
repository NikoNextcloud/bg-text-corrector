# Качване онлайн чрез Render

GitHub Pages не е подходящ за това приложение, защото AI API ключът трябва да остане скрит на сървъра.

## Стъпки

1. Създай Groq API ключ:

```text
https://console.groq.com/keys
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
GROQ_API_KEY=твоя_groq_ключ
GROQ_MODEL=llama-3.3-70b-versatile
```

8. Изтрий стари Gemini/OpenAI променливи, ако ги има:

```text
GEMINI_API_KEY
GEMINI_MODEL
OPENAI_API_KEY
OPENAI_MODEL
```

9. Натисни `Deploy`.

След няколко минути Render ще даде публичен линк към приложението.

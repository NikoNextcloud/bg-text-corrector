# Качване онлайн чрез Render

GitHub Pages не е подходящ за това приложение, защото OpenAI API ключът трябва да остане скрит на сървъра.

## Стъпки

1. Качи проекта в GitHub.
2. Отвори:

```text
https://render.com/
```

3. Избери `New` -> `Web Service`.
4. Свържи GitHub repository-то `bg-text-corrector`.
5. Настройки:

```text
Runtime: Node
Build command: npm install
Start command: npm start
```

6. В `Environment` добави:

```text
OPENAI_API_KEY=твоя_ключ
OPENAI_MODEL=gpt-5.2
```

7. Натисни `Deploy`.

След няколко минути Render ще даде публичен линк към приложението.

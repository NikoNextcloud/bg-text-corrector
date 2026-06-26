# Настройване на Groq

Groq е алтернатива на Gemini за това приложение. Използва се с `GROQ_API_KEY`.

## 1. Създай Groq акаунт

Отвори:

```text
https://console.groq.com/
```

Влез с акаунт.

## 2. Създай API ключ

Отвори:

```text
https://console.groq.com/keys
```

Натисни `Create API Key` и копирай ключа.

## 3. Render настройки

В Render отвори:

```text
твоят проект -> Environment
```

Добави:

```text
GROQ_API_KEY=твоя_groq_ключ
GROQ_MODEL=llama-3.3-70b-versatile
```

Изтрий старите Gemini настройки, ако ги има:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

## 4. Deploy

След промяна натисни:

```text
Manual Deploy -> Clear build cache & deploy
```

## 5. Ако моделът не работи

Смени `GROQ_MODEL` на:

```text
llama-3.1-8b-instant
```

Той е по-малък, но често е достъпен и бърз.

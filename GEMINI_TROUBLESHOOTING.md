# Gemini грешки

Ако приложението показва грешка от Gemini, провери тези неща.

## 1. Смени API ключа

Ако си показал ключа в снимка, чат, видео или публично място, изтрий го и създай нов.

Отвори:

```text
https://aistudio.google.com/app/apikey
```

Натисни `Delete key` за стария ключ и създай нов.

## 2. Render Environment Variables

В Render отвори:

```text
твоят проект -> Environment
```

Трябва да има:

```text
GEMINI_API_KEY=твоя_нов_ключ
GEMINI_MODEL=gemini-3.5-flash
```

Не трябва да има нужда от:

```text
OPENAI_API_KEY
OPENAI_MODEL
```

## 3. Deploy след промяна

След като смениш ключа или качиш нов код:

```text
Manual Deploy -> Deploy latest commit
```

## 4. Чести съобщения

### API key not valid

Ключът е грешно копиран, изтрит, ограничен или не е сложен правилно в Render.

### Permission denied

Провери дали ключът е от Google AI Studio и дали Gemini API е позволен за проекта.

### Quota exceeded

Безплатният лимит е изчерпан. Изчакай лимитът да се възстанови или ползвай друг проект/ключ.

### Model not found

Смени `GEMINI_MODEL` на:

```text
gemini-3.5-flash
```

## 5. Проверка на Render logs

В Render отвори:

```text
Logs
```

След новата версия приложението показва по-точна Gemini грешка, например:

```text
Gemini грешка 400: ...
Gemini грешка 403: ...
Gemini грешка 429: ...
```

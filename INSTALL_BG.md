# Подробно ръководство

Това приложение коригира български текст с AI. Има два режима:

- `Коригирай` - връща готовия поправен текст.
- `Покажи поправките` - връща поправения текст и списък какво е променено.

## Защо може да не тръгва

Най-честите причини са:

1. Няма инсталиран Node.js.
2. Стартираш грешна папка.
3. Няма Gemini API ключ.
4. Портът `8787` е зает от друга програма.

Без API ключ приложението пак трябва да се отвори, но работи в демо режим.

## Инсталиране на Node.js

1. Отвори:

```text
https://nodejs.org/
```

2. Изтегли LTS версията.
3. Инсталирай я с настройките по подразбиране.
4. Затвори и отвори отново папката/терминала.

Проверка:

```powershell
node -v
```

Ако видиш версия, например `v22.x.x`, всичко е наред.

## Настройване на Gemini ключ

1. Отвори:

```text
https://aistudio.google.com/app/apikey
```

2. Влез с Google акаунт.
3. Създай API ключ.
4. Копирай файла `.env.example`.
5. Преименувай копието на `.env`.
6. Вътре замени:

```text
GEMINI_API_KEY=сложи_твоя_gemini_api_ключ_тук
```

с твоя реален ключ:

```text
GEMINI_API_KEY=...
```

Важно: `.env` не се качва в GitHub, защото съдържа таен ключ.

## Стартиране на Windows

Най-лесно:

1. Отвори папката `bg-text-corrector`.
2. Натисни два пъти:

```text
Стартирай редактора.bat
```

3. Браузърът ще отвори:

```text
http://localhost:8787
```

Ако не се отвори автоматично, копирай адреса ръчно в браузъра.

## Стартиране през PowerShell

```powershell
cd C:\Users\User\Documents\IPTV\bg-text-corrector
node server.js
```

След това отвори:

```text
http://localhost:8787
```

## Качване в GitHub

Първо направи repository в GitHub с име:

```text
bg-text-corrector
```

После в PowerShell:

```powershell
cd C:\Users\User\Documents\IPTV\bg-text-corrector
git init
git add .
git commit -m "Initial Bulgarian text corrector app"
git branch -M main
git remote add origin https://github.com/ТВОЕТО-ИМЕ/bg-text-corrector.git
git push -u origin main
```

Смени `ТВОЕТО-ИМЕ` с твоя GitHub потребител.

## Важно за GitHub Pages

Това приложение не трябва да се качва като чист GitHub Pages сайт, ако ще ползва Gemini API ключ.

Причината: GitHub Pages е само статичен сайт. Ако сложиш API ключа в браузъра, той ще стане видим за всеки.

Правилният вариант е:

- кодът да стои в GitHub;
- приложението да се стартира локално на твоя компютър; или
- да се качи в услуга със server environment variables, например Render, Railway или VPS.

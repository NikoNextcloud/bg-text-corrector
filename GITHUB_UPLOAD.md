# Качване в GitHub

## Вариант 1: през сайта на GitHub

1. Отвори:

```text
https://github.com/new
```

2. Repository name:

```text
bg-text-corrector
```

3. Избери `Public` или `Private`.
4. Не добавяй README от GitHub, защото този проект вече има README.
5. Натисни `Create repository`.
6. Натисни `uploading an existing file`.
7. Качи файловете от папката `bg-text-corrector`.

Важно: не качвай `.env`.

## Вариант 2: с команди

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

## Какво трябва да се качи

Качи тези файлове и папки:

```text
public/
.env.example
.gitignore
DEPLOY_RENDER.md
GITHUB_UPLOAD.md
INSTALL_BG.md
README.md
package.json
render.yaml
server.js
Стартирай редактора.bat
```

Не качвай:

```text
.env
node_modules/
```

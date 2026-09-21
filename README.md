# grip-pro.ru

Статический сайт на **GitHub Pages**. Домен и почта — **reg.ru**.

| | |
|---|---|
| Сайт | https://grip-pro.ru |
| Репозиторий | https://github.com/taniksem2007-png/Grip |
| Почта | hi@grip-pro.ru |
| DNS | `ns1.reg.ru` / `ns2.reg.ru` |

Подробные клики: [DEPLOY-MANUAL.md](DEPLOY-MANUAL.md).

## DNS сайта

| Тип | Subdomain | Значение |
|-----|-----------|----------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | taniksem2007-png.github.io |

Четыре A `@` — GitHub Pages. Их не удалять при настройке почты.

## Почта

Платный ящик **Почта Рег.ру**: `hi@grip-pro.ru`.

MX рядом с записями GitHub, не переключать DNS на `hosting.reg.ru`. IP почты — только с формы почтового домена, только для записи A `mail`.

Вход в веб-почту: https://roundcube.hosting.reg.ru/

## Как обновить сайт

```powershell
git add .
git commit -m "Update content"
git push
```

Через 1–2 минуты на GitHub Pages.

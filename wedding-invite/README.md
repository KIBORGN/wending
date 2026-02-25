Интерактивный сайт свадебного приглашения с поддержкой многоязычности (RU/RO), локализацией контента через JSON и многодоменным управлением RSVP via Telegram.

## Возможности

- 🌍 Многоязычная поддержка (русский/румынский) с переключателем
- 📋 JSON-конфиг для всего контента сайта
- 📱 Адаптивный дизайн
- 🎨 Элегантный внешний вид с анимациями прокрутки
- 🤖 RSVP форма с отправкой в Telegram
- 🌐 Поддержка нескольких доменов на одном боте

## Быстрый старт (локально)

\`\`\`bash
npm install
npm run dev
\`\`\`

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура конфига

Весь контент и настройки находятся в `src/config/site.json`:
- `settings` — языковые настройки
- `domains` — маппинг доменов на ключи для Telegram
- `couple`, `contacts`, `venue`, `timeline`, `dresscode`, `rsvp` — данные сайта
- `content.ru`, `content.ro` — весь текст на двух языках

Отредактируй этот файл — всё изменится на сайте автоматически.

## ⚙️ Развёртывание на VPS (Nginx + Node.js)

### Шаг 1: Подготовка сервера

\`\`\`bash
ssh user@your-vps-ip

# Установи Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установи PM2
sudo npm install -g pm2

# Создай папку
mkdir -p /root/wending && cd /root/wending
\`\`\`

### Шаг 2: Загрузи проект

\`\`\`bash
# Вариант 1: через SCP (с локальной машины)
scp -r ./wedding-invite root@your-vps-ip:/root/wending/

# Вариант 2: через Git
cd /root/wending
git clone https://github.com/your-repo/wedding-invite.git
cd wedding-invite
\`\`\`

### Шаг 3: Установка и сборка

\`\`\`bash
cd /root/wending/wedding-invite
npm install
npm run build
\`\`\`

### Шаг 4: Запуск через PM2

\`\`\`bash
# Запусти на порту 3001
pm2 start "npm run start -- -p 3001" --name "wedding-invite" --cwd /root/wending/wedding-invite

# Сохрани автозапуск
pm2 save
pm2 startup
\`\`\`

### Шаг 5: Nginx конфиг для `test.uni-rust.com`

\`\`\`bash
sudo nano /etc/nginx/sites-available/test.uni-rust.com
\`\`\`

Вставь:

\`\`\`nginx
server {
    listen 80;
    server_name test.uni-rust.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name test.uni-rust.com;

    ssl_certificate /etc/letsencrypt/live/test.uni-rust.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.uni-rust.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

Включи:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/test.uni-rust.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### Шаг 6: SSL сертификат

\`\`\`bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d test.uni-rust.com
\`\`\`

### Шаг 7: Переменные окружения

\`\`\`bash
nano /root/wending/wedding-invite/.env.local
\`\`\`

Добавь:

\`\`\`dotenv
TELEGRAM_BOT_TOKEN=8539566072:AAEWunLqXY7JB-EHCyJI-YJeS136O45Q1Lc
TELEGRAM_CHAT_ID_DEFAULT=-5201219877
TELEGRAM_CHAT_ID_TEST_UNI_RUST=-123456789
\`\`\`

Найди ID чата отправив /start боту, потом используй:
\`\`\`bash
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
\`\`\`

## ➕ Добавление нового домена (пример: `another.example.com`)

### 1. Обнови конфиг

`src/config/site.json`:
\`\`\`json
"domains": {
  "localhost": "DEFAULT",
  "test.uni-rust.com": "TEST_UNI_RUST",
  "another.example.com": "ANOTHER_EXAMPLE"
}
\`\`\`

### 2. Добавь переменную

`.env.local`:
\`\`\`dotenv
TELEGRAM_CHAT_ID_ANOTHER_EXAMPLE=-987654321
\`\`\`

### 3. Nginx конфиг

\`\`\`bash
sudo nano /etc/nginx/sites-available/another.example.com
\`\`\`

\`\`\`nginx
server {
    listen 80;
    server_name another.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name another.example.com;

    ssl_certificate /etc/letsencrypt/live/another.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/another.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

### 4. Включи

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/another.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot certonly --nginx -d another.example.com
\`\`\`

### 5. Рестарт

\`\`\`bash
pm2 restart wedding-invite
\`\`\`

✅ Готово! Оба домена используют одно приложение с одним ботом, но отправляют RSVP в разные чаты.

## 🛠 Команды

\`\`\`bash
pm2 status              # Статус
pm2 logs wedding-invite # Логи
pm2 restart wedding-invite
pm2 stop wedding-invite
pm2 monit              # Мониторинг в реальном времени
\`\`\`

## 📁 Структура проекта

\`\`\`
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx           # Главная страница (с LanguageProvider)
│   └── api/rsvp/route.ts  # API для RSVP (отправляет в Telegram)
├── components/            # Hero, Message, RSVP, Contacts, etc.
├── context/
│   └── LanguageContext.tsx
├── config/
│   └── site.json          # Конфиг (контент + домены)
└── globals.css
\`\`\`

## 🔗 Как работает многодоменность

1. Запрос приходит на `test.uni-rust.com`
2. Nginx проксирует на `127.0.0.1:3001`
3. API маршрут читает заголовок `Host`
4. Ищет домен в `site.json` → поле `domains`
5. Получает ключ (например, `TEST_UNI_RUST`)
6. Ищет переменную окружения `TELEGRAM_CHAT_ID_TEST_UNI_RUST`
7. Отправляет RSVP в соответствующий Telegram чат ✅

## ❓ Troubleshooting

**PM2 не запускается**
\`\`\`bash
pm2 kill
pm2 start "npm run start -- -p 3001" --name "wedding-invite" --cwd /root/wending/wedding-invite
\`\`\`

**Nginx ошибка**
\`\`\`bash
sudo nginx -t
sudo systemctl status nginx
\`\`\`

**Нет сертификата**
\`\`\`bash
sudo certbot certonly --nginx -d test.uni-rust.com
\`\`\`

**Приложение медленное/логи**
\`\`\`bash
pm2 logs wedding-invite --lines 100
\`\`\`

## 📚 Полезно

- [Next.js Documentation](https://nextjs.org/docs)
- [Nginx Proxy](https://nginx.org/en/docs/)
- [PM2 управление процессами](https://pm2.keymetrics.io/)
- [Let's Encrypt SSL](https://letsencrypt.org/)
EOF
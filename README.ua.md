
# Weather Subscription API 🌤

API-сервіс для підписки на прогноз погоди у вибраному місті з підтримкою підтвердження по email та автоматичною розсилкою.

---

## 🛠 Стек технологій

- **NestJS** — головний фреймворк для реалізації логіки
- **PostgreSQL** — зберігання підписок
- **TypeORM** — робота з БД + міграції
- **Docker + Docker Compose** — для локального запуску
- **Mailtrap** — симуляція email-відправлення
- **Swagger (OpenAPI)** — для тестування API
- **CRON + @nestjs/schedule** — періодична розсилка
- **Unit-тести** — для сервісної логіки

---

## 📦 Встановлення і запуск

### 1. Клонувати репозиторій

```bash
git clone ...
cd weather-subscription-api
```

### 2. Налаштування `.env`

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=weather

WEATHER_API_KEY=your_weather_api_key
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
BASE_URL=http://localhost:3000
```

### 3. Запуск через Docker

```bash
docker-compose up --build
```

БД автоматично створиться, запустяться міграції.

---

## 🚀 Основні можливості API

### 🔹 Підписка

- POST `/api/subscription` — створення підписки
- Токен надсилається листом на email
- GET `/api/subscription/confirm/:token` — підтвердження підписки

### 🔹 Розсилка

- `CRON`-задача працює щогодини
- Надсилає лист лише якщо:
  - `frequency: hourly` → минуло ≥ 60 хв
  - `frequency: daily` → минуло ≥ 24 год
- В листі — актуальна погода по місту

---

## 🧠 Логіка реалізації

1. Користувач реєструє підписку (місто, email, частота)
2. Генерується токен підтвердження
3. Лист з посиланням приходить через Mailtrap
4. Після підтвердження:
   - запис оновлюється (`confirmed: true`)
   - підписка потрапляє у чергу розсилки
5. CRON-розсилка перевіряє `lastSentAt` і frequency
6. Якщо пора — отримує погоду через Weather API і надсилає email

---

## 🧪 Тестування

- `SubscriptionService` — логіка підписки, підтвердження, відписки
- `WeatherService` — мок зовнішнього API
- `TasksService` — розсилка з частотою та обробкою помилок
- Команда:

```bash
npm run test
```

---

## 📚 Swagger документація

> Автоматично доступна на:

```
http://localhost:3000/api/docs
```

---

## 🗂 Структура проекту

```
src/
├── subscription/       # Підписка, CRUD, логіка
├── weather/            # Отримання погоди
├── mail/               # Надсилання листів
├── tasks/              # CRON-задачі
├── app.module.ts       # Підключення модулів
```

---

## 📝 Додатково

- Підтримка `@nestjs/config` — вся конфігурація в .env
- Логування всіх етапів розсилки
- Кастомні повідомлення в `TasksService` — виводиться причина, чому лист не був надісланий

---

## ❗ Відомі обмеження / TODO

- Валідація email/міста може бути розширена
- Відправка листа на реальну пошту не реалізована (Mailtrap)
- Відсутня html-сторінка для підписки (extra)

---
## Можливі покращення
1. Підписка на кілька міст для одного користувача
   Розширити модель даних, щоб користувач міг підписатися на оновлення погоди в кількох містах. Для цього потрібно додати сутність User і звʼязок один-до-багатьох з Subscription

2. Двофакторна автентифікація (2FA)
   Додати підтримку 2FA для підвищення безпеки. Під час підтвердження або входу (якщо буде реалізовано облікові записи) користувач повинен буде ввести код із листа.

3. Локація за координатами
   Allow users to subscribe by providing GPS coordinates (latitude and longitude), not only city names. This would improve accuracy and support less-populated areas or specific locations.
---

## 👨‍💻 Автор

Розроблено як частина тестового завдання.

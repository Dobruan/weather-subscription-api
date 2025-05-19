
# Weather Subscription API 🌤

An API service that allows users to subscribe to weather forecasts in a chosen city, with confirmation via email and automatic periodic delivery.

---

## 🛠 Technology Stack

- **NestJS** — main backend framework
- **PostgreSQL** — data storage for subscriptions
- **TypeORM** — database interaction & migrations
- **Docker + Docker Compose** — containerized environment
- **Mailtrap** — fake email delivery service
- **Swagger (OpenAPI)** — API documentation and testing
- **CRON + @nestjs/schedule** — periodic weather updates
- **Unit testing** — logic-level test coverage

---

## 📦 Installation & Running

### 1. Clone the repository

```bash
git clone ...
cd weather-subscription-api
```

### 2. Configure `.env`

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=weather
PORT=3000
WEATHER_API_KEY=your_weather_api_key
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
BASE_URL=http://localhost:3000
```

### 3. Run via Docker

```bash
docker-compose up --build
```

Database and migrations will be initialized automatically.

---

## 🚀 Main Features

### 🔹 Subscription

- POST `/api/subscription` — create a new subscription
- Token is sent via email
- GET `/api/subscription/confirm/:token` — confirm the subscription

### 🔹 Email Delivery

- `CRON` job runs every hour
- Sends weather only if:
  - `frequency: hourly` → at least 60 minutes passed
  - `frequency: daily` → at least 24 hours passed
- Email contains actual weather info for the selected city

---

## 🧠 Logic Overview

1. User submits a subscription (city, email, frequency)
2. A confirmation token is generated
3. Confirmation link is sent via Mailtrap
4. Once confirmed:
   - subscription is marked as `confirmed: true`
   - included in CRON mailing list
5. CRON checks `lastSentAt` & `frequency`
6. If time has passed — weather is fetched and email is sent

---

## 🧪 Testing

- `SubscriptionService` — create, confirm, unsubscribe
- `WeatherService` — mock integration with external API
- `TasksService` — mailing logic with frequency filters and error handling
- Run tests:

```bash
npm run test
```

---

## 📚 Swagger API

Available at:

```
http://localhost:3000/api/docs
```

---

## 🗂 Project Structure

```
src/
├── subscription/       # Subscription logic
├── weather/            # Weather service
├── mail/               # Email delivery
├── tasks/              # CRON jobs
├── app.module.ts       # App configuration
```

---

## 📝 Extras

- Uses `@nestjs/config` for centralized config
- Logs all CRON actions with reason if skipped
- Each weather email is recorded with `lastSentAt`

---

## ❗ Known Limitations / TODO

- City/email validation could be improved
- Real email delivery is not implemented (Mailtrap only)
- No frontend HTML subscription form (extra requirement)

---

## Possible Improvements
 1. **User-specific Delivery Time**  
    Allow users to choose a preferred hour for receiving daily updates (e.g. 8:00 AM). Currently, delivery is tied to a global CRON schedule. This would require implementing per-user scheduling or a more dynamic job queue.
 2. **Location by Coordinates**   
    Allow users to subscribe by providing GPS coordinates (latitude and longitude), not only city names. This would improve accuracy and support less-populated areas or specific locations.
 3. ***Multi-city Subscriptions per User***  
Extend the data model to support users subscribing to weather updates for multiple cities. This would require a separate User entity and a one-to-many relation with Subscription.
 4. **Two-Factor Authentication (2FA)**
Introduce 2FA for additional security. During confirmation or account login (if user accounts are added), users would be required to enter a verification code sent to their email.




---

## 👨‍💻 Author

Developed as part of a technical assignment for **GENESIS Software Engineering School 5.0**.

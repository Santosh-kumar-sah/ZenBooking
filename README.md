# SalonBook

SalonBook is a MERN-based appointment booking platform with AI-assisted booking, owner dashboards, and a public customer booking experience.

## What This App Does

- Owners register, log in, and manage their booking dashboard.
- Customers do not register.
- Customers visit a public booking page, choose a slot, and submit their name plus either phone number or email.
- The backend creates the booking, generates reminders, and sends confirmation notifications.
- AI helps parse natural-language booking requests and can create bookings automatically.

## Project Structure

- `backend/` - Express API, MongoDB models, AI services, booking services, and notification logic.
- `frontend/` - Vite + React app for public booking and owner dashboard UI.

## Key Flows

### Owner flow

1. Register and log in.
2. Access `/dashboard`.
3. Manage slots, bookings, and insights.
4. Copy the public booking link for customers.

### Customer flow

1. Open the public booking link `/:ownerId`.
2. Pick a date and slot.
3. Enter name and either phone number or email.
4. Receive booking confirmation.

### AI booking flow

1. Customer types a natural-language request.
2. AI extracts booking intent and details.
3. Backend creates the booking if a slot is available.
4. Confirmation notifications are sent.

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### `backend/.env`

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173

# Optional SMS config
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_FROM=+1234567890

# Set to 1 to skip real notifications during local testing
NOTIFY_TEST_MODE=0
EMAIL_RETRY_ATTEMPTS=3
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8000/api
```

## Useful Scripts

### Backend

- `npm run dev` - start the API with nodemon
- `npm start` - start the API in production mode
- `node scripts/smokeNotifyTest.js` - run notification smoke test in test mode
- `node scripts/integrationTest.js` - run AI booking integration test

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build

## Notes

- Owner-only screens are protected behind authentication.
- Public booking pages are available without customer registration.
- SMS is optional and only works when Twilio credentials are configured.
- Logs rotate in production through Winston Daily Rotate File.

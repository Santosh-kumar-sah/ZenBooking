# ZenBooking

**AI-Powered Appointment Booking Platform for Salons & Service Businesses**

ZenBooking is a modern MERN-based appointment booking platform that combines AI-assisted booking, intuitive owner dashboards, and a seamless public customer experience. Let AI handle your bookings while you focus on your business.

## 🚀 Live Demo

- **Frontend**: [https://v-booking-nine.vercel.app/](https://v-booking-nine.vercel.app/)
- **Backend API**: [https://vbooking.onrender.com/](https://vbooking.onrender.com/)

## ✨ Key Features

- **AI Booking Assistant** - Customers book in seconds using natural language
- **Smart Slot Management** - Auto-manages schedules and blocks unavailable times
- **Owner Dashboard** - Real-time booking management and analytics
- **Customer Notifications** - Automated email confirmations and reminders
- **AI Insights** - Understand booking patterns and peak hours
- **Public Booking Page** - No registration required for customers
- **Mobile Responsive** - Works beautifully on all devices
- **Zero Setup** - Go live in minutes

## 📋 What This App Does

- **Owners** register, log in, and manage their booking dashboard
- **Customers** don't register - they visit the public booking page and book in seconds
- **Customers** pick a date/slot and enter their name + phone/email
- **Backend** creates bookings, generates reminders, and sends confirmations
- **AI** parses natural-language booking requests and auto-creates bookings when slots are available

## 📁 Project Structure

- `backend/` - Express API, MongoDB models, AI services (Groq), booking and notification logic
- `frontend/` - Vite + React app with owner dashboard and public booking UI

## 🎯 User Flows

### Owner Flow
1. Register and create account
2. Access `/dashboard`
3. Manage slots, view bookings, and track insights
4. Copy public booking link to share with customers via Instagram, WhatsApp, etc.

### Customer Flow
1. Open shared public booking link (`/:ownerId`)
2. Browse available dates and time slots
3. Enter name and contact (phone/email)
4. Receive instant booking confirmation via email

### AI Booking Flow
1. Customer types natural-language request in chat
2. AI extracts booking intent and details
3. Backend validates slot availability
4. Booking is created automatically
5. Confirmation notifications sent to both parties

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (Access + Refresh tokens)
- **AI**: Groq API (LLaMA models)
- **Email**: Nodemailer
- **SMS**: Twilio (optional)
- **Jobs**: Node Cron
- **Deployment**: Render

## 📸 Screenshots

### Landing Page
<img width="1919" height="868" alt="Screenshot 2026-05-09 145020" src="https://github.com/user-attachments/assets/acde1f0b-cc8a-4080-91b2-10ae1cdac918" />


### Owner Dashboard

![Uploading Screenshot 2026-05-09 145020.png…]()
<img width="1919" height="868" alt="Screenshot 2026-05-09 145029" src="https://github.com/user-attachments/assets/5f06be36-22b7-4b41-a65e-9148d455c48a" />



### Bookings Management
### Owner Dashboard
<img width="1919" height="868" alt="Screenshot 2026-05-09 145020" src="https://github.com/user-attachments/assets/aa938538-7532-40e5-9be7-54493058915a" />


### Public Booking Page
<img width="1919" height="880" alt="Screenshot 2026-05-09 145302" src="https://github.com/user-attachments/assets/bdb02efa-e3dc-4c90-a2ae-cb377b262d78" />

### AI Chat Widget
![Uploading Screenshot 2026-05-09 145029.png…]()
<img width="498" height="635" alt="Screenshot 2026-05-09 145141" src="https://github.com/user-attachments/assets/d1c1da92-ccb3-4e56-b04a-5892f8810968" />

## ⚙️ Setup & Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

**Environment Variables** (`.env`):

```env
# Server Configuration
PORT=8000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Configuration
GROQ_API_KEY=your_groq_api_key

# Frontend URLs (CORS)
FRONTEND_URLS=http://localhost:5173,https://v-booking-nine.vercel.app

# Optional SMS Configuration
# TWILIO_SID=your_twilio_sid
# TWILIO_TOKEN=your_twilio_token
# TWILIO_FROM=+1234567890

# Testing & Notifications
NOTIFY_TEST_MODE=0
EMAIL_RETRY_ATTEMPTS=3
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**Environment Variables** (`.env`):

```env
# Production API URL
VITE_API_URL=https://vbooking.onrender.com/api

# Development API URL (uncomment for local testing)
# VITE_API_URL=http://localhost:8000/api
```

## 🔧 Deployment Guide

### Deploy Backend to Render

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com/)
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com/)
3. Add environment variables
4. Deploy

**Note**: After deployment, update `FRONTEND_URLS` in backend to include your Vercel URL.

## 📚 Useful Scripts

### Backend

```bash
npm run dev                          # Start with nodemon (development)
npm start                           # Start production server
node scripts/smokeNotifyTest.js     # Test notification system
node scripts/integrationTest.js     # Test AI booking flow
```

### Frontend

```bash
npm run dev                         # Start Vite dev server
npm run build                       # Create production build
npm run preview                     # Preview production build
```

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** with bcrypt
- **CORS** protection with configurable origins
- **Environment Variables** for sensitive data
- **Input Validation** on all endpoints
- **Error Handling** without exposing stack traces

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Santosh Kumar Sah**
- LinkedIn: [santosh-kumar-sah-45a9b6328](https://www.linkedin.com/in/santosh-kumar-sah-45a9b6328/)
- GitHub: [SureshSirf](https://github.com/SureshSirf)

## 📞 Support

For issues and questions, please create an issue on the [GitHub repository](https://github.com/SureshSirf/SalonBook)

## 🚀 Roadmap

- [ ] Multi-language support
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Video call consultations
- [ ] Advanced analytics and reporting
- [ ] Mobile apps (iOS/Android)
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Staff/Employee management
- [ ] Service categories and pricing

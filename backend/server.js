import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { startReminderJob } from './jobs/reminderCron.js';
import authRoutes from './routes/auth.routes.js';
import slotRoutes from './routes/slot.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import publicRoutes from './routes/public.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS: Allow specified frontend URLs
const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:5173').split(',').map(url => url.trim());
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// Connect DB
await connectDB();

// Root route - API status
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ZenBooking API is running',
    status: 'operational',
    version: '1.0.0'
  });
});

// Routers

app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/ai', aiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Server Error' });
});

// Start cron job
startReminderJob();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


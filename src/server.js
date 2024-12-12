require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const NotificationService = require('./services/notificationService');
const { authenticateUser } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const dailyTipsRoutes = require('./routes/dailyTipsRoutes');

const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.use('/api/moods', authenticateUser, moodRoutes);
app.use('/api/analytics', authenticateUser, analyticsRoutes);
app.use('/api/notifications', authenticateUser, notificationRoutes);
app.use('/api/users', authenticateUser, userRoutes);
app.use('/api/account', authenticateUser, accountRoutes);
app.use('/api/daily-tips', authenticateUser, dailyTipsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

NotificationService.scheduleReminders();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pool = require('./config/db'); // MySQL pool

// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const groupRoutes = require('./routes/groupRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
// app.get('/health', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT 1');
//     res.status(200).json({ status: 'ok', database: 'connected' });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       database: 'disconnected',
//       error: error.message
//     });
//   }
// });

app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('MySQL connection error:', error); // Full error object
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message || JSON.stringify(error) || 'Unknown error'
    });
  }
});



app.get('/api/check', (req, res) => {
  res.json({ message: 'working' });
});

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/chats', chatRoutes);
// app.use('/admin', adminRoutes);
// app.use('/api/notification', notificationRoutes);
// app.use('/api/groups', groupRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

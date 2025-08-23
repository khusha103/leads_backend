const express = require('express');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const fileRoutes = require('./routes/fileRoutes');
const optionsRoutes = require('./routes/optionsRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Use routes
app.use('/api', authRoutes);
app.use('/api', fileRoutes);
app.use('/api', optionsRoutes);
app.use('/webhook', leadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
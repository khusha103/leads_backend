const express = require('express');
const db = require('./config/db'); // Adjust path as needed

const app = express();
app.use(express.json());

// API to fetch users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ekarigar_users');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

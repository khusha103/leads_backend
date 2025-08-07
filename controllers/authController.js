const UserModel = require('../models/userModel');

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username/Email and password are required' });
      }

      const user = await UserModel.findUserByEmailOrUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username/email or password' });
      }

      // Plain password comparison (INSECURE, for testing only)
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid username/email or password' });
      }

      res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
      console.error('Error during login:', err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
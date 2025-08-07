const UserModel = require('../models/userModel');


const authController = {
  async getUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

 
};

module.exports = authController;
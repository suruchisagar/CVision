const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true , "username already taken"],
  },
  email: {
    type: String,
    required: true,
    unique: [true , "email already exist with this email"],
  },
  password: {
    type: String,
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
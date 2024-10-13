const mongoose = require('mongoose');

const userEmail = new mongoose.Schema({
 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
 
});

const UserEmailData = mongoose.model('UserEmailData', userEmail);

module.exports = UserEmailData;

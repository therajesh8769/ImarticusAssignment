//auth features not implemented yet in the frontend

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
name: String,
email: { type: String, required: true, unique: true },
passwordHash: String,
role: { type: String, enum: ['admin','student'], default: 'student' }
});
module.exports = mongoose.model('User', UserSchema);
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// register
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email exists' });
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
const user = await User.create({ name, email, passwordHash });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
res.json({ token, user: { id: user._id, name, email } });
} catch(e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});


// login
router.post('/login', async (req, res) => {
try {
    console.log("Login request body:", req.body); 
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch(e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});


module.exports = router;
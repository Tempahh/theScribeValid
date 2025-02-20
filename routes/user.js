const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidationMiddleware = require('../validators/userValidator');
const sendEmail = require('../utils/emailServer');

const router = express.Router();

router.post('/register', userValidationMiddleware, async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validate role (optional)
        const validRoles = ['admin', 'student', 'instructor'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Create user and save
        const user = new User({ username, password: hashedPassword, email, role });
        await user.save();

        await sendEmail({
            to: email,
            subject: 'Welcome to our platform',
            text: `Hello ${username}, welcome to our platform!`
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

const crypto = require("crypto");
const User = require("../models/User");

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1-hour expiration
        await user.save();

        // Send reset email
        const resetLink = `https://${resetToken}`;
        await sendEmail(email, "Password Reset Request", `Click the link to reset your password: ${resetLink}`);

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        // Send confirmation email
        await sendEmail(user.email, "Password Changed", "Your password has been successfully changed.");

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
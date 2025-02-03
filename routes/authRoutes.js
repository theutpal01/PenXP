const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
const User = require("../models/User");

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ✅ Register User (Now Includes First & Last Name)
 */
router.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, username, email, password, isOAuthUser } =
			req.body;

		if (
			!firstName ||
			!lastName ||
			!username ||
			!email ||
			(!isOAuthUser && !password)
		) {
			return res
				.status(400)
				.json({
					error:
						"First name, last name, username, email, and password (if not OAuth) are required.",
				});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ error: "Invalid email format." });
		}

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ error: "Username or email already exists." });
		}

		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			isOAuthUser,
			password: isOAuthUser ? undefined : await bcrypt.hash(password, 10),
			profileCompleted: false, // User still needs to complete optional details
		});

		await newUser.save();
		res
			.status(201)
			.json({
				message: "User registered. You can now complete your profile.",
				userId: newUser._id,
			});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * ✅ Complete Optional Profile
 */
router.post("/complete-profile", async (req, res) => {
	try {
		const { userId, bio, website, socialLinks } = req.body;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found." });
		if (user.profileCompleted)
			return res.status(400).json({ error: "Profile is already completed." });

		user.bio = bio;
		user.website = website;
		user.socialLinks = socialLinks;
		user.profileCompleted = true;

		await user.save();
		res.json({ message: "Profile completed successfully.", user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * ✅ User Login & Token Generation
 */
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ error: "Email and password are required." });
		}

		const user = await User.findOne({ email });
		if (!user || user.isOAuthUser) {
			return res
				.status(400)
				.json({ error: "Invalid credentials or use OAuth login." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ error: "Invalid credentials." });

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1d",
		});

		res.json({
			token,
			user: {
				username: user.username,
				email: user.email,
				profileCompleted: user.profileCompleted,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * ✅ OAuth Login (Google)
 */
router.post("/oauth-login", async (req, res) => {
	try {
		const { email, username, firstName, lastName } = req.body;
		if (!email || !username || !firstName || !lastName) {
			return res
				.status(400)
				.json({
					error:
						"Email, username, first name, and last name are required for OAuth login.",
				});
		}

		let user = await User.findOne({ email });

		if (!user) {
			user = new User({
				email,
				username,
				firstName,
				lastName,
				isOAuthUser: true,
				profileCompleted: false,
			});
			await user.save();
		}

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1d",
		});
		res.json({
			token,
			user: {
				username: user.username,
				email: user.email,
				profileCompleted: user.profileCompleted,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

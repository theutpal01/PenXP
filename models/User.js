const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		unique: true,
		trim: true,
		minlength: [3, "Username must be at least 3 characters"],
		maxlength: [20, "Username cannot exceed 20 characters"],
		match: [
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers, and underscores",
		],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		lowercase: true,
		validate: [validator.isEmail, "Enter a valid email address"],
	},
	password: {
		type: String,
		required: function () {
			return !this.isOAuthUser;
		},
		minlength: [8, "Password must be at least 8 characters long"],
	},
	isOAuthUser: { type: Boolean, default: false }, // Marks if user registered via OAuth

	// Profile Details
	firstName: {
		type: String,
		required: [true, "First name is required"],
		trim: true,
		minlength: [2, "First name must be at least 2 characters"],
		maxlength: [30, "First name cannot exceed 30 characters"],
		match: [/^[a-zA-Z]+$/, "First name can only contain alphabets"],
	},
	lastName: {
		type: String,
		required: [true, "Last name is required"],
		trim: true,
		minlength: [2, "Last name must be at least 2 characters"],
		maxlength: [30, "Last name cannot exceed 30 characters"],
		match: [/^[a-zA-Z]+$/, "Last name can only contain alphabets"],
	},
	profilePicture: { type: String, default: "default-avatar.png" },
	bio: { type: String, maxlength: [250, "Bio cannot exceed 250 characters"] },
	website: {
		type: String,
		validate: {
			validator: function (url) {
				return url === "" || validator.isURL(url);
			},
			message: "Invalid website URL",
		},
	},
	socialLinks: {
		twitter: {
			type: String,
			validate: [validator.isURL, "Invalid Twitter URL"],
		},
		linkedin: {
			type: String,
			validate: [validator.isURL, "Invalid LinkedIn URL"],
		},
		github: { type: String, validate: [validator.isURL, "Invalid GitHub URL"] },
	},

	// Gamification
	xp: { type: Number, default: 0, min: [0, "XP cannot be negative"] },
	rank: {
		type: String,
		enum: ["Novice", "Contributor", "Enthusiast", "Pro", "Master"],
		default: "Novice",
	},
	badges: [{ type: String }],
	achievements: [
		{ title: String, dateEarned: { type: Date, default: Date.now } },
	],

	// Engagement Metrics
	totalPosts: {
		type: Number,
		default: 0,
		min: [0, "Total posts cannot be negative"],
	},
	totalComments: {
		type: Number,
		default: 0,
		min: [0, "Total comments cannot be negative"],
	},
	followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

	profileCompleted: { type: Boolean, default: false }, // Track profile completion
	createdAt: { type: Date, default: Date.now },
});

// **Pre-Save Hooks**
UserSchema.pre("save", async function (next) {
	// Hash password before saving
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	// Ensure username is unique
	const existingUser = await this.constructor.findOne({
		username: this.username,
	});
	if (existingUser && existingUser._id.toString() !== this._id.toString()) {
		return next(new Error("Username already exists"));
	}

	next();
});

module.exports = mongoose.model("User", UserSchema);

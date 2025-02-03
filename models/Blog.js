const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
	// Core Details
	title: {
		type: String,
		required: [true, "Title is required"],
		trim: true,
		minlength: [5, "Title must be at least 5 characters long"],
		maxlength: [100, "Title cannot exceed 100 characters"],
	},
	slug: {
		type: String,
		unique: true,
		lowercase: true,
	},
	content: {
		type: String,
		required: [true, "Content cannot be empty"],
		minlength: [50, "Content must be at least 50 characters long"],
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Author is required"],
	},

	// Multimedia & SEO
	coverImage: { type: String }, // URL for the featured image
	tags: [{ type: String, trim: true }], // Blog categorization
	metaDescription: {
		type: String,
		maxlength: [160, "Meta description cannot exceed 160 characters"],
	},

	// Engagement Tracking
	likes: { type: Number, default: 0, min: [0, "Likes cannot be negative"] },
	views: { type: Number, default: 0, min: [0, "Views cannot be negative"] },
	likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	comments: [
		{
			user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			message: { type: String, required: true },
			date: { type: Date, default: Date.now },
		},
	],

	// Gamification & Rewards
	xpEarned: { type: Number, default: 0, min: [0, "XP cannot be negative"] },
	featured: { type: Boolean, default: false },

	// Publishing & Revisions
	isDraft: { type: Boolean, default: true },
	publishedAt: { type: Date },
	lastEditedAt: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now },
});

// **Pre-Save Hook for Slug Generation**
BlogSchema.pre("save", async function (next) {
	if (this.isModified("title")) {
		this.slug = this.title
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "");
	}
	next();
});

module.exports = mongoose.model("Blog", BlogSchema);

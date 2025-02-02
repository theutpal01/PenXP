const mongoose = require("mongoose");

const XPSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "User ID is required"],
	},
	action: {
		type: String,
		required: [true, "Action type is required"],
		enum: [
			"New Blog Post",
			"Commented",
			"Reviewed",
			"Liked Post",
			"Blog Shared",
			"Daily Login",
			"Challenge Completed",
		],
	},
	xpGained: {
		type: Number,
		required: [true, "XP amount is required"],
		min: [1, "XP must be at least 1"],
	},
	dateEarned: {
		type: Date,
		default: Date.now,
	},
});

// **Pre-Save Hook for Logical Checks**
XPSchema.pre("save", async function (next) {
	if (this.xpGained <= 0) {
		return next(new Error("XP gained must be a positive value."));
	}
	next();
});

module.exports = mongoose.model("XP", XPSchema);

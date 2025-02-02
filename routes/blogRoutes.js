const express = require("express");
const Blog = require("../models/Blog");
const XP = require("../models/XP");
const User = require("../models/User");
const { calculateXP, validateXP } = require("../utils/xpCalculator");

const router = express.Router();

// Create a New Blog Post & Award XP
router.post("/", async (req, res) => {
	try {
		const { title, content, author, coverImage, tags } = req.body;

		if (!title || !content || !author) {
			return res
				.status(400)
				.json({ error: "Title, content, and author are required." });
		}

		const xpEarned = calculateXP("New Blog Post");

		if (!validateXP("New Blog Post", xpEarned)) {
			return res.status(400).json({ error: "Invalid XP assignment." });
		}

		const newBlog = new Blog({
			title,
			content,
			author,
			coverImage,
			tags,
			xpEarned,
		});
		await newBlog.save();

		// Award XP to user
		await XP.create({
			user: author,
			action: "New Blog Post",
			xpGained: xpEarned,
		});
		await User.findByIdAndUpdate(author, {
			$inc: { xp: xpEarned, totalPosts: 1 },
		});

		res.status(201).json(newBlog);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Like a Blog Post & Award XP
router.post("/:blogId/like", async (req, res) => {
	try {
		const { userId } = req.body;
		const blog = await Blog.findById(req.params.blogId);

		if (!blog) return res.status(404).json({ error: "Blog not found." });

		blog.likes += 1;
		await blog.save();

		const xpEarned = calculateXP("Liked Post");
		if (validateXP("Liked Post", xpEarned)) {
			await XP.create({
				user: userId,
				action: "Liked Post",
				xpGained: xpEarned,
			});
			await User.findByIdAndUpdate(userId, { $inc: { xp: xpEarned } });
		}

		res.json({ message: "Blog liked!", likes: blog.likes });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Comment on a Blog & Award XP
router.post("/:blogId/comment", async (req, res) => {
	try {
		const { userId, message } = req.body;
		if (!message)
			return res.status(400).json({ error: "Comment cannot be empty." });

		const blog = await Blog.findById(req.params.blogId);
		if (!blog) return res.status(404).json({ error: "Blog not found." });

		blog.comments.push({ user: userId, message });
		await blog.save();

		const xpEarned = calculateXP("Commented");
		if (validateXP("Commented", xpEarned)) {
			await XP.create({
				user: userId,
				action: "Commented",
				xpGained: xpEarned,
			});
			await User.findByIdAndUpdate(userId, {
				$inc: { xp: xpEarned, totalComments: 1 },
			});
		}

		res.json({ message: "Comment added!", comments: blog.comments });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Get a Single Blog Post (Increments Views)
router.get("/:blogId", async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.blogId).populate(
			"author",
			"username"
		);
		if (!blog) return res.status(404).json({ error: "Blog not found." });

		blog.views += 1;
		await blog.save();

		res.json(blog);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Delete a Blog Post (Only Author Can Delete)
router.delete("/:blogId", async (req, res) => {
	try {
		const { userId } = req.body;
		const blog = await Blog.findById(req.params.blogId);

		if (!blog) return res.status(404).json({ error: "Blog not found." });
		if (blog.author.toString() !== userId)
			return res.status(403).json({ error: "Not authorized." });

		await blog.deleteOne();
		res.json({ message: "Blog deleted successfully." });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

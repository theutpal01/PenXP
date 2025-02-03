const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Initialize Gemini AI with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate Blog Title Based on Keywords
 */
router.post("/generate-title", async (req, res) => {
	try {
		const { keywords } = req.body;
		if (!keywords || keywords.length < 3) {
			return res
				.status(400)
				.json({ error: "At least 3 keywords are required." });
		}

		const prompt = `provide json of an array of catchy blog titles using the following keywords without giving extra information and prefixes: ${keywords.join(
			", "
		)}`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const title = response.text().trim();

		res.json({ title });
	} catch (err) {
		res.status(500).json({ error: "Gemini AI error", details: err.message });
	}
});

/**
 * WEnhance Blog Content with AI
 */
router.post("/enhance-content", async (req, res) => {
	try {
		const { content } = req.body;
		if (!content || content.length < 50) {
			return res
				.status(400)
				.json({ error: "Content must be at least 50 characters long." });
		}

		const prompt = `Improve and refine the following blog content, making it more engaging and readable and don't give any prefixes or conculsions only to the point answer:\n\n${content}`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const enhancedContent = response.text().trim();

		res.json({ enhancedContent });
	} catch (err) {
		res.status(500).json({ error: "Gemini AI error", details: err.message });
	}
});

/**
 * Summarize Blog Content
 */
router.post("/summarize", async (req, res) => {
	try {
		const { content } = req.body;
		if (!content || content.length < 100) {
			return res
				.status(400)
				.json({
					error:
						"Content must be at least 100 characters long for summarization.",
				});
		}

		const prompt = `Summarize the following blog content in a concise and clear way without any prefixes and conclusions:\n\n${content}`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const summary = response.text().trim();

		res.json({ summary });
	} catch (err) {
		res.status(500).json({ error: "Gemini AI error", details: err.message });
	}
});

module.exports = router;

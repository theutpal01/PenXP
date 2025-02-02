const xpTable = {
	"New Blog Post": 20,
	"Commented": 5,
	"Reviewed": 10,
	"Liked Post": 2,
	"Blog Shared": 10,
	"Daily Login": 5,
	"Challenge Completed": 50,
};

// Calculate XP for a given action
const calculateXP = (action) => {
	return xpTable[action] || 0; // Default to 0 if action is not recognized
};

// Validate XP before assigning
const validateXP = (action, xpGained) => {
	return xpTable[action] && xpGained > 0; // Ensures action exists and XP is positive
};

module.exports = { calculateXP, validateXP };

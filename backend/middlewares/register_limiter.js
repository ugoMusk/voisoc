const rateLimit = require("express-rate-limit");

// Define rate-limiting rules
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window/Ms
    message: {
        error: "Too many registration attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

module.exports = registerLimiter;

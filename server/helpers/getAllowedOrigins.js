console.log(process.env.ALLOWED_ORIGINS);
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());

module.exports = { allowedOrigins };

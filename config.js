
config  = {
    PORT: process.env.PORT || 8080,
    JWT_SECRET: "top_secret",
    MONGODB_URI : process.env.MONGODB_URI
}

module.exports = config;
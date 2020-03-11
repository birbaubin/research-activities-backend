
config  = {
    PORT: process.env.PORT || 8080,
    JWT_SECRET: "top_secret",
    MONGODB_URI : "mongodb://localhost/research-activities-db"
}

module.exports = config;
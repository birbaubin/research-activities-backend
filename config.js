
config  = {
    PORT: process.env.PORT || 8888,
    JWT_SECRET: "top_secret",
    MONGODB_URI : process.env.MONGODB_URI,
    EMAIL_ADDRESS: "portailmarocaindesrecherches@gmail.com",
    EMAIL_PASSWORD: "lpom,8631hsy",
    APPLICATION_URL: "https://research-activities.netlify.app"
}

module.exports = config;

config  = {
    PORT: process.env.PORT || 8888,
    JWT_SECRET: "top_secret",
    MONGODB_URI : process.env.MONGODB_URI,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    APPLICATION_URL: "https://research-activities.netlify.app"
}

module.exports = config;
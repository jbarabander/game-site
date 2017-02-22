const settings = {}
settings.db = process.env.MONGO_URI
settings.port = process.env.PORT

module.exports = {
    settings
}
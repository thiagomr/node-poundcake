const mongoose = require('mongoose');

class Mongo {
    constructor() {
        this.url = `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_SCHEMA}`;
        this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        mongoose.connection.on('connected', () => console.info(`[mongo] connected at ${process.env.MONGO_HOST}/${process.env.MONGO_SCHEMA}`));
        mongoose.connection.on('error', () => console.error('[mongo] error'));
        mongoose.connection.on('disconnected', () => console.warn('[mongo] disconnected'));
        mongoose.connection.on('reconnectFailed', () => console.error('[mongo] failed'));
    }

    async connect() {
        await mongoose.connect(this.url, this.options);
    }

    async disconnect() {
        await mongoose.disconnect();
    }
}

module.exports = Mongo;

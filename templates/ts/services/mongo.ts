import mongoose from 'mongoose';

class Mongo {
    url: string

    constructor(url: string) {
        this.url = url;

        mongoose.connection.on('connected', () => console.info(`[mongo] connected at ${this.url}`));
        mongoose.connection.on('disconnected', (e: Error) => console.info('[mongo] disconnected', e));
        mongoose.connection.on('error', (e: Error) => console.info('[mongo] error', e));
    }

    async connect(): Promise<void> {
        await mongoose.connect(this.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}

export default Mongo;

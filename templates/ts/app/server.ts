import express from 'express';
import router from './router';

export default class Server {
    app: express.Application;
    port: number;

    constructor() {
        this.app = express();
        this.port = 8000;
        this.app.use(express.json());
        this.app.use('/', router);
    }

    listen(): void {
        this.app.listen(this.port, () => console.log(`server listen at ${this.port}`));
    }
}

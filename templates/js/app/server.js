const express = require('express');
const router = require('./router');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8000;
        this.app.use(express.json());
        this.app.use('/', router);
    }

    listen() {
        this.app.listen(this.port, () => console.log(`listen at ${this.port}`));
    }
}

module.exports = Server;

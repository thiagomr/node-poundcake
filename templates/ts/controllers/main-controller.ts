import { Request, Response } from 'express';

class MainController {
    ping(request: Request, response: Response): Response {
        return response.status(200).send('pong');
    }
}

export default MainController;

class MainController {
    ping(req, res) {
        try {
            return res.status(200).send('pong');
        } catch (e) {
            return res.status(500).send('server error');
        }
    }
}

module.exports = MainController;

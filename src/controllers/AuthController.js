const AuthService = require('../services/AuthService');

class AuthController {
    async register(req, res, next) {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            if (error.statusCode) res.status(error.statusCode);
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await AuthService.login(req.body);
            res.json(result);
        } catch (error) {
            if (error.statusCode) res.status(error.statusCode);
            next(error);
        }
    }
}

module.exports = new AuthController();
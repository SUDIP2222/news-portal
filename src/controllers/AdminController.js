const ArticleService = require('../services/ArticleService');

class AdminController {
    // Article handlers
    async createArticle(req, res, next) {
        try {
            const article = await ArticleService.createArticle(req.body);
            res.status(201).json(article);
        } catch (error) {
            next(error);
        }
    }

    async updateArticle(req, res, next) {
        try {
            const article = await ArticleService.updateArticle(req.params.id, req.body);
            res.json(article);
        } catch (error) {
            next(error);
        }
    }

    async deleteArticle(req, res, next) {
        try {
            await ArticleService.deleteArticle(req.params.id);
            res.json({ message: 'Article removed (soft delete)' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
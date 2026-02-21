const ArticleService = require('../services/ArticleService');

class PublicController {
    async getArticles(req, res, next) {
        try {
            const data = await ArticleService.getArticles(req.query);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async getArticleBySlug(req, res, next) {
        try {
            const article = await ArticleService.getArticleBySlug(req.params.slug);
            res.json(article);
        } catch (error) {
            if (error.statusCode) res.status(error.statusCode);
            next(error);
        }
    }

    async getHome(req, res, next) {
        try {
            const data = await ArticleService.getHomeData();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicController();
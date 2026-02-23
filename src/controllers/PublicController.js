const ArticleService = require('../services/ArticleService');

class PublicController {
    async getArticles(req, res, next) {
        try {
            const lang = req.query.lang;
            const query = { ...req.query, language: lang };
            const data = await ArticleService.getArticles(query);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async getArticleBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const lang = req.query.lang;
            const article = await ArticleService.getArticleBySlug(slug, lang);
            res.json(article);
        } catch (error) {
            next(error);
        }
    }

    async getHome(req, res, next) {
        try {
            const lang = req.query.lang;
            const data = await ArticleService.getHomeData(lang);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicController();
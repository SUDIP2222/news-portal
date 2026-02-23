const CategoryService = require('../services/CategoryService');

class CategoryController {
    async getCategories(req, res, next) {
        try {
            const lang = req.query.lang;
            const categories = await CategoryService.getAllCategories(lang);
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
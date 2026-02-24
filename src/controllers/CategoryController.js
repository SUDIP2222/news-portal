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

    async createCategory(req, res, next) {
        try {
            const category = await CategoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            await CategoryService.deleteCategory(req.params.id);
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
const CategoryRepository = require('../repositories/CategoryRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const CacheService = require('./CacheService');
const AppError = require('../utils/AppError');

class CategoryService {
    async getAllCategories(language) {
        const cacheKey = `categories_list:${language || 'all'}`;
        let categories = await CacheService.get(cacheKey);

        if (!categories) {
            categories = await CategoryRepository.findAll();
            await CacheService.set(cacheKey, categories, 60); // 60 seconds
        }

        return categories;
    }

    async createCategory(data) {
        const category = await CategoryRepository.create(data);
        await this.invalidateCategoryCache();
        return category;
    }

    async updateCategory(id, data) {
        const category = await CategoryRepository.update(id, data);
        if (!category) {
            throw new AppError('Resource not found.', 404, 'NOT_FOUND');
        }
        await this.invalidateCategoryCache();
        return category;
    }

    async deleteCategory(id) {
        // Check if category is used by any article
        const articleCount = await ArticleRepository.countByCategoryId(id);
        if (articleCount > 0) {
            throw new AppError('Category is in use and cannot be deleted.', 400, 'BAD_REQUEST');
        }

        const category = await CategoryRepository.delete(id);
        if (!category) {
            throw new AppError('Resource not found.', 404, 'NOT_FOUND');
        }
        
        await this.invalidateCategoryCache();
        return category;
    }

    async invalidateCategoryCache() {
        await CacheService.delByPattern('categories_list:*');
        // Also invalidate article lists and home data as they might contain category info
        await CacheService.delByPattern('articles_list:*');
        await CacheService.delByPattern('home_data:*');
    }
}

module.exports = new CategoryService();
const CategoryRepository = require('../repositories/CategoryRepository');
const CacheService = require('./CacheService');

class CategoryService {
    async getAllCategories() {
        const cacheKey = 'categories_list';
        let categories = await CacheService.get(cacheKey);

        if (!categories) {
            categories = await CategoryRepository.findAll();
            await CacheService.set(cacheKey, categories, 60); // 60 seconds
        }

        return categories;
    }
}

module.exports = new CategoryService();
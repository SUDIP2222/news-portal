const CategoryRepository = require('../repositories/CategoryRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const CacheService = require('./CacheService');
const AppError = require('../utils/AppError');
const slugify = require('../utils/slugify');

class CategoryService {
    async getAllCategories(language) {
        const cacheKey = `categories_list:${language || 'all'}`;
        let categories = await CacheService.get(cacheKey);

        if (!categories) {
            categories = await CategoryRepository.findAll(language);
            await CacheService.set(cacheKey, categories, 60); // 60 seconds
        }

        return categories;
    }

    async createCategory(data) {
        if (!data.name) {
            throw new AppError('Name is required to generate slug.', 422, 'VALIDATION_ERROR');
        }

        if (!data.language) {
            throw new AppError('Language is required.', 422, 'VALIDATION_ERROR');
        }

        let slug = slugify(data.name);
        // Ensure unique slug within language
        let existing = await CategoryRepository.findBySlug(slug, data.language);
        let counter = 1;
        while (existing) {
            const newSlug = `${slug}-${counter}`;
            existing = await CategoryRepository.findBySlug(newSlug, data.language);
            if (!existing) {
                slug = newSlug;
            }
            counter++;
        }
        data.slug = slug;

        const category = await CategoryRepository.create(data);
        await this.invalidateCategoryCache();
        return category;
    }

    async updateCategory(id, data) {
        if (data.name) {
            // Get category to know its language if not provided
            let category = await CategoryRepository.findById(id);
            if (!category) {
                throw new AppError('Resource not found.', 404, 'NOT_FOUND');
            }
            const language = data.language || category.language;

            let slug = slugify(data.name);
            // Ensure unique slug (excluding current category) within language
            let existing = await CategoryRepository.findBySlug(slug, language);
            let counter = 1;
            while (existing && existing._id.toString() !== id) {
                const newSlug = `${slug}-${counter}`;
                existing = await CategoryRepository.findBySlug(newSlug, language);
                if (!existing || existing._id.toString() === id) {
                    slug = newSlug;
                    break;
                }
                counter++;
            }
            data.slug = slug;
        }

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
const ArticleRepository = require('../repositories/ArticleRepository');
const CategoryRepository = require('../repositories/CategoryRepository');
const CacheService = require('./CacheService');
const AppError = require('../utils/AppError');
const slugify = require('../utils/slugify');

class ArticleService {
    async createArticle(data) {
        if (!data.title) {
            throw new AppError('Title is required to generate slug.', 422, 'VALIDATION_ERROR');
        }

        if (!data.categoryId) {
            throw new AppError('Validation failed.', 422, 'VALIDATION_ERROR', ['Path `categoryId` is required.']);
        }
        const category = await CategoryRepository.findById(data.categoryId);
        if (!category) {
            throw new AppError('Resource not found.', 404, 'NOT_FOUND');
        }

        let slug = slugify(data.title);
        let existing = await ArticleRepository.findBySlugOnly(slug);
        let counter = 1;
        while (existing) {
            const newSlug = `${slug}-${counter}`;
            existing = await ArticleRepository.findBySlugOnly(newSlug);
            if (!existing) {
                slug = newSlug;
            }
            counter++;
        }
        data.slug = slug;

        const article = await ArticleRepository.create(data);
        await this.invalidateListCaches();
        return article;
    }

    async updateArticle(id, data) {
        if (data.title) {
            let slug = slugify(data.title);
            let existing = await ArticleRepository.findBySlugOnly(slug);
            let counter = 1;
            while (existing && existing._id.toString() !== id) {
                const newSlug = `${slug}-${counter}`;
                existing = await ArticleRepository.findBySlugOnly(newSlug);
                if (!existing || existing._id.toString() === id) {
                    slug = newSlug;
                    break;
                }
                counter++;
            }
            data.slug = slug;
        }

        const article = await ArticleRepository.update(id, data);
        if (!article) {
            throw new AppError('Resource not found.', 404, 'NOT_FOUND');
        }
        if (article.language && article.slug) {
            await CacheService.del(`article:${article.language}:${article.slug}`);
        }
        await this.invalidateListCaches();
        return article;
    }

    async deleteArticle(id) {
        const article = await ArticleRepository.softDelete(id);
        if (!article) {
            throw new AppError('Resource not found.', 404, 'NOT_FOUND');
        }
        if (article.language && article.slug) {
            await CacheService.del(`article:${article.language}:${article.slug}`);
        }
        await this.invalidateListCaches();
        return article;
    }

    async getArticleBySlug(slug, language) {
        const cacheKey = `article:${language}:${slug}`;
        let article = await CacheService.get(cacheKey);

        if (!article) {
            article = await ArticleRepository.findBySlug(slug, language);
            if (article) {
                await CacheService.set(cacheKey, article, 300);
            }
        }

        if (!article) {
            throw new AppError('Resource not found.', 404, 'NOT_FOUND');
        }

        await CacheService.incrementView(article._id);

        return article;
    }

    async getArticles({ language, categoryId, sort = '-publishedAt', page, limit }) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const cacheKey = `articles_list:${language || 'all'}:${categoryId || 'all'}:${sort}:${pageNum}:${limitNum}`;
        let data = await CacheService.get(cacheKey);

        if (!data) {
            const filters = {};
            if (language) filters.language = language;
            if (categoryId) filters.categoryId = categoryId;

            const skip = (pageNum - 1) * limitNum;

            const articles = await ArticleRepository.findAllPublic({ filters, sort, skip, limit: limitNum });
            const total = await ArticleRepository.countDocuments(filters);

            data = {
                articles,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum)
                }
            };

            await CacheService.set(cacheKey, data, 60);
        }

        return data;
    }

    async getHomeData(language) {
        const cacheKey = `home_data:${language}`;
        let homeData = await CacheService.get(cacheKey);

        if (!homeData) {
            const langFilter = language ? { language } : {};
            const latest = await ArticleRepository.findAllPublic({ 
                filters: { ...langFilter }, 
                sort: '-publishedAt', 
                skip: 0, 
                limit: 5 
            });

            const featured = await ArticleRepository.findAllPublic({ 
                filters: { isFeatured: true, ...langFilter }, 
                sort: '-publishedAt', 
                skip: 0, 
                limit: 5 
            });

            const trending = await ArticleRepository.findAllPublic({ 
                filters: { ...langFilter }, 
                sort: '-viewCount', 
                skip: 0, 
                limit: 5 
            });

            homeData = { latest, featured, trending };
            await CacheService.set(cacheKey, homeData, 60);
        }

        return homeData;
    }

    async invalidateListCaches() {
        await CacheService.delByPattern('home_data:*');
        await CacheService.delByPattern('categories_list:*');
        await CacheService.delByPattern('articles_list:*');
    }
}

module.exports = new ArticleService();
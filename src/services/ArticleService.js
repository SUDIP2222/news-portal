const ArticleRepository = require('../repositories/ArticleRepository');
const CacheService = require('./CacheService');

class ArticleService {
    async createArticle(data) {
        const article = await ArticleRepository.create(data);
        await this.invalidateListCaches();
        return article;
    }

    async updateArticle(id, data) {
        const article = await ArticleRepository.update(id, data);
        if (!article) {
            const error = new Error('Article not found');
            error.statusCode = 404;
            throw error;
        }
        await CacheService.del(`article:${article.slug}`);
        await this.invalidateListCaches();
        return article;
    }

    async deleteArticle(id) {
        const article = await ArticleRepository.softDelete(id);
        if (!article) {
            const error = new Error('Article not found');
            error.statusCode = 404;
            throw error;
        }
        await CacheService.del(`article:${article.slug}`);
        await this.invalidateListCaches();
        return article;
    }

    async getArticleBySlug(slug) {
        const cacheKey = `article:${slug}`;
        let article = await CacheService.get(cacheKey);

        if (!article) {
            article = await ArticleRepository.findBySlug(slug);
            if (article) {
                await CacheService.set(cacheKey, article, 300); // 5 minutes
            }
        }

        if (!article) {
            const error = new Error('Article not found');
            error.statusCode = 404;
            throw error;
        }

        // Increment view count in Redis
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

            await CacheService.set(cacheKey, data, 60); // 60 seconds
        }

        return data;
    }

    async getHomeData() {
        const cacheKey = 'home_data';
        let homeData = await CacheService.get(cacheKey);

        if (!homeData) {
            // Latest articles
            const latest = await ArticleRepository.findAllPublic({ 
                filters: {}, 
                sort: '-publishedAt', 
                skip: 0, 
                limit: 5 
            });

            // Featured articles
            const featured = await ArticleRepository.findAllPublic({ 
                filters: { isFeatured: true }, 
                sort: '-publishedAt', 
                skip: 0, 
                limit: 5 
            });

            // Trending articles (by viewCount)
            const trending = await ArticleRepository.findAllPublic({ 
                filters: {}, 
                sort: '-viewCount', 
                skip: 0, 
                limit: 5 
            });

            homeData = { latest, featured, trending };
            await CacheService.set(cacheKey, homeData, 60); // 60 seconds
        }

        return homeData;
    }

    async invalidateListCaches() {
        await CacheService.del('home_data');
        await CacheService.del('categories_list');
        await CacheService.delByPattern('articles_list:*');
    }
}

module.exports = new ArticleService();
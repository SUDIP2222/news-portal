const Article = require('../models/Article');

class ArticleRepository {
    async create(data) {
        return await Article.create(data);
    }

    async update(id, data) {
        return await Article.findByIdAndUpdate(id, data, { new: true });
    }

    async findById(id) {
        return await Article.findById(id).populate('categoryId', 'name slug');
    }

    async findBySlug(slug, language) {
        const query = { slug, isDeleted: false, status: 'published' };
        if (language) query.language = language;
        return await Article.findOne(query).populate('categoryId', 'name slug');
    }

    async softDelete(id) {
        return await Article.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }

    async findAllPublic({ filters, sort, skip, limit }) {
        const query = { 
            status: 'published', 
            isDeleted: false,
            ...filters 
        };
        
        return await Article.find(query)
            .select('title slug summary language categoryId tags thumbnail publishedAt viewCount isFeatured')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('categoryId', 'name slug');
    }

    async countDocuments(filters) {
        return await Article.countDocuments({ 
            status: 'published', 
            isDeleted: false,
            ...filters 
        });
    }

    async updateViewCount(id, increment) {
        return await Article.findByIdAndUpdate(id, { $inc: { viewCount: increment } });
    }
}

module.exports = new ArticleRepository();
const Category = require('../models/Category');

class CategoryRepository {
    async findAll(language) {
        let query = {};
        if (language) {
            query.language = language;
        }
        return await Category.find(query).select('name slug description language');
    }

    async findById(id) {
        return await Category.findById(id);
    }

    async findBySlug(slug, language) {
        const query = { slug };
        if (language) query.language = language;
        return await Category.findOne(query);
    }

    async create(data) {
        return await Category.create(data);
    }

    async update(id, data) {
        return await Category.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = new CategoryRepository();
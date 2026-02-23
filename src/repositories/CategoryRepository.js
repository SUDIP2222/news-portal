const Category = require('../models/Category');

class CategoryRepository {
    async findAll() {
        return await Category.find().select('name slug description');
    }

    async findById(id) {
        return await Category.findById(id);
    }

    async findBySlug(slug) {
        return await Category.findOne({ slug });
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
const Category = require('../models/Category');

class CategoryRepository {
    async findAll() {
        return await Category.find().select('name slug description');
    }

    async findById(id) {
        return await Category.findById(id);
    }
}

module.exports = new CategoryRepository();
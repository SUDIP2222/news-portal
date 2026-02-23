const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String }
}, { timestamps: true });

categorySchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
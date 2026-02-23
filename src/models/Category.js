const mongoose = require('mongoose');
const Language = require('../enums/Language');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    language: { type: String, enum: Object.values(Language), required: true }
}, { timestamps: true });

categorySchema.index({ slug: 1, language: 1 }, { unique: true });
categorySchema.index({ language: 1 });

module.exports = mongoose.model('Category', categorySchema);
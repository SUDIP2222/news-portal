const mongoose = require('mongoose');
const Language = require('../enums/Language');
const ArticleStatus = require('../enums/ArticleStatus');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, enum: Object.values(Language), required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    thumbnail: { type: String },
    status: { type: String, enum: Object.values(ArticleStatus), default: ArticleStatus.DRAFT },
    publishedAt: { type: Date },
    viewCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Proper indexing strategy
articleSchema.index({ slug: 1 }, { unique: true });
articleSchema.index({ categoryId: 1, status: 1, isDeleted: 1, publishedAt: -1 });
articleSchema.index({ language: 1, status: 1, isDeleted: 1, publishedAt: -1 });
articleSchema.index({ status: 1, isDeleted: 1, isFeatured: 1, publishedAt: -1 });
articleSchema.index({ status: 1, isDeleted: 1, viewCount: -1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ tags: 1 });

module.exports = mongoose.model('Article', articleSchema);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Article = require('../models/Article');
const Role = require('../models/Role');
const UserRole = require('../enums/UserRole');
const Language = require('../enums/Language');
const ArticleStatus = require('../enums/ArticleStatus');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await User.deleteMany();
        await Category.deleteMany();
        await Article.deleteMany();
        await Role.deleteMany();

        // 1. Create Roles
        console.log('Creating roles...');
        const roles = await Role.insertMany([
            { name: UserRole.ADMIN, description: 'Full access to all features' },
            { name: UserRole.EDITOR, description: 'Can manage articles' },
            { name: UserRole.PUBLIC, description: 'Regular reader' }
        ]);

        const adminRole = roles.find(r => r.name === UserRole.ADMIN)._id;
        const editorRole = roles.find(r => r.name === UserRole.EDITOR)._id;
        const publicRole = roles.find(r => r.name === UserRole.PUBLIC)._id;

        // 2. Create Demo Users
        console.log('Creating demo users...');
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@newsportal.com',
            password: 'password123',
            role: [adminRole, editorRole]
        });

        const editor = await User.create({
            name: 'Editor One',
            email: 'editor@newsportal.com',
            password: 'password123',
            role: [editorRole]
        });

        console.log('Users created successfully.');

        console.log('Creating categories...');
        const categories = await Category.insertMany([
            { name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
            { name: 'Technology', slug: 'technology', description: 'Latest in tech and gadgets' },
            { name: 'Sports', slug: 'sports', description: 'Sports updates from around the world' },
            { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music and celebrity news' },
            { name: 'Business', slug: 'business', description: 'Stock market and economic updates' }
        ]);

        const techCategory = categories.find(c => c.slug === 'technology')._id;
        const sportsCategory = categories.find(c => c.slug === 'sports')._id;
        const politicsCategory = categories.find(c => c.slug === 'politics')._id;

        console.log('Categories created successfully.');

        // 3. Create Demo Articles
        console.log('Creating articles...');
        const articles = [
            // English Articles
            {
                title: 'The Future of AI in 2026',
                slug: 'the-future-of-ai-2026',
                summary: 'Artificial Intelligence continues to evolve at a rapid pace.',
                content: '<p>AI is transforming industries. By 2026, we expect to see even more autonomous systems and better natural language understanding.</p>',
                language: Language.EN,
                categoryId: techCategory,
                tags: ['AI', 'Tech', 'Future'],
                thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(),
                isFeatured: true,
                viewCount: 1250
            },
            {
                title: 'Champions League Finals Preview',
                slug: 'champions-league-finals-2026',
                summary: 'The biggest club football match of the year is almost here.',
                content: '<p>The finalists have been decided. Both teams have shown incredible form throughout the tournament.</p>',
                language: Language.EN,
                categoryId: sportsCategory,
                tags: ['Football', 'Sports', 'ChampionsLeague'],
                thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 86400000), // yesterday
                isFeatured: false,
                viewCount: 890
            },
            {
                title: 'Upcoming Tech Gadgets to Watch',
                slug: 'upcoming-tech-gadgets-2026',
                summary: 'A look at the most anticipated gadgets releasing this year.',
                content: '<p>From foldable phones to new AR glasses, 2026 promises to be a great year for tech enthusiasts.</p>',
                language: Language.EN,
                categoryId: techCategory,
                tags: ['Gadgets', 'Tech', '2026'],
                thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                status: ArticleStatus.DRAFT,
                language: Language.EN,
                categoryId: techCategory
            },
            // Bengali Articles
            {
                title: '২০২৬ সালে প্রযুক্তির ভবিষ্যৎ',
                slug: 'future-of-tech-2026-bn',
                summary: 'প্রযুক্তি কীভাবে আমাদের জীবনকে পরিবর্তন করছে তার একটি সংক্ষিপ্ত বিবরণ।',
                content: '<p>২০২৬ সালে আমরা প্রযুক্তির ক্ষেত্রে অনেক নতুন উদ্ভাবন দেখতে পাব।</p>',
                language: Language.BN,
                categoryId: techCategory,
                tags: ['প্রযুক্তি', 'ভবিষ্যৎ'],
                thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(),
                isFeatured: true,
                viewCount: 500
            },
            {
                title: 'দেশের রাজনৈতিক প্রেক্ষাপট ও নির্বাচন',
                slug: 'politics-election-bn',
                summary: 'আসন্ন নির্বাচনকে ঘিরে দেশের রাজনৈতিক পরিস্থিতি উত্তপ্ত হয়ে উঠেছে।',
                content: '<p>রাজনৈতিক দলগুলো নির্বাচনের প্রস্তুতি শুরু করেছে। সাধারণ মানুষের প্রত্যাশা অনেক বেশি।</p>',
                language: Language.BN,
                categoryId: politicsCategory,
                tags: ['রাজনীতি', 'নির্বাচন'],
                thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 172800000), // 2 days ago
                isFeatured: false,
                viewCount: 2300
            }
        ];

        await Article.insertMany(articles);
        console.log('Articles created successfully.');

        console.log('Seed database completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedData();

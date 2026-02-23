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
            // Pair 1: Future of AI
            {
                title: 'The Future of AI in 2026',
                slug: 'the-future-of-ai-2026-en',
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
                title: '২০২৬ সালে কৃত্রিম বুদ্ধিমত্তার ভবিষ্যৎ',
                slug: 'the-future-of-ai-2026-bn',
                summary: 'কৃত্রিম বুদ্ধিমত্তা দ্রুত পরিবর্তিত হচ্ছে।',
                content: '<p>২০২৬ সালে আরও উন্নত স্বয়ংক্রিয় সিস্টেম ও প্রাকৃতিক ভাষা বোঝার ক্ষমতা দেখা যাবে।</p>',
                language: Language.BN,
                categoryId: techCategory,
                tags: ['কৃত্রিম বুদ্ধিমত্তা', 'প্রযুক্তি', 'ভবিষ্যৎ'],
                thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(),
                isFeatured: true,
                viewCount: 600
            },
            // Pair 2: Champions League
            {
                title: 'Champions League Finals Preview',
                slug: 'champions-league-finals-2026-en',
                summary: 'The biggest club football match of the year is almost here.',
                content: '<p>The finalists have been decided. Both teams have shown incredible form throughout the tournament.</p>',
                language: Language.EN,
                categoryId: sportsCategory,
                tags: ['Football', 'Sports', 'ChampionsLeague'],
                thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 86400000),
                isFeatured: false,
                viewCount: 890
            },
            {
                title: 'চ্যাম্পিয়নস লিগ ফাইনাল প্রিভিউ',
                slug: 'champions-league-finals-2026-bn',
                summary: 'বছরের সবচেয়ে বড় ক্লাব ফুটবল ম্যাচ সামনে।',
                content: '<p>ফাইনালিস্টরা নির্ধারিত। পুরো টুর্নামেন্ট জুড়ে দুই দলই দুর্দান্ত ছিল।</p>',
                language: Language.BN,
                categoryId: sportsCategory,
                tags: ['ফুটবল', 'খেলা', 'চ্যাম্পিয়নস লিগ'],
                thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 86400000),
                isFeatured: false,
                viewCount: 760
            },
            // Pair 3: Global Economy
            {
                title: 'Global Economy Outlook 2026',
                slug: 'global-economy-outlook-2026-en',
                summary: 'A look at the challenges and opportunities in the global economy.',
                content: '<p>Inflation, supply chains, and emerging markets will define 2026.</p>',
                language: Language.EN,
                categoryId: politicsCategory,
                tags: ['Economy', 'Global', 'Markets'],
                thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 172800000),
                isFeatured: false,
                viewCount: 450
            },
            {
                title: 'বিশ্ব অর্থনীতির পূর্বাভাস ২০২৬',
                slug: 'global-economy-outlook-2026-bn',
                summary: 'বিশ্ব অর্থনীতির চ্যালেঞ্জ ও সুযোগ নিয়ে আলোচনা।',
                content: '<p>মুদ্রাস্ফীতি, সাপ্লাই চেইন ও উদীয়মান বাজার ২০২৬ নির্ধারণ করবে।</p>',
                language: Language.BN,
                categoryId: politicsCategory,
                tags: ['অর্থনীতি', 'বিশ্ব', 'বাজার'],
                thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 172800000),
                isFeatured: false,
                viewCount: 510
            },
            // Pair 4: Tech Gadgets
            {
                title: 'Top Tech Gadgets to Watch in 2026',
                slug: 'top-tech-gadgets-2026-en',
                summary: 'The most anticipated gadgets releasing this year.',
                content: '<p>From foldables to AR glasses, 2026 is exciting for tech.</p>',
                language: Language.EN,
                categoryId: techCategory,
                tags: ['Gadgets', 'Tech', '2026'],
                thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 3600000),
                isFeatured: true,
                viewCount: 300
            },
            {
                title: '২০২৬ সালের শীর্ষ প্রযুক্তি গ্যাজেট',
                slug: 'top-tech-gadgets-2026-bn',
                summary: 'এ বছর আসছে সবচেয়ে প্রত্যাশিত গ্যাজেটগুলো।',
                content: '<p>ফোল্ডেবল থেকে শুরু করে এআর গ্লাস—প্রযুক্তিপ্রেমীদের জন্য ২০২৬ দারুণ হবে।</p>',
                language: Language.BN,
                categoryId: techCategory,
                tags: ['গ্যাজেট', 'প্রযুক্তি', '২০২৬'],
                thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                status: ArticleStatus.PUBLISHED,
                publishedAt: new Date(Date.now() - 3600000),
                isFeatured: true,
                viewCount: 280
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

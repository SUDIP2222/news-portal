const cron = require('node-cron');
const CacheService = require('../services/CacheService');
const ArticleRepository = require('../repositories/ArticleRepository');

const syncViewsToDB = async () => {
    console.log('Running background job: Syncing Redis views to MongoDB...');
    try {
        const viewUpdates = await CacheService.getAndResetViews();
        if (viewUpdates.length === 0) {
            console.log('No views to sync.');
            return;
        }

        for (const update of viewUpdates) {
            await ArticleRepository.updateViewCount(update.articleId, update.count);
        }

        console.log(`Successfully synced views for ${viewUpdates.length} articles.`);

    } catch (error) {
        console.error('Error syncing views to DB:', error);
    }
};

cron.schedule('*/5 * * * *', syncViewsToDB);

module.exports = { syncViewsToDB };
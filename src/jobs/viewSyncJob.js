const cron = require('node-cron');
const CacheService = require('../services/CacheService');
const ArticleRepository = require('../repositories/ArticleRepository');

const syncViewsToDB = async () => {
    console.log('Running background job: Syncing Redis views to MongoDB...');
    try {
        const viewUpdates = await CacheService.getViews();
        if (viewUpdates.length === 0) {
            console.log('No views to sync.');
            return;
        }

        let syncedCount = 0;
        for (const update of viewUpdates) {
            try {
                await ArticleRepository.updateViewCount(update.articleId, update.count);
                await CacheService.del(update.key);
                syncedCount++;
            } catch (err) {
                console.error(`Failed to sync views for article ${update.articleId}:`, err);
            }
        }

        console.log(`Successfully synced views for ${syncedCount} out of ${viewUpdates.length} articles.`);

    } catch (error) {
        console.error('Error syncing views to DB:', error);
    }
};

cron.schedule('*/5 * * * *', syncViewsToDB);

module.exports = { syncViewsToDB };
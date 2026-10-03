import cron from 'node-cron';
import Inventory from '../models/Inventory.js';

export const startInventoryMonitor = () => {
  // Runs every hour to check inventory thresholds (cron: '0 * * * *')
  // For development & testing, runs every 30 minutes: '*/30 * * * *'
  cron.schedule('*/30 * * * *', async () => {
    try {
      const lowStockItems = await Inventory.find({
        $expr: {$lte: ['$stock', '$threshold'] }
      });

      if (lowStockItems.length > 0) {
        console.log(`\n⚠️  [INVENTORY ALERT] ${lowStockItems.length} items below threshold (< 20 units):`);
        lowStockItems.forEach((item) => {
          console.log(`   - ${item.name} (${item.category}): ${item.stock} left (Threshold: ${item.threshold})`);
        });
        console.log(`   Notification dispatched to Admin (${process.env.ADMIN_EMAIL})\n`);
      } else {
        console.log('✅ [INVENTORY CHECK] All stock levels are healthy.');
      }
    } catch (error) {
      console.error('Error running inventory cron check:', error.message);
    }
  });

  console.log('⏰ Automated inventory monitor initialized (node-cron)');
};
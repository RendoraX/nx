import Router from 'express'
import { adminMiddleware } from '../../middleware/admin.middleware';
import { bulkUpdateInventoryEndpoint, getAllInventoryEndpoint, getInventoryHistoryEndpoint, getInventorySummaryEndpoint, updateInventoryEndpoint } from './inventory.controller';

const router = Router();

router.get(
    '/admin/inventory',
    getAllInventoryEndpoint
)

router.get(
    '/admin/inventory/summary',
    getInventorySummaryEndpoint
)

router.get(
    '/admin/inventory/history',
    getInventoryHistoryEndpoint
)

router.patch(
    '/admin/inventory/adjust',
    updateInventoryEndpoint
)

router.post(
    '/admin/inventory/bulk-adjust',
    bulkUpdateInventoryEndpoint
)

export default router
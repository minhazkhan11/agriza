const express = require('express');
const router = express.Router();

const joiMiddleware = require('../../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../../middlewares/admin.middleware');

const addWishlistComponent = require('../../../../../components/v1/admin/website/whishlist/add.whishlist');
const fetchWishlistComponent = require('../../../../../components/v1/admin/website/whishlist/fetchall.whishlist');
const removeWishlistComponent = require('../../../../../components/v1/admin/website/whishlist/delete.whishlist');

router.post('/add', addWishlistComponent);
router.get('/',  fetchWishlistComponent);
router.delete('/:id',  removeWishlistComponent);

module.exports = router;
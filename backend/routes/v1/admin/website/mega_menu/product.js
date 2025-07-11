const express = require('express');
const router = express.Router();
// const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../../components/v1/admin/website/contact_us/add.contact');
const fetchAllComponent = require('../../../../../components/v1/admin/website/mega_menu/fetch.product.by product_cata_id.sub_cat_id.child_product_id');




// router.post('/add', addComponent);
router.get('/:product_category_id?/:product_sub_category_id?/:product_child_category_id?', fetchAllComponent);


module.exports = router;
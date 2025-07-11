const express = require('express');
const router = express.Router();




const fetchAllcatComponent = require('../../../../../components/v1/admin/website/home/fetchall.category');
const fetchallBysubidComponent = require('../../../../../components/v1/admin/website/home/fetch.itemvriant.by product_cata_id.sub_cat_id');


const fetchallBychildidComponent = require('../../../../../components/v1/admin/website/home/fetch.itemvriant.by product_child_cata_id');

router.get('/category', fetchAllcatComponent);

router.get('/product_sub_category_id/:id', fetchallBysubidComponent);
router.get('/product_child_category_id/:id', fetchallBychildidComponent);

module.exports = router;
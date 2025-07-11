const express = require('express');
const router = express.Router();
// const adminMiddleware = require('../../../../middlewares/admin.middleware');



const addComponent = require('../../../../../components/v1/admin/website/book_a_demo/add.bookdemo');
const fetchAllComponent = require('../../../../../components/v1/admin/website/book_a_demo/fetchall.bookdemo');




router.post('/add', addComponent);
router.get('/', fetchAllComponent);
// router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneComponent);
// router.get('/marketers_id/:id', adminMiddleware.be_adminAccess(), fetchbyMarketersIdComponent);
// router.put('/update', adminMiddleware.adminAccess(), updateComponent);
// router.put('/status', adminMiddleware.adminAccess(), statusChangeComponent);


module.exports = router;
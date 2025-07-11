const express = require('express');
const router = express.Router();
// const adminMiddleware = require('../../../../middlewares/admin.middleware');



const addComponent = require('../../../../../components/v1/admin/website/contact_us/add.contact');
const fetchAllComponent = require('../../../../../components/v1/admin/website/contact_us/fetchall.contact');




router.post('/add', addComponent);
router.get('/', fetchAllComponent);
// router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneComponent);
// router.get('/marketers_id/:id', adminMiddleware.be_adminAccess(), fetchbyMarketersIdComponent);
// router.put('/update', adminMiddleware.adminAccess(), updateComponent);
// router.put('/status', adminMiddleware.adminAccess(), statusChangeComponent);


module.exports = router;
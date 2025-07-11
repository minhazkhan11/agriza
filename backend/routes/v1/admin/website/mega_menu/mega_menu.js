const express = require('express');
const router = express.Router();
// const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../../components/v1/admin/website/contact_us/add.contact');
const fetchAllComponent = require('../../../../../components/v1/admin/website/mega_menu/fetch.all.mega_menu');




// router.post('/add', addComponent);
router.get('/', fetchAllComponent);


module.exports = router;
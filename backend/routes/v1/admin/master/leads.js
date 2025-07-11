const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addleadsComponent = require('../../../../components/v1/admin/master/leads/add.leads');
const deleteleadsComponent = require('../../../../components/v1/admin/master/leads/delete.lead');
const fetchAllleadsComponent = require('../../../../components/v1/admin/master/leads/fetchall.leads');
const fetchoneleadsComponent = require('../../../../components/v1/admin/master/leads/fetchone.leads');
const updateleadsComponent = require('../../../../components/v1/admin/master/leads/updata.leads');
const statusChangeComponent = require('../../../../components/v1/admin/master/leads/changestatus.leads');
const addleadsinfoComponent = require('../../../../components/v1/admin/master/leads/add.leadsinfo');


router.post('/add',adminMiddleware.be_adminAccess(), addleadsComponent);
router.post('/leadinfo/add',adminMiddleware.be_adminAccess(), addleadsinfoComponent);
router.delete('/:id', adminMiddleware.be_adminAccess(), deleteleadsComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllleadsComponent);
router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneleadsComponent);
router.put('/update', adminMiddleware.be_adminAccess(), updateleadsComponent);
router.put('/status', adminMiddleware.be_adminAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'lead'),  statusChangeComponent);


module.exports = router
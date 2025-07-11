const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { upload, uploadCsv } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/master/pin/add.pin');
const deleteComponent = require('../../../../components/v1/admin/master/pin/delete.pin');
const fetchAllComponent = require('../../../../components/v1/admin/master/pin/fetch.pin');
const fetchoneComponent = require('../../../../components/v1/admin/master/pin/fetch.one.pin');
const updateComponent = require('../../../../components/v1/admin/master/pin/update.pin');
const statusChangeComponent = require('../../../../components/v1/admin/master/pin/change.status');
const fetchbytehsilIdComponent = require('../../../../components/v1/admin/master/pin/fetch.pin.by.teshi_id');
const fetchbytehsilIdsComponent = require('../../../../components/v1/admin/master/pin/fetch.pin_by_tahsil_ids');

const fetchbypinIdbyComponent = require('../../../../components/v1/admin/master/pin/fetch.one.pinBytahBydis');
const ImportCsvComponent = require('../../../../components/v1/admin/master/pin/import.csv.pin');


router.post('/add', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.addpin, 'pin'), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/tehsil_id/:id', adminMiddleware.checkAccess(), fetchbytehsilIdComponent);
router.post('/tehsil_ids', adminMiddleware.checkAccess(), fetchbytehsilIdsComponent);
router.get('/pin_by/:id', adminMiddleware.checkAccess(), fetchbypinIdbyComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'pin'), statusChangeComponent);
router.post('/import/csv', adminMiddleware.checkAccess(), uploadCsv.single('file'), ImportCsvComponent);


module.exports = router;
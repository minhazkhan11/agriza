const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const { upload, uploadCsv } = require("../../../../lib/utils/multer");

const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/tehsil/add.tehsil');
const deleteComponent = require('../../../../components/v1/admin/master/tehsil/delete.tehsil');
const fetchAllComponent = require('../../../../components/v1/admin/master/tehsil/fetch.tehsil');
const fetchoneComponent = require('../../../../components/v1/admin/master/tehsil/fetch.one.tehsil');
const updateComponent = require('../../../../components/v1/admin/master/tehsil/update.tehsil');
const statusChangeComponent = require('../../../../components/v1/admin/master/tehsil/change.status');
const fetchallBydistrictComponent = require('../../../../components/v1/admin/master/tehsil/fetch.tehsil.bydistrct');
const fetchallBydistrictidsComponent = require('../../../../components/v1/admin/master/tehsil/fetch.tehsil.bydistrct_ids');
const ImportCsvComponent = require('../../../../components/v1/admin/master/tehsil/import.csv.tehsil');

router.post('/add', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.addtehsil, 'tehsil'), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/district_id/:id', adminMiddleware.checkAccess(), fetchallBydistrictComponent);
router.post('/district_ids', adminMiddleware.checkAccess(), fetchallBydistrictidsComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'tehsil'), statusChangeComponent);
router.post('/import/csv', adminMiddleware.checkAccess(), uploadCsv.single('file'), ImportCsvComponent);


module.exports = router;
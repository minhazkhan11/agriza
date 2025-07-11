const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const { upload, uploadCsv } = require("../../../../lib/utils/multer");
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/state/add.state');
const deleteComponent = require('../../../../components/v1/admin/master/state/delete');
const fetchAllComponent = require('../../../../components/v1/admin/master/state/fetch');
const fetchoneComponent = require('../../../../components/v1/admin/master/state/fetch.one');
const updateComponent = require('../../../../components/v1/admin/master/state/update');
const statusChangeComponent = require('../../../../components/v1/admin/master/state/change.status');
const fetchcountrybystateComponent = require('../../../../components/v1/admin/master/state/fetch.countrybystate');
const ImportCsvComponent = require('../../../../components/v1/admin/master/state/import.csv.state');
const fetchcountrymultipleidbystateComponent = require('../../../../components/v1/admin/master/state/fetch.country_ids_by_state');

router.post('/add', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.addstate, 'state'), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/country_id/:id', adminMiddleware.checkAccess(), fetchcountrybystateComponent);
router.post('/country_ids', adminMiddleware.checkAccess(), fetchcountrymultipleidbystateComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'state'), statusChangeComponent);

router.post('/import/csv', adminMiddleware.checkAccess(), uploadCsv.single('file'), ImportCsvComponent);



module.exports = router;
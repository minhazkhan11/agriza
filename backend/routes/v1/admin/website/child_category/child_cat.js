const express = require('express');
const router = express.Router();



const fetchAllComponent = require('../../../../../components/v1/admin/website/child_category/fetchall.child.category');
const fetchAllcatComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.categorybyproduct');
const fetchAllseedscatComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.seedsbyproduct');
const fetchAllfertilizersComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.all.fertilizers');
const fetchAllsubbyproductComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.subcatbypro');
const fetchAllcattlebyproductComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.cattleby.product');
const fetchAlltrapsandluresbyproductComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.trapsandluresby.product');
const fetchAllchemical_pesticidesComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.chemical.child_cat');

const fetchAllgrowthandplantregulatorsComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.growthandplantregu');

const fetchAllorganicComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.organic');
const fetchAllfield_cropsComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.field_crops');
const fetchAllfertilizerComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.fertilizer');
const fetchAllcattlesComponent  = require('../../../../../components/v1/admin/website/child_category/fetch.cattle');

router.get('/', fetchAllComponent);
router.get('/farm_equipments', fetchAllcatComponent);
router.get('/seeds', fetchAllseedscatComponent);
router.get('/fertilizers/product', fetchAllfertilizersComponent);
router.get('/sub_cat_by_product/:id', fetchAllsubbyproductComponent);
router.get('/cattle', fetchAllcattlebyproductComponent);
router.get('/trapsandlures', fetchAlltrapsandluresbyproductComponent);
router.get('/chemical_pesticides', fetchAllchemical_pesticidesComponent);
router.get('/growthandplantregulators', fetchAllgrowthandplantregulatorsComponent);
router.get('/organic', fetchAllorganicComponent);
router.get('/field_crops', fetchAllfield_cropsComponent);
router.get('/fertilizer', fetchAllfertilizerComponent);
router.get('/cattles', fetchAllcattlesComponent);

module.exports = router;
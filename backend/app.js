const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const appRouter = require('./routes/v1/admin/master');
const appRouter1 = require('./routes/v1/admin/index');
const responseMiddleWare = require('./middlewares/response.middleware');
const passportMiddleWare = require('./middlewares/passport.middleware');

// ✅ Load env vars only in local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ✅ Start logs for debugging
console.log("🔥 Starting backend server...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

// ✅ Initialize express app
const app = express();

// ✅ Health routes at top
app.get('/', (req, res) => res.send('Backend is running!'));
app.get('/api/health', (req, res) => res.status(200).send('OK'));

// ✅ Middlewares
app.use(cors());
app.use(responseMiddleWare);
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ✅ Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ✅ Global async helper
global.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// ✅ Detailed request logging in development
if (process.env.NODE_ENV === 'development') {
  const morganBody = require('morgan-body');
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  morganBody(app, { theme: 'darkened' });
}

// ✅ API ROUTES
// --- ADMIN ROUTES ---
app.use('/api/v1/admin/auth', appRouter.authRouter);
app.use('/api/v1/user', appRouter.userRouter);
app.use('/api/v1/admin/category', passportMiddleWare.jwtAuth, appRouter.categoryRouter);
app.use('/api/v1/admin/country', passportMiddleWare.jwtAuth, appRouter.countryRouter);
app.use('/api/v1/admin/units', passportMiddleWare.jwtAuth, appRouter.unitsRouter);
app.use('/api/v1/admin/state', passportMiddleWare.jwtAuth, appRouter.stateRouter);
app.use('/api/v1/admin/district', passportMiddleWare.jwtAuth, appRouter.districtRouter);
app.use('/api/v1/admin/tehsil', passportMiddleWare.jwtAuth, appRouter.tehsilRouter);
app.use('/api/v1/admin/pin', passportMiddleWare.jwtAuth, appRouter.pinRouter);
app.use('/api/v1/admin/place', passportMiddleWare.jwtAuth, appRouter.placeRouter);
app.use('/api/v1/admin/product', passportMiddleWare.jwtAuth, appRouter.productRouter);
app.use('/api/v1/admin/product_category', passportMiddleWare.jwtAuth, appRouter.productCategoryRouter);
app.use('/api/v1/admin/product_class', passportMiddleWare.jwtAuth, appRouter.productClassRouter);
app.use('/api/v1/admin/business_entity_basic', passportMiddleWare.jwtAuth, appRouter.EntitybasicRouter);
app.use('/api/v1/admin/business_bank_details', passportMiddleWare.jwtAuth, appRouter.bankdetailsRouter);
app.use('/api/v1/admin/business_area_information', passportMiddleWare.jwtAuth, appRouter.businessinformationRouter);
app.use('/api/v1/admin/Business_warehouse_information', passportMiddleWare.jwtAuth, appRouter.warehouseinformationRouter);
app.use('/api/v1/admin/Business_license_details', passportMiddleWare.jwtAuth, appRouter.licensedetailsRouter);
app.use('/api/v1/admin/Business_owner_details', passportMiddleWare.jwtAuth, appRouter.ownerdetailsRouter);
app.use('/api/v1/admin/Business_staff_contacts', passportMiddleWare.jwtAuth, appRouter.staffcontactsRouter);
app.use('/api/v1/admin/be_gst_details', passportMiddleWare.jwtAuth, appRouter.begstRouter);
app.use('/api/v1/admin/marketers', passportMiddleWare.jwtAuth, appRouter.marketersRouter);
app.use('/api/v1/admin/brand', passportMiddleWare.jwtAuth, appRouter.brandRouter);
app.use('/api/v1/admin/productcatalogue', passportMiddleWare.jwtAuth, appRouter.productCatalogueRouter);
app.use('/api/v1/admin/supplier', passportMiddleWare.jwtAuth, appRouter.supplierRouter);
app.use('/api/v1/admin/integrated_module_plans', passportMiddleWare.jwtAuth, appRouter.integratedmodulplansRouter);
app.use('/api/v1/admin/sub_category', passportMiddleWare.jwtAuth, appRouter.subCategoryRouter);
app.use('/api/v1/admin/gst_percent', passportMiddleWare.jwtAuth, appRouter.gst_percentRouter);
app.use('/api/v1/admin/product_sub_category', passportMiddleWare.jwtAuth, appRouter.productSubCategoryRouter);
app.use('/api/v1/admin/main_menu', passportMiddleWare.jwtAuth, appRouter.mainMenuRouter);
app.use('/api/v1/admin/product_price', passportMiddleWare.jwtAuth, appRouter.ProductPriceRouter);
app.use('/api/v1/admin/vender', passportMiddleWare.jwtAuth, appRouter.VenderRouter);
app.use('/api/v1/admin/customer', passportMiddleWare.jwtAuth, appRouter.CustomerRouter);
app.use('/api/v1/admin/uqc', passportMiddleWare.jwtAuth, appRouter.UqcRouter);
app.use('/api/v1/admin/be_module_plans_updation', passportMiddleWare.jwtAuth, appRouter.BemodulePlansUpdationRouter);
app.use('/api/v1/admin/integrated_modules_main_menu', passportMiddleWare.jwtAuth, appRouter.IntegratedModulesMainMenuRouter);
app.use('/api/v1/admin/integrated_modules_main_menu', passportMiddleWare.jwtAuth, appRouter.IntegratedModulesSubMenuRouter);
app.use('/api/v1/admin/integrated_modules_child_menu', passportMiddleWare.jwtAuth, appRouter.IntegratedModulesChildMenuRouter);
app.use('/api/v1/admin/vender_lead', passportMiddleWare.jwtAuth, appRouter.VenderleadRouter);
app.use('/api/v1/admin/customer_lead', passportMiddleWare.jwtAuth, appRouter.CustomerleadRouter);
app.use('/api/v1/admin/product_child_category', passportMiddleWare.jwtAuth, appRouter.productChildCategoryRouter);
app.use('/api/v1/admin/license_category', passportMiddleWare.jwtAuth, appRouter.LicenseactegoryRouter);
app.use('/api/v1/admin/constitutions', passportMiddleWare.jwtAuth, appRouter.ConstitutionsRouter);
app.use('/api/v1/admin/master_product', passportMiddleWare.jwtAuth, appRouter.MasterNewProductRouter);
app.use('/api/v1/admin/be_document', passportMiddleWare.jwtAuth, appRouter.BeDocumentRouter);
app.use('/api/v1/admin/product_area', passportMiddleWare.jwtAuth, appRouter.productAreaRouter);
app.use('/api/v1/admin/business_area_teritari', passportMiddleWare.jwtAuth, appRouter.businessAreaTeritariRouter);
app.use('/api/v1/admin/business_area', passportMiddleWare.jwtAuth, appRouter.businessAreaRouter);
app.use('/api/v1/admin/business_area_region', passportMiddleWare.jwtAuth, appRouter.businessArearegionRouter);
app.use('/api/v1/admin/business_area_zone', passportMiddleWare.jwtAuth, appRouter.businessAreazoneRouter);
app.use('/api/v1/admin/lead_category', passportMiddleWare.jwtAuth, appRouter.leadCategoryRouter);
app.use('/api/v1/admin/lead_sub_category', passportMiddleWare.jwtAuth, appRouter.leadsubCategoryRouter);
app.use('/api/v1/admin/license', passportMiddleWare.jwtAuth, appRouter.licenseRouter);
app.use('/api/v1/admin/vender_category', passportMiddleWare.jwtAuth, appRouter.VenderCategoryRouter);
app.use('/api/v1/admin/customer_category', passportMiddleWare.jwtAuth, appRouter.CustomerCategoryRouter);
app.use('/api/v1/admin/license_product', passportMiddleWare.jwtAuth, appRouter.LicenseProductRouter);
app.use('/api/v1/admin/ship_to_party', passportMiddleWare.jwtAuth, appRouter.ShipPartyRouter);

// --- STAFF ROUTES ---
app.use('/api/v1/admin/staff', passportMiddleWare.jwtAuth, appRouter1.staffRouter);
app.use('/api/v1/admin/rake', passportMiddleWare.jwtAuth, appRouter.rakeRouter);
app.use('/api/v1/admin/attributes', passportMiddleWare.jwtAuth, appRouter.attributesRouter);
app.use('/api/v1/admin/rack_point', passportMiddleWare.jwtAuth, appRouter.rakepointRouter);
app.use('/api/v1/admin/leads', passportMiddleWare.jwtAuth, appRouter.leadsRouter);
app.use('/api/v1/admin/logistic_area', passportMiddleWare.jwtAuth, appRouter.logisticRouter);
app.use('/api/v1/admin/delivery_point', passportMiddleWare.jwtAuth, appRouter.shipRouter);
app.use('/api/v1/admin/item_variants', passportMiddleWare.jwtAuth, appRouter.VariantsRouter);
app.use('/api/v1/admin/o_form_versioning', passportMiddleWare.jwtAuth, appRouter.oformversioningRouter);
app.use('/api/v1/admin/o_form_issue', passportMiddleWare.jwtAuth, appRouter.OFormIssueRouter);
app.use('/api/v1/admin/order_so_po', passportMiddleWare.jwtAuth, appRouter.SoPoRouter);
app.use('/api/v1/admin/order_payments', passportMiddleWare.jwtAuth, appRouter.PaymentsRouter);
app.use('/api/v1/admin/order_activity', passportMiddleWare.jwtAuth, appRouter.OrderactivityRouter);

// --- WEBSITE ROUTES ---
app.use('/api/v1/user', appRouter.SignupWebsiteRouter);
app.use('/api/v1/contact_us', appRouter.ContactUSWebsiteRouter);
app.use('/api/v1/book_a_demo', appRouter.bookdemoWebsiteRouter);
app.use('/api/v1/mega_menu', appRouter.MeghaMenuRouter);
app.use('/api/v1/products', appRouter.ProductsRouter);
app.use('/api/v1/brands', appRouter.brandsWebRouter);
app.use('/api/v1/marketers', appRouter.marketersWebRouter);
app.use('/api/v1/expense', passportMiddleWare.jwtAuth, appRouter.ExpenseRouter);
app.use('/api/v1/sub_expense', passportMiddleWare.jwtAuth, appRouter.SubExpenseRouter);
app.use('/api/v1/subscribe', appRouter.emailRouter);
app.use('/api/v1/phone', appRouter.phoneRouter);
app.use('/api/v1/product_child_category', appRouter1.childcategoryRouter);
app.use('/api/v1/admin/menu_plan', passportMiddleWare.jwtAuth, appRouter.menuPlanRouter);
app.use('/api/v1/home', appRouter1.homeRouter);
app.use('/api/v1/wishlist', passportMiddleWare.jwtAuth, appRouter1.wishlistRouter);
app.use('/api/v1/cart', passportMiddleWare.jwtAuth, appRouter1.cartRouter);

// --- CUSTOMER/VENDOR DOCS ---
app.use('/api/v1/admin/be_customer', passportMiddleWare.jwtAuth, appRouter.EntitybasiccostomerRouter);
app.use('/api/v1/admin/be_vendor', passportMiddleWare.jwtAuth, appRouter.EntitybasicvanderRouter);
app.use('/api/v1/admin/customer_be_document', passportMiddleWare.jwtAuth, appRouter.customerBeDocumentRouter);
app.use('/api/v1/admin/vendor_be_document', passportMiddleWare.jwtAuth, appRouter.venderBeDocumentRouter);
app.use('/api/v1/admin/vendor_be_gst_details', passportMiddleWare.jwtAuth, appRouter.venderbegstRouter);
app.use('/api/v1/admin/customer_be_gst_details', passportMiddleWare.jwtAuth, appRouter.customerbegstRouter);
app.use('/api/v1/admin/vendor_business_bank_details', passportMiddleWare.jwtAuth, appRouter.venderbankdetailsRouter);
app.use('/api/v1/admin/customer_business_bank_details', passportMiddleWare.jwtAuth, appRouter.customerbankdetailsRouter);
app.use('/api/v1/admin/vendor_license_details', passportMiddleWare.jwtAuth, appRouter.venderlicenseRouter);
app.use('/api/v1/admin/vendor_warehouse_details', passportMiddleWare.jwtAuth, appRouter.venderwarehouseinfoRouter);
app.use('/api/v1/admin/assigned_item_variant_to_vendor', passportMiddleWare.jwtAuth, appRouter.AssignedItemVendorRouter);
app.use('/api/v1/admin/persons', passportMiddleWare.jwtAuth, appRouter.personsRouter);

// 404 Not Found
// app.use((req, res, next) => {
//   next(createError(404));
// });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Uncaught Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});



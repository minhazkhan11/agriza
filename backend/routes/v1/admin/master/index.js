
const authRouter = require('../auth');
const userRouter = require('./users');
const categoryRouter = require('./category');
const countryRouter = require('./country');
const unitsRouter = require('./units');
const stateRouter = require('./state');
const districtRouter = require('./district');
const tehsilRouter = require('./tehsil');
const pinRouter = require('./pin');
const placeRouter = require('./place');
const productRouter = require('./product');
const productClassRouter = require('./product_Class');
const productCategoryRouter = require('./product_Category');
const EntitybasicRouter = require('../users/business_entity_basic')
const bankdetailsRouter = require('../users/business_bank_details')
const businessinformationRouter = require('../users/business_area_information')
const warehouseinformationRouter = require('../users/warehouse_information')
const begstRouter = require('../users/be_gst_details')
const licensedetailsRouter = require('../users/license_details')
const ownerdetailsRouter = require('../users/owner_details')
const staffcontactsRouter = require('../users/staff_contacts')
const marketersRouter = require('./marketers')
const brandRouter = require('./brand')
const productCatalogueRouter = require('../be_information/product_catalogue')
const menuPlanRouter = require('../settings/menu_plan')
const integratedmodulplansRouter = require('../settings/integrated_module_plans')
const MeghaMenuRouter = require('../website/mega_menu/mega_menu')
const ProductsRouter = require('../website/mega_menu/product')
const brandsWebRouter = require('../website/mega_menu/brans')
const marketersWebRouter = require('../website/mega_menu/marketers')
const supplierRouter = require('./supplier')
const subCategoryRouter = require('./sub_category')
const gst_percentRouter = require('./gst_percent')
const productSubCategoryRouter = require('./product_sub_category');
const productChildCategoryRouter = require('./product_child_category');
const mainMenuRouter = require('../settings/main_menu')
const ProductPriceRouter = require('../be_information/product_price')
const SignupWebsiteRouter = require('../website/signup.website')
const bookdemoWebsiteRouter = require('../website/book_a_demo/bookdemo')
const ContactUSWebsiteRouter = require('../website/contact/contact')
const VenderRouter = require('../vender/vender')
const CustomerRouter = require('../customer/customer')
const CustomerleadRouter = require('../customer/customer_lead')
const VenderleadRouter = require('../vender/vender_lead')
const UqcRouter = require('../master/uqc')
const LicenseactegoryRouter = require('../master/license_category')
const ConstitutionsRouter = require('./constitutions')
const MasterNewProductRouter = require('./master_product')
const BeDocumentRouter = require('../users/be_documents')
const rakeRouter = require('./rake')
const attributesRouter = require('./attributes')
const rakepointRouter = require('./rakepoint')
const leadsRouter = require('./leads')
const emailRouter = require('./advisoremail')
const phoneRouter = require('./advisorphone')
const logisticRouter = require('./logistic_area')
const shipRouter = require('./deliverypoint')
const ShipPartyRouter = require('./ship_to_party')

const productAreaRouter = require('./product_area')
const businessAreaTeritariRouter = require('./business_Area_teritari')
// const smsConfigRouter = require('../smsConfigs/sms_config')
const businessAreaRouter = require('./business_Area')
const businessArearegionRouter = require('./business_Area_Region')
const businessAreazoneRouter = require('./business_Area_Zone')
const leadCategoryRouter = require('./lead_Category')
const leadsubCategoryRouter = require('./lead_subCategory')
const licenseRouter = require('./license')
const VenderCategoryRouter = require('./vender_category')
const CustomerCategoryRouter = require('./customer_category')
const LicenseProductRouter = require('./license_product')
const VariantsRouter = require('./item_variants')
const oformversioningRouter = require('./o_form_versioning')
const OFormIssueRouter = require('./o_form_issue')
const EntitybasiccostomerRouter = require('../users/business_entity_basic.customer')
const EntitybasicvanderRouter = require('../users/business_entity_basic.vander')
const customerbankdetailsRouter = require('../users/business_bank_details')
const venderbankdetailsRouter = require('../users/business_bank_details')
const venderBeDocumentRouter = require('../users/be_documents')
const customerBeDocumentRouter = require('../users/be_documents')
const customerbegstRouter = require('../users/be_gst_details')
const venderbegstRouter = require('../users/be_gst_details')
const SoPoRouter = require('./order_so_po')
const BemodulePlansUpdationRouter = require('./be_module_plans_updation')
const IntegratedModulesMainMenuRouter = require('./integrated_modules_main_menu')
const IntegratedModulesSubMenuRouter = require('./integrated_modules_sub_menu')
const IntegratedModulesChildMenuRouter = require('./integrated_modules_child_menu')
const PaymentsRouter = require('./order_payments')
const OrderactivityRouter = require('./order_activity')

const venderlicenseRouter = require('../users//vendor.license')
const venderwarehouseinfoRouter = require('../users/vender.warehouse_info')
const AssignedItemVendorRouter = require('../users/assigned_item_variant_to_vendor')
const personsRouter = require('../users/persons')
// const OrderInviceRouter=require('./order_invoice')


const ExpenseRouter = require('./expenses')
const SubExpenseRouter = require('./sub_expenses')


module.exports = {
  authRouter,
  userRouter,
  venderlicenseRouter,
  venderwarehouseinfoRouter,
  categoryRouter,
  countryRouter,
  unitsRouter,
  stateRouter,
  districtRouter,
  tehsilRouter,
  pinRouter,
  placeRouter,
  productRouter,
  productClassRouter,
  productCategoryRouter,
  EntitybasicRouter,
  bankdetailsRouter,
  businessinformationRouter,
  warehouseinformationRouter,
  licensedetailsRouter,
  ownerdetailsRouter,
  staffcontactsRouter,
  brandRouter,
  marketersRouter,
  productCatalogueRouter,
  menuPlanRouter,
  supplierRouter,
  integratedmodulplansRouter,
  subCategoryRouter,
  gst_percentRouter,
  productSubCategoryRouter,
  mainMenuRouter,
  ProductPriceRouter,
  SignupWebsiteRouter,
  bookdemoWebsiteRouter,
  ContactUSWebsiteRouter,
  VenderRouter,
  CustomerRouter,
  CustomerleadRouter,
  VenderleadRouter,
  UqcRouter,
  productChildCategoryRouter,
  LicenseactegoryRouter,
  ConstitutionsRouter,
  MasterNewProductRouter,
  MeghaMenuRouter,
  ProductsRouter,
  brandsWebRouter,
  BeDocumentRouter,
  productAreaRouter,
  businessAreaTeritariRouter,
  businessAreaRouter,
  businessArearegionRouter,
  businessAreazoneRouter,
  leadCategoryRouter,
  leadsubCategoryRouter,
  licenseRouter,
  VenderCategoryRouter,
  CustomerCategoryRouter,
  LicenseProductRouter,
  rakeRouter,
  attributesRouter,
  rakepointRouter,
  leadsRouter,
  emailRouter,
  phoneRouter,
  logisticRouter,
  shipRouter,
  VariantsRouter,
  begstRouter,
  ShipPartyRouter,
  oformversioningRouter,
  EntitybasiccostomerRouter,
  EntitybasicvanderRouter,
  OFormIssueRouter,
  customerbankdetailsRouter,
  venderbankdetailsRouter,
  venderBeDocumentRouter,
  customerBeDocumentRouter,
  customerbegstRouter,
  venderbegstRouter,
  SoPoRouter,
  BemodulePlansUpdationRouter,
  IntegratedModulesMainMenuRouter,
  IntegratedModulesSubMenuRouter,
  IntegratedModulesChildMenuRouter,
  PaymentsRouter,
  OrderactivityRouter,
  AssignedItemVendorRouter,
  personsRouter,
  // OrderInviceRouter
  SubExpenseRouter,
  ExpenseRouter,
  marketersWebRouter,
};

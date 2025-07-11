"use strict";
const { ErrorHandler } = require("../../../../../lib/utils");
const User = require("../../../../../models/users");
const Bank = require("../../../../../models/be_bank_details");
const Product = require('../../../../../models/product_area');
const Business = require('../../../../../models/business_area');
const Warehouse = require('../../../../../models/be_warehouse_information');
const Licens = require('../../../../../models/license_details');
const Attachments = require('../../../../../models/attachments');
const Entitybasic = require('../../../../../models/be_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const user = await User.where({ id: req.user.id }).fetch({ require: false });
    const userData = user ? user.toJSON() : null;

    // Initialize variables with default values
    let full_name = !!userData?.full_name;
    let bank_details = false;
    let document = false;
    let product_area = false;
    let business_area = false;
    let warehouse = false;
    let license = false;
    let basicinformation = false;
    let authorised = false;

    const bankInformations = await Bank.where({ be_information_id: req.user.id }).fetch({ require: false });

    if (bankInformations) {
      const bankData = bankInformations.toJSON();

      // Update values based on learnerData
      bank_details = !!bankData.be_information_id;
   
    }

    const products = await Product.where({
      added_by: req.user.id,
      active_status: constants.activeStatus.active
  }).fetch({require: false });
  if (products) {
    const productsData = products.toJSON();
    product_area = !!productsData.added_by;
  }

  const Auth = await User.where({
    added_by: req.user.id,
    active_status: constants.activeStatus.active
}).fetch({require: false });
if (Auth) {
  const AuthData = Auth.toJSON();
  authorised = !!AuthData.added_by;
}

  const business = await Business.where({
    added_by: req.user.id,
    active_status: constants.activeStatus.active
}).fetch({require: false });
if (business) {
  const businessData = business.toJSON();
  business_area = !!businessData.added_by;
}

const warehouses = await Warehouse.where({
    added_by: req.user.id,
    active_status: constants.activeStatus.active
}).fetch({require: false });
if (warehouses) {
  const warehousesData = warehouses.toJSON();
  warehouse = !!warehousesData.added_by;
}
const basicinformations = await Entitybasic.where({
  added_by: req.user.id,
  active_status: constants.activeStatus.active
}).fetch({require: false });
if (basicinformations) {
const basicinformationsData = basicinformations.toJSON();
basicinformation = !!basicinformationsData.added_by;
}

const licenses = await Licens.where({
    added_by: req.user.id,
    active_status: constants.activeStatus.active
}).fetch({require: false });
if (licenses) {
  const licensesData = licenses.toJSON();
  license = !!licensesData.added_by;
}

   const attachments = await Attachments.where({
       entity_id:userData.id,
       active_status: constants.activeStatus.active
     })
       .fetch({ require: false });
    if (attachments) {
      const licensesData = attachments.toJSON();
      document = !!licensesData.added_by;
    }

   return res.json({ basicinformation, authorised ,bank_details ,document,product_area ,business_area ,warehouse ,license });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

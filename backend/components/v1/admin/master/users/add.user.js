'use strict';

const { ErrorHandler, sendGrid } = require('../../../../../lib/utils');
const Category = require('../../../../../models/business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const CategoryBody = req.body.Category;

     // Check if phone or email already exists
     const CategoryCheck = await Category
     .query((qb) => {
       qb.where(function () {
         this.where('phone', CategoryBody.phone)
           .orWhere('email', CategoryBody.email)
       });
       qb.orderBy('created_at', 'desc');
     })
     .fetch({ require: false, columns: ['id', 'phone', 'email', 'active_status'] });    
   
       const CategoryCheckData = CategoryCheck ? CategoryCheck.toJSON() : {};
   
       if (CategoryCheck && CategoryCheckData.active_status === 'active')
         return res.serverError(400, ErrorHandler('Email or Phone has already been taken'));
   
       if (CategoryCheck && CategoryCheckData.active_status === 'inactive')
         return res.serverError(400, ErrorHandler(constants.error.auth.inactiveCategory));

    // Save new Category
    const Category = await new Category(CategoryBody).save();

    return res.success({ Categorys:Category });

  } catch (error) {
    // Handle any other errors
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

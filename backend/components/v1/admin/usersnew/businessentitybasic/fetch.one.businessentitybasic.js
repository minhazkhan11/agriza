'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Attachments = require('../../../../../models/attachments');
const Entitybasic = require('../../../../../models/be_information');
const { constants } = require('../../../../../config');
const Category = require('../../../../../models/business_category');
const Integrated_module_plans = require('../../../../../models/integrated_module_plans');

module.exports = async (req, res, next) => {
  try {
    const be_information = await Entitybasic.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id });
    }).fetch({
      require: false,
      withRelated: [
        {
          'constitutions_id': function (query) {
            query.select('id', 'name');
          }
        },
        {
          'postal_pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'gst_pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'postal_place_id': function (query) {
            query.select('id', 'place_name');
          }
        },
        {
          'gst_place_id': function (query) {
            query.select('id', 'place_name');
          }
        },
        {
          'logo': function (query) {
            query.where('active_status', constants.activeStatus.active); // Fetch only active logos
          }
        }
      ]
    });

    if (!be_information) {
      return res.serverError(400, 'Invalid be_information details');
    }


    const entityData = be_information.toJSON();

    if (entityData.module_id) {
      const integratedModulePlan = await Integrated_module_plans.where('id', entityData.module_id).fetch({ require: false });
      if (integratedModulePlan) {
        entityData.plan_name = integratedModulePlan.get('plan_name');
      } else {
        entityData.plan_name = null; // In case no plan is found
      }
    }


    if (entityData.business_category_ids) {
      const categoryIds = Array.isArray(entityData.business_category_ids)
        ? entityData.business_category_ids
        : JSON.parse(entityData.business_category_ids);

      entityData.business_categories = categoryIds.length
        ? await Category.where('id', 'IN', categoryIds)
          .fetchAll({ require: false })
          .then(categories =>
            categories.map(category => ({
              id: category.get('id'),
              name: category.get('category_name')
            }))
          )
        : [];
      delete entityData.business_category_ids;
      delete entityData.module_id;
    }

    entityData.logo = be_information.related('logo') && be_information.related('logo').toJSON()
      ? processAttachment(be_information.related('logo').toJSON())
      : null;

    return res.success({ be_information: entityData });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Lead = require('../../../../../models/lead');
const Leadinfo = require('../../../../../models/lead_info');
const constants = require('../../../../../config/constants');
const Rakepoint = require('../../../../../models/rakepoint');
const DiscreetMarketer = require('../../../../../models/marketers');
const ProductCategory = require('../../../../../models/product_category');
const ProductSubCategory = require('../../../../../models/product_sub_category');
const ProductChildCategory = require('../../../../../models/Product_child_category');

module.exports = async (req, res) => {
  try {
    // Fetch Lead details
    const leads = await Lead.query(qb => {
      qb.whereIn('active_status', [
        constants.activeStatus.active,
        constants.activeStatus.inactive
      ])
        .andWhere({ id: req.params.id });
    }).fetch({
      require: false,
      withRelated: [
        { 'r_office_pincode_id': qb => qb.select('id', 'pin_code') },
        { 'r_office_place_id': qb => qb.select('id', 'place_name') },
        { 'postal_office_pincode_id': qb => qb.select('id', 'pin_code') },
        { 'postal_office_place_id': qb => qb.select('id', 'place_name') },
        { 'lead_category_id': qb => qb.select('id', 'name') },
        { 'lead_subcategory_id': qb => qb.select('id', 'name') },
        { 'type_of_organization': qb => qb.select('id', 'name') }
      ]
    });

    // if (!leads) {
    //   return res.status(400).json({ error: 'Invalid lead details' });
    // }

    let leadsJson = leads.toJSON();

    // Helper function to safely fetch related data
    const fetchRelatedData = async (Model, field, columns) => {
      if (!leadsJson[field] || leadsJson[field].length === 0) return [];
      return (await Model.query(qb => qb.whereIn('id', leadsJson[field])).fetchAll({
        require: false,
        columns
      }))?.toJSON() || [];
    };

    // Fetch related data
    leadsJson.product_category_ids = await fetchRelatedData(ProductCategory, 'product_category_ids', ['id', 'category_name']);
    leadsJson.product_sub_category_ids = await fetchRelatedData(ProductSubCategory, 'product_sub_category_ids', ['id', 'product_sub_category_name']);
    leadsJson.product_child_category_ids = await fetchRelatedData(ProductChildCategory, 'product_child_category_ids', ['id', 'product_child_category_name']);
    leadsJson.discreet_marketer_id = await fetchRelatedData(DiscreetMarketer, 'discreet_marketer_id', ['id', 'marketer_name']);
    leadsJson.rakepoint_id = await fetchRelatedData(Rakepoint, 'rakepoint_id', ['id', 'rack_point']);

    return res.status(200).json({
      lead: leadsJson
    });

  } catch (error) {
    console.error('Error fetching lead info:', error);
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

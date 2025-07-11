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
    // Fetch all leads
    const leads = await Lead.query(qb => {
      qb.whereIn('active_status', [
        constants.activeStatus.active,
        constants.activeStatus.inactive
      ]);
    }).fetchAll({
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

    if (!leads || leads.length === 0) {
      return res.status(400).json({ error: 'Invalid lead details' });
    }

    let leadsJson = leads.toJSON();

    // Helper function to fetch related data
    const fetchRelatedData = async (Model, field, columns) => {
      const ids = leadsJson.flatMap(lead => lead[field] || []);
      if (ids.length === 0) return [];

      const data = await Model.where('id', 'IN', ids).fetchAll({ require: false, columns });
      return data ? data.toJSON() : [];
    };

    // Fetch related data for all leads
    const productCategories = await fetchRelatedData(ProductCategory, 'product_category_ids', ['id', 'category_name']);
    const productSubCategories = await fetchRelatedData(ProductSubCategory, 'product_sub_category_ids', ['id', 'product_sub_category_name']);
    const productChildCategories = await fetchRelatedData(ProductChildCategory, 'product_child_category_ids', ['id', 'product_child_category_name']);
    const discreetMarketers = await fetchRelatedData(DiscreetMarketer, 'discreet_marketer_id', ['id', 'marketer_name']);
    const rakepoints = await fetchRelatedData(Rakepoint, 'rakepoint_id', ['id', 'rack_point']);

    // Map fetched related data back to leads
    leadsJson = leadsJson.map(lead => ({
      ...lead,
      product_category_ids: productCategories.filter(pc => lead.product_category_ids?.includes(pc.id)),
      product_sub_category_ids: productSubCategories.filter(psc => lead.product_sub_category_ids?.includes(psc.id)),
      product_child_category_ids: productChildCategories.filter(pcc => lead.product_child_category_ids?.includes(pcc.id)),
      discreet_marketer_id: discreetMarketers.find(dm => dm.id === lead.discreet_marketer_id) || null,
      rakepoint_id: rakepoints.find(rp => rp.id === lead.rakepoint_id) || null
    }));

    return res.status(200).json({
      lead: leadsJson
    });

  } catch (error) {
    console.error('Error fetching lead info:', error);
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

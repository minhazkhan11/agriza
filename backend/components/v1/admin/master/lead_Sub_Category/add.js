'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Lead_subCategory = require('../../../../../models/lead_sub_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
  
      const { lead_sub_category, lead_category_id } = req.body;
        const added_by = req.user.id;
    
        // **Prepare Data for Bulk Insert**
        const leadData = lead_sub_category.map(lead => ({
          name: lead.name,
          lead_category_id: lead_category_id, 
          description: lead.description,
          added_by,
        }));
    
        // **Bulk Insert (Bookshelf.js)**
        const insertedlead = await Lead_subCategory.collection(leadData).invokeThen('save');

    return res.success({ lead_sub_category : insertedlead});
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
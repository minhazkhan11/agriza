'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Leadinfo = require('../../../../../models/lead_info');

module.exports = async (req, res) => {
  try {
    const { lead_id, leadinfo } = req.body.lead;
    let leadinfoNew = [];

    // Convert leadinfo into the correct format dynamically
    leadinfo.forEach(item => {
      let key = Object.keys(item)[0]; 
      leadinfoNew.push({ 
        product_master_id: key, 
        total_sale: item[key] 
      });
    });

    const added_by = req.user.id;

    // Ensure product_master_id is dynamically assigned
    const leadinfoData = leadinfoNew.map(lead => ({
      lead_id,
      product_master_id: lead.product_master_id, 
      total_sale: lead.total_sale,
      added_by,
    }));


        // save
        const inserted = await Leadinfo.collection(leadinfoData).invokeThen('save');

    return res.success({ leadinfoData : inserted });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

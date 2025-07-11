'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
   
     // **Fetch License Details**
        const attributes = await Attributes.query(qb => {
          qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
            .andWhere({ id: req.params.id })
            .orderBy('created_at', 'asc');
        }).fetch({ require: false  });
    
        if (!attributes) {
            return res.status(404).json({ success: false, message: 'attributes not found' });
          }

     const attriData = attributes.toJSON();

   // **Fetch License Products**
       const variants = await Variants.query(qb => {
         qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
           .andWhere('attribute_id', attriData.id)
           .orderBy('created_at', 'asc');
       }).fetchAll({ require: false });
       
    attriData.variant_details = variants ? variants.toJSON() : [];

    return res.success({ attributes : attriData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.attributesdetails;   
    let added_by = req.user.id;

    const requestData = {
      attributesDetails: {
        attribute_name: body.attribute_name,
        added_by: added_by
      },
     variantsDetails: body.variantsDetails || []
    };

   
    // Save attributes Details
       const attributesdetails = await new Attributes(requestData.attributesDetails).save();
   
       // Save variant Details in a loop
       for (const variants of requestData.variantsDetails) {
         await new Variants({
          attribute_id: attributesdetails.id, 
           variant: variants.variant,
           added_by: added_by
         }).save();
       }

       const attriData = attributesdetails.toJSON();

 // Fetch variant Details Separately
    const variDetails = await Variants.where({ attribute_id: attriData.id }).fetchAll();
    attriData.variant_details = variDetails ? variDetails.toJSON() : [];

    return res.success({ attributes : attriData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
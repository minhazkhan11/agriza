// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Lead = require('../../../../../models/lead');

// module.exports = async (req, res) => {
//   try {
//     const userBody = req.body?.lead;
//     if (!userBody) {
//       return res.status(400).json({ error: 'Lead data is required' });
//     }

//     const added_by = req.user?.id;
//     if (!added_by) {
//       return res.status(401).json({ error: 'Unauthorized: User ID is missing' });
//     }

//     // Ensure nearest_rack_point_id and discreet_marketer_id are arrays
//     const nearestRackPoints = Array.isArray(userBody.nearest_rack_point_id)
//       ? userBody.nearest_rack_point_id
//       : userBody.nearest_rack_point_id ? [userBody.nearest_rack_point_id] : [];

//     const discreetMarketerIds = Array.isArray(userBody.discreet_marketer_id)
//       ? userBody.discreet_marketer_id
//       : userBody.discreet_marketer_id ? [userBody.discreet_marketer_id] : [];

//     // Prepare User Data
//     const userData = {
//       lead_category_id: userBody.lead_category_id,
//       lead_subcategory_id: userBody.lead_subcategory_id,
//       is_bussiness: userBody.is_bussiness || false,
//       gst_number: userBody.gst_number || null,
//       pan_number: userBody.pan_number || null,
//       type_of_organization: userBody.type_of_organization || null,
//       business_name: userBody.business_name || null,
//       r_office_address: userBody.r_office_address || null,
//       r_office_pincode_id: userBody.r_office_pincode_id || null,
//       r_office_place_id: userBody.r_office_place_id || null,
//       postal_office_address: userBody.postal_office_address || null,
//       postal_office_pincode_id: userBody.postal_office_pincode_id || null,
//       postal_office_place_id: userBody.postal_office_place_id || null,
//       year_of_establishment: userBody.year_of_establishment || null,
//       nearest_rack_point_id: JSON.stringify(nearestRackPoints),
//       product_category_id: userBody.product_category_id || null,
//       discreet_marketer_id: JSON.stringify(discreetMarketerIds),
//       name_of_dealing_person: userBody.name_of_dealing_person || null,
//       mobile_number: userBody.mobile_number,
//       whatsapp_number: userBody.whatsapp_number || null,
//       email: userBody.email || null,
//       alternative_number: userBody.alternative_number || null,
//       fertilizer_license_number: userBody.fertilizer_license_number || null,
//       pesticide_license_number: userBody.pesticide_license_number || null,
//       seed_license_number: userBody.seed_license_number || null,
//       msme_udyam_registration_number: userBody.msme_udyam_registration_number || null,
//       added_by,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };

//     // Save Lead Data
//     const lead = await Lead.forge(userData).save();

//     return res.status(201).json({
//       lead: lead,
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: ErrorHandler(error) });
//   }
// };
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Lead = require('../../../../../models/lead');

module.exports = async (req, res) => {
  try {
    const userBody = req.body?.lead;
    if (!userBody) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    const added_by = req.user?.id;
    if (!added_by) {
      return res.status(401).json({ error: 'Unauthorized: User ID is missing' });
    }

    // Ensure nearest_rack_point_id and discreet_marketer_id are arrays
    const nearestRackPoints = Array.isArray(userBody.nearest_rack_point_id)
      ? userBody.nearest_rack_point_id
      : userBody.nearest_rack_point_id ? [userBody.nearest_rack_point_id] : [];

    const CategoryIds = Array.isArray(userBody.product_category_ids)
      ? userBody.product_category_ids
      : userBody.product_category_ids ? [userBody.product_category_ids] : [];

    const SubCategoryIds = Array.isArray(userBody.product_sub_category_ids)
      ? userBody.product_sub_category_ids
      : userBody.product_sub_category_ids ? [userBody.product_sub_category_ids] : [];

    const ChildCategoryIds = Array.isArray(userBody.product_child_category_ids)
      ? userBody.product_child_category_ids
      : userBody.product_child_category_ids ? [userBody.product_child_category_ids] : [];

    // Determine license fields based on business_license_type
    const businessLicenseType = userBody.business_license_type || null;
    let wholesalerFields = {};
    let retailerFields = {};

    if (businessLicenseType === 'wholesaler' || businessLicenseType === 'both') {
      wholesalerFields = {
        wholesaler_fertilizer_license_number: userBody.wholesaler_fertilizer_license_number || null,
        wholesaler_fms_id: userBody.wholesaler_fms_id || null,
      };
    }

    if (businessLicenseType === 'retailer' || businessLicenseType === 'both') {
      retailerFields = {
        retailer_fertilizer_license_number: userBody.retailer_fertilizer_license_number || null,
        retailer_fms_id: userBody.retailer_fms_id || null,
      };
    }

    // Prepare User Data
    const userData = {
      lead_category_id: userBody.lead_category_id !== "" ? userBody.lead_category_id : null,
      lead_subcategory_id: userBody.lead_subcategory_id !== "" ? userBody.lead_subcategory_id : null,
      is_bussiness: userBody.is_bussiness || false,
      gst_number: userBody.gst_number || null,
      pan_number: userBody.pan_number || null,
      type_of_organization: userBody.type_of_organization || null,
      business_name: userBody.business_name || null,
      r_office_address: userBody.r_office_address || null,
      r_office_pincode_id: userBody.r_office_pincode_id !== "" ? userBody.r_office_pincode_id : null,
      r_office_place_id: userBody.r_office_place_id !== "" ? userBody.r_office_place_id : null,

      postal_office_address: userBody.postal_office_address || null,
      postal_office_pincode_id: userBody.postal_office_pincode_id !== "" ? userBody.postal_office_pincode_id : null,
      postal_office_place_id: userBody.postal_office_place_id !== "" ? userBody.postal_office_place_id : null,
      year_of_establishment: userBody.year_of_establishment !== "" ? userBody.year_of_establishment : null,
      nearest_rack_point_id: JSON.stringify(nearestRackPoints),
      product_category_ids: JSON.stringify(CategoryIds),
      product_sub_category_ids: JSON.stringify(SubCategoryIds),
      product_child_category_ids: JSON.stringify(ChildCategoryIds),
      discreet_marketer_id: JSON.stringify(userBody.discreet_marketer_id || []),
      name_of_dealing_person: userBody.name_of_dealing_person || null,
      mobile_number: userBody.mobile_number !== "" ? userBody.mobile_number : null,
      whatsapp_number: userBody.whatsapp_number || null,
      email: userBody.email || null,
      alternative_number: userBody.alternative_number || null,
      business_license_type: businessLicenseType,
      pesticide_license_number: userBody.pesticide_license_number || null,
      seed_license_number: userBody.seed_license_number || null,
      msme_udyam_registration_number: userBody.msme_udyam_registration_number || null,
      added_by,
      created_at: new Date(),
      updated_at: new Date(),
      ...wholesalerFields,
      ...retailerFields,
    };

    // Save Lead Data
    const lead = await Lead.forge(userData).save();

    return res.status(201).json({
      lead: lead,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

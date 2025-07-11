// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Lead = require('../../../../../models/lead');
// const Leadinfo = require('../../../../../models/lead_info');
// const constants = require('../../../../../config/constants');

// module.exports = async (req, res) => {
//   try {
//     const userBody = req.body?.lead;
//     if (!userBody || !userBody.id) {
//       return res.status(400).json({ error: 'Lead ID and data are required' });
//     }

//     const leadId = userBody.id;
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

//     // Prepare User Data for Update
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
//       updated_at: new Date(),
//     };

//     // Update Lead Data
//     const lead = await Lead.where({ id: leadId }).save(userData, { patch: true });

//     // Update LeadInfo Data if available
//     if (userBody.product_master_id && userBody.total_sale) {
//       const leadInfoData = {
//         product_master_id: userBody.product_master_id,
//         total_sale: userBody.total_sale,
//         updated_at: new Date(),
//       };

//       await Leadinfo.where({ lead_id: leadId }).save(leadInfoData, { patch: true });
//     }

//     return res.status(200).json({
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
const Leadinfo = require('../../../../../models/lead_info');

module.exports = async (req, res) => {
  try {
    const { lead } = req.body;
    if (!lead?.id) return res.status(400).json({ error: 'Lead ID is required' });

    const added_by = req.user?.id;
    if (!added_by) return res.status(401).json({ error: 'Unauthorized' });

    // Update only provided fields
    const updateFields = { updated_at: new Date() };
    Object.keys(lead).forEach((key) => {
      if (lead[key] !== undefined) {
        updateFields[key] = Array.isArray(lead[key]) ? JSON.stringify(lead[key]) : lead[key];
      }
    });

    console.log("Updating Lead with:", updateFields);
    const updatedLead = await Lead.where({ id: lead.id }).save(updateFields, { patch: true });

    // Update LeadInfo if available
    if (lead.product_master_id && lead.total_sale) {
      await Leadinfo.where({ lead_id: lead.id }).save(
        { product_master_id: lead.product_master_id, total_sale: lead.total_sale, updated_at: new Date() },
        { patch: true }
      );
    }

    return res.status(200).json({ lead: updatedLead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

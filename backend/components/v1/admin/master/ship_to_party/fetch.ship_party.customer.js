// 'use strict';

// const Deliverypoint = require('../../../../../models/deliverypoint');
// const BeAssigned = require('../../../../../models/assigned_to');
// const User = require('../../../../../models/users');
// const Gst = require('../../../../../models/be_gst_details');
// const { ErrorHandler } = require('../../../../../lib/utils');

// module.exports = async (req, res) => {
//   try {
//     const { be_id } = req.params;

//     if (!be_id) {
//       return res.status(400).json({ success: false, message: "Missing be_id in request params." });
//     }

//     // Step 1: Get assigned users (customers) for this be_information
//     const assignment = await BeAssigned
//       .where({ be_information_id: be_id })
//       .fetchAll({ require: false });

//     if (!assignment) {
//       return res.status(404).json({ success: false, message: "No assigned customer for this be_information." });
//     }

//     const customerIds = assignment.toJSON().map(assign => assign.user_id);

//     // Step 2: Fetch ship-to-party where added_by matches any of the customer_ids
//     const deliveryPoints = await Deliverypoint
//       .where('added_by', 'in', customerIds)
//       .fetchAll({ require: false });

//     const shipToParty = deliveryPoints?.toJSON?.() || [];

//     // Step 3: Filter out customerIds that have no ship_to_party records
//     const validCustomerIds = [...new Set(shipToParty.map(p => p.added_by))];

//     const filteredCustomerIds = customerIds.filter(id => validCustomerIds.includes(id));

//     // Step 4: Fetch customer details for valid customers
//     const customers = await User
//       .where('id', 'in', filteredCustomerIds)
//       .fetchAll({ require: false });

//     const filteredCustomers = customers?.toJSON?.() || [];

//     // Step 5: Fetch GST details for the given be_information ID
//     const gstRecords = await Gst
//       .where({ be_information_id: be_id })
//       .fetchAll({ require: false });

//     const gstData = gstRecords?.toJSON?.() || [];

//     return res.json({
//       success: true,
//       be_id,
//       customer_ids: filteredCustomerIds,
//       customers: filteredCustomers,
//       ship_to_party: shipToParty,
//       gst_list: gstData
//     });

//   } catch (error) {
//     console.error("Error fetching ship to party:", error);
//     return res.status(500).json({ success: false, error: ErrorHandler(error) });
//   }
// };
'use strict';

const Deliverypoint = require('../../../../../models/deliverypoint');
const GST = require('../../../../../models/be_gst_details');
const { ErrorHandler } = require('../../../../../lib/utils');
const constants = require('../../../../../config/constants');

module.exports = async (req, res) => {
  try {
    const { be_id } = req.params;

    if (!be_id) {
      return res.status(400).json({ success: false, message: "Missing be_id in request params." });
    }

    const assignment = await GST
      .where({ be_information_id: be_id })
      .fetchAll({ require: false });

    if (!assignment) {
      return res.status(404).json({ success: false, message: "No assigned customer for this be_information." });
    }

    const customerIds = assignment.toJSON().map(assign => assign.id);

    // const deliveryPoints = await Deliverypoint
    // qb.whereIn('added_by', customerIds)
    //   .whereIn('active_status', [
    //     constants.activeStatus.active,
    //     constants.activeStatus.inactive
    //   ]).fetchAll({
    //     require: false,
    //     withRelated: ['gst_id', 'customer']
    //   });

    const deliveryPoints = await Deliverypoint.query((qb) => {
      qb.whereIn('added_by', customerIds)
        .whereIn('active_status', [
          constants.activeStatus.active,
          constants.activeStatus.inactive
        ]);
    }).fetchAll({
      require: false,
      withRelated: ['gst_id', 'customer']
    });


    const shipToParty = deliveryPoints?.toJSON?.() || [];


    const validCustomerIds = [...new Set(shipToParty.map(p => p.added_by))];

    return res.json({
      success: true,
      be_id,
      customer_ids: validCustomerIds,
      ship_to_party: shipToParty
    });

  } catch (error) {
    console.error("Error fetching ship to party:", error);
    return res.status(500).json({ success: false, error: ErrorHandler(error) });
  }
};

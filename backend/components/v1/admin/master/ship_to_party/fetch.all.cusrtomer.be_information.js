// // const GstPerson = require('../../../../../models/be_gst_person_assigned');
// // const Gst = require('../../../../../models/be_gst_details'); // GST details model
// // const BeIdentityTable = require('../../../../../models/be_identity_table');
// // const BeInformation = require('../../../../../models/be_information');
// // const User = require('../../../../../models/users');
// // const BeAssigned = require('../../../../../models/assigned_to');

// // module.exports = async (req, res) => {
// //   try {
// //     // Step 1: Fetch `be_information_id` from `assigned_to` where `user_id = req.user.id`
// //     const user_id = req.user.id;
// //     console.log(user_id, "user_id");

// //     const assignedRecords = await BeAssigned
// //       .where({ user_id: user_id })
// //       .fetchAll({ columns: ['be_information_id'], require: false });
// //     const assignedBeIds = assignedRecords ? assignedRecords.toJSON().map(record => record.be_information_id) : [];

// //     if (assignedBeIds.length === 0) {
// //       return res.json({ success: true, data: [] });
// //     }

// //     // Step 2: Fetch `BeIdentityTable` records where `entity_type = 'customer'` and `be_id` matches assignedBeIds
// //     const customerEntities = await BeIdentityTable
// //       .where('be_id', 'IN', assignedBeIds)
// //       .where({ entity_type: 'customer' })
// //       .fetchAll({ columns: ['be_id', 'added_by'], require: false });

// //     const customers = customerEntities ? customerEntities.toJSON() : [];

// //     if (customers.length === 0) {
// //       return res.json({ success: true, data: [] });
// //     }

// //     const addedByIds = [...new Set(customers.map(entity => entity.added_by))]; // Unique `added_by` IDs

// //     // Step 3: Fetch active `BeInformation` where `id` matches `be_id` from `BeIdentityTable`
// //     const beInformationRecords = await BeInformation
// //       .where('id', 'IN', assignedBeIds)
// //       .where('active_status', 'active')
// //       .fetchAll({ columns: ['id', 'pan_number', 'business_name'], require: false });

// //     const beInformation = beInformationRecords ? beInformationRecords.toJSON() : [];
// //     const beInfoMap = Object.fromEntries(beInformation.map(info => [info.id, info])); // Map for fast lookup

// //     // Step 4: Fetch user details for `added_by` IDs
// //     const usersRecords = await User
// //       .where('id', 'IN', addedByIds)
// //       .fetchAll({ columns: ['id', 'full_name'], require: false });

// //     const users = usersRecords ? usersRecords.toJSON() : [];
// //     const usersMap = Object.fromEntries(users.map(user => [user.id, user])); // Map for fast lookup

// //     // Step 5: Fetch GST Person details (get `id` from `GstPerson`)
// //     const gstPersonRecords = await GstPerson
// //       .where('user_id', 'IN', addedByIds)
// //       .fetchAll({ columns: ['id', 'user_id', 'gst_detail_id'], require: false });

// //     const gstPersons = gstPersonRecords ? gstPersonRecords.toJSON() : [];
// //     const gstPersonMap = Object.fromEntries(gstPersons.map(gst => [gst.user_id, gst.gst_detail_id])); // Map for fast lookup

// //     // Step 6: Fetch GST numbers using IDs from `GstPerson`
// //     const gstPersonIds = gstPersons.map(gst => gst.gst_detail_id);
// //     console.log(gstPersonIds, "gstPersonIds");


// //     const gstRecords = await Gst
// //       .where('id', 'IN', gstPersonIds)
// //       .fetchAll({ columns: ['id', 'gst_number'], require: false });
// //     console.log("Fetched GST Records:", gstRecords);

// //     const gstData = gstRecords ? gstRecords.toJSON() : [];


// //     const gstMap = Object.fromEntries(gstData.map(gst => [gst.id, gst.gst_number]));
// //     // Map for fast lookup

// //     // Step 7: Merge data
// //     const mergedData = customers.map(customer => {
// //       const beInfo = beInfoMap[customer.be_id] || null;
// //       const addedByUser = usersMap[customer.added_by] || null;
// //       const gstPersonId = gstPersonMap[customer.added_by] || null;
// //       const gstNumber = gstPersonId ? gstMap[gstPersonId] : null;

// //       return {
// //         customer: addedByUser ? { id: addedByUser.id, full_name: addedByUser.full_name } : null,
// //         gst_data: gstNumber ? { id: gstPersonId, gst_number: gstNumber } : null,
// //         be_information: beInfo
// //       };
// //     });

// //     return res.json({ success: true, data: mergedData });

// //   } catch (error) {
// //     console.error("Error fetching customer information:", error);
// //     return res.status(500).json({ success: false, error: "Internal server error" });
// //   }
// // };

// 'use strict';

// const Gst = require('../../../../../models/be_gst_details');
// const BeIdentityTable = require('../../../../../models/be_identity_table');
// const BeInformation = require('../../../../../models/be_information');
// const User = require('../../../../../models/users');

// module.exports = async (req, res) => {
//   try {
//     const user_id = req.user.id;
//     console.log("STEP 1: user_id =", user_id);

//     const customerEntities = await BeIdentityTable
//       .where({ added_by: user_id, entity_type: 'customer' })
//       .fetchAll({ columns: ['be_id', 'added_by'], require: false });

//     const customers = customerEntities ? customerEntities.toJSON() : [];
//     console.log("STEP 2: customerEntities =", customers);

//     if (customers.length === 0) {
//       console.log("No customer entities found.");
//       return res.json({ success: true, data: [] });
//     }

//     const beIds = [...new Set(customers.map(entity => entity.be_id))];
//     console.log("STEP 3: Unique beIds =", beIds);

//     const beInformationRecords = await BeInformation
//       .where('id', 'IN', beIds)
//       .where('active_status', 'active')
//       .fetchAll({ columns: ['id', 'pan_number', 'business_name'], require: false });

//     const beInformation = beInformationRecords ? beInformationRecords.toJSON() : [];
//     console.log("STEP 4: beInformation =", beInformation);

//     const beInfoMap = Object.fromEntries(beInformation.map(info => [info.id, info]));


//     const userRecord = await User
//       .where({ id: user_id })
//       .fetch({ columns: ['id', 'full_name'], require: false });

//     const user = userRecord ? userRecord.toJSON() : null;
//     console.log("STEP 5: user =", user);

//     const gstRecords = await Gst
//       .where('be_information_id', 'IN', beIds)
//       .fetchAll({ columns: ['id', 'gst_number', 'legal_name', 'trade_name', 'address_of_principal_place', 'be_information_id'], require: false });

//     const gstData = gstRecords ? gstRecords.toJSON() : [];
//     console.log("STEP 6: gstData =", gstData);

//     const gstMap = {};
//     gstData.forEach(gst => {
//       gstMap[gst.be_information_id] = gst;
//     });

//     const mergedData = customers.map(customer => {
//       const beInfo = beInfoMap[customer.be_id] || null;
//       const gst = gstMap[customer.be_id] || null;

//       return {
//         customer: user ? { id: user.id, full_name: user.full_name } : null,
//         gst_data: gst ? { id: gst.id, gst_number: gst.gst_number, legal_name: gst.legal_name, trade_name: gst.trade_name, address_of_principal_place: gst.address_of_principal_place } : null,
//         be_information: beInfo
//       };
//     });

//     console.log("STEP 7: Final mergedData =", mergedData);

//     return res.json({ success: true, data: mergedData });

//   } catch (error) {
//     console.error("  Error fetching customer information:", error);
//     return res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };
'use strict';

const Gst = require('../../../../../models/be_gst_details');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const BeInformation = require('../../../../../models/be_information');
const User = require('../../../../../models/users');

module.exports = async (req, res) => {
  try {
    const user_id = req.user.id;

    const customerEntities = await BeIdentityTable
      .where({ added_by: user_id, entity_type: 'customer' })
      .fetchAll({ columns: ['be_id', 'added_by'], require: false });

    const customers = customerEntities ? customerEntities.toJSON() : [];

    if (customers.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const beIds = [...new Set(customers.map(entity => entity.be_id))];

    const beInformationRecords = await BeInformation
      .where('id', 'IN', beIds)
      .where('active_status', 'active')
      .fetchAll({ columns: ['id', 'business_name'], require: false });

    const beInformation = beInformationRecords ? beInformationRecords.toJSON() : [];
    const beInfoMap = Object.fromEntries(beInformation.map(info => [info.id, info]));

    const gstRecords = await Gst
      .where('be_information_id', 'IN', beIds)
      .fetchAll({ columns: ['id', 'gst_number', 'be_information_id'], require: false });

    const gstData = gstRecords ? gstRecords.toJSON() : [];

    const simplifiedData = [];

    gstData.forEach(gst => {
      const beId = gst.be_information_id;
      const customer = customers.find(c => c.be_id === beId);
      if (customer) {
        simplifiedData.push({
          customer_id: customer.added_by,
          id: gst.id,
          gst_number: gst.gst_number,
          business_name: beInfoMap[beId]?.business_name || null
        });
      }
    });

    return res.json({ success: true, data: simplifiedData });

  } catch (error) {
    console.error("Error fetching customer GST info:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

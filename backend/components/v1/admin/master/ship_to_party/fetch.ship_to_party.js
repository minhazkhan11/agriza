
// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Deliverypoint = require('../../../../../models/deliverypoint');
// const ShipInfo = require('../../../../../models/shiptopartyinfo');
// const Attachment = require('../../../../../models/attachments');
// const BeIdentityTable = require('../../../../../models/be_identity_table');
// const User = require('../../../../../models/users');
// const Assign = require('../../../../../models/assigned_to');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res) => {
//   try {
//     const userId = req.user?.id;


//     // Step 1: Get BeIdentityTable entries where entity_type is 'customer' and added_by is the current user
//     const customerIdentities = await BeIdentityTable.query(qb => {
//       qb.where('entity_type', 'customer').where('added_by', userId);
//     }).fetchAll({ require: false });

//     const customerIdentitiesJSON = customerIdentities.toJSON();


//     const validAddedByIds = customerIdentitiesJSON.map(i => i.be_id);




//     const assignedRecords = await Assign
//       .query(qb => qb.whereIn('be_information_id', validAddedByIds))
//       .fetchAll({ require: false });

//     const assignedData = assignedRecords?.toJSON?.() || [];

//     if (assignedData.length === 0) {
//       return res.json({ success: true, be_information: [] });
//     }

//     // const assignedBeIds = [...new Set(assignedData.map(a => a.be_information_id))];
//     const userIds = [...new Set(assignedData.map(a => a.added_by))];



//     // Step 2: Get Users with those added_by IDs
//     const matchedUsersCollection = await User.query(qb => {
//       qb.whereIn('added_by', userIds);
//     }).fetchAll({ require: false });

//     const matchedUsers = matchedUsersCollection.toJSON();


//     const matchedUserIds = matchedUsers.map(u => u.id);


//     // Step 3: Get Deliverypoints added by those users
//     const ships = await Deliverypoint.query(qb => {
//       qb.whereIn('added_by', matchedUserIds)
//         .whereIn('active_status', [
//           constants.activeStatus.active,
//           constants.activeStatus.inactive
//         ])
//         .orderBy('created_at', 'desc');
//     }).fetchAll({
//       require: false,
//       withRelated: [{
//         'pincode_id': (qb) => qb.select('id', 'pin_code'),
//         'place_id': (qb) => qb.select('id', 'place_name'),
//         'gst_id': (qb) => qb.select('id', 'gst_number'),
//       }]
//     });

//     const shipsData = ships.toJSON();


//     const shipIds = shipsData.map(ship => ship.id);


//     // Step 4: Get ShipInfo records
//     const shipInfos = await ShipInfo.query(qb => {
//       qb.whereIn('ship_id', shipIds)
//         .whereIn('active_status', [
//           constants.activeStatus.active,
//           constants.activeStatus.inactive
//         ]);
//     }).fetchAll({ require: false });

//     const infoData = shipInfos.toJSON();


//     const shipInfoIds = infoData.map(info => info.id);

//     // Step 5: Get Attachments for those shipInfoIds
//     const attachments = await Attachment.query(qb => {
//       qb.whereIn('entity_id', shipInfoIds)
//         .andWhere('entity_type', 'license_image')
//         .andWhere('active_status', 'active');
//     }).fetchAll({ require: false });

//     const attachmentsJSON = attachments.toJSON();


//     const imageMap = {};
//     attachmentsJSON.forEach(att => {
//       if (!imageMap[att.entity_id]) {
//         imageMap[att.entity_id] = att.photo_path;
//       }
//     });

//     // Step 6: Group shipinfo by ship_id and add license image
//     const groupedShipInfo = {};
//     infoData.forEach(info => {
//       const formatted = {
//         ...info,
//         license_image: imageMap[info.id] || ''
//       };
//       if (!groupedShipInfo[info.ship_id]) {
//         groupedShipInfo[info.ship_id] = [];
//       }
//       groupedShipInfo[info.ship_id].push(formatted);
//     });

//     // Step 7: Merge shipinfo into ship data
//     const finalShipData = shipsData.map(ship => ({
//       ...ship,
//       license_info: groupedShipInfo[ship.id] || []
//     }));

//     return res.status(200).json({
//       success: true,
//       message: "Ship to Parties fetched successfully",
//       ship_to_party: finalShipData
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: ErrorHandler(error)
//     });
//   }
// };
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const User = require('../../../../../models/users');
const Assign = require('../../../../../models/assigned_to');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const userId = req.user?.id;

    const customerIdentities = await BeIdentityTable.query(qb => {
      qb.where('entity_type', 'customer').where('added_by', userId);
    }).fetchAll({ require: false });

    const validAddedByIds = customerIdentities.toJSON().map(i => i.be_id);

    const assignedRecords = await Assign
      .query(qb => qb.whereIn('be_information_id', validAddedByIds))
      .fetchAll({ require: false });

    const assignedData = assignedRecords?.toJSON?.() || [];
    if (assignedData.length === 0) {
      return res.json({ success: true, ship_to_party: [] });
    }

    const userIds = [...new Set(assignedData.map(a => a.added_by))];
    const matchedUsers = await User.query(qb => qb.whereIn('added_by', userIds)).fetchAll({ require: false });
    const matchedUserIds = matchedUsers.toJSON().map(u => u.id);

    // Get Deliverypoints
    const ships = await Deliverypoint.query(qb => {
      qb.whereIn('added_by', matchedUserIds)
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'desc');
    }).fetchAll({
      require: false,
      withRelated: [{
        'pincode_id': (qb) => qb.select('id', 'pin_code'),
        'place_id': (qb) => qb.select('id', 'place_name'),
        'gst_id': (qb) => qb.select('id', 'gst_number'),
      }]
    });

    const shipsData = ships.toJSON();
    const shipIds = shipsData.map(ship => ship.id);

    // ShipInfo
    const shipInfos = await ShipInfo.query(qb => {
      qb.whereIn('ship_id', shipIds)
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
    }).fetchAll({ require: false });

    const infoData = shipInfos.toJSON();
    const shipInfoIds = infoData.map(info => info.id);

    // Attachments
    const attachments = await Attachment.query(qb => {
      qb.whereIn('entity_id', shipInfoIds)
        .andWhere('entity_type', 'license_image')
        .andWhere('active_status', 'active');
    }).fetchAll({ require: false });

    const attachmentsJSON = attachments.toJSON();

    const imageMap = {};
    attachmentsJSON.forEach(att => {
      if (!imageMap[att.entity_id]) {
        imageMap[att.entity_id] = att.photo_path;
      }
    });

    const groupedShipInfo = {};
    infoData.forEach(info => {
      const formatted = {
        ...info,
        license_image: imageMap[info.id] || ''
      };
      if (!groupedShipInfo[info.ship_id]) {
        groupedShipInfo[info.ship_id] = [];
      }
      groupedShipInfo[info.ship_id].push(formatted);
    });

    const finalShipData = shipsData.map(ship => ({
      ...ship,
      license_info: groupedShipInfo[ship.id] || []
    }));


    const assignedBeInfoIds = assignedData.map(a => a.be_information_id); // from earlier step

    const warehouseData = await Warehouseinformation.query((qb) => {
      qb.whereIn('be_information_id', assignedBeInfoIds)
        .andWhere('ship_info', 'yes')
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
    }).fetchAll({
      require: false,
      withRelated: [
        {
          'pincode_id': (qb) => qb.select('id', 'pin_code'),
        },
        {
          'place_id': (qb) => qb.select('id', 'place_name'),
        },
        {
          'gst_id': (qb) => qb.select('id', 'gst_number'),
        },
        {
          'be_information_id': (qb) => qb.select('id', 'business_name'),
        }
      ],
      columns: [
        'id', 'name', 'address', 'latitude', 'longitude',
        'pincode_id', 'place_id', 'gst_id', 'be_information_id',
        'ship_info', 'active_status'
      ]
    });

    const warehouseList = warehouseData.toJSON();

    const matchedWarehouseData = warehouseList.map(wh => ({
      id: wh.id, // Optional prefix to avoid ID clash
      business_name: wh.be_information_id?.business_name || '',
      gst_id: wh.gst_id,
      warehouse_name: wh.name,
      warehouse_address: wh.address,
      latitude: wh.latitude,
      longitude: wh.longitude,
      place_id: wh.place_id,
      pincode_id: wh.pincode_id,
      active_status: wh.active_status,
      be_information_id: wh.be_information_id?.id,
      ship_info: wh.ship_info,
    }));

    const finalCombinedData = [...finalShipData, ...matchedWarehouseData];

    return res.status(200).json({
      success: true,
      message: "Ship to Parties and matching Warehouses fetched successfully",
      ship_to_party: finalCombinedData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: ErrorHandler(error)
    });
  }
};

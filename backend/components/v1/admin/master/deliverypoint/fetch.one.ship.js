// // 'use strict';

// // const { ErrorHandler } = require('../../../../../lib/utils');
// // const Ship = require('../../../../../models/deliverypoint');
// // const ShipInfo = require('../../../../../models/shiptopartyinfo');
// // const Attachment = require('../../../../../models/attachments');
// // const { constants } = require('../../../../../config');

// // module.exports = async (req, res, next) => {
// //     try {
// //         // **Fetch Single Ship**
// //         const ship = await Ship.query(qb => {
// //             qb.whereIn('active_status', [
// //                 constants.activeStatus.active,
// //                 constants.activeStatus.inactive
// //             ])
// //                 .andWhere({ id: req.params.id }) // ✅ Single record fetch
// //                 .orderBy('created_at', 'asc');
// //         }).fetch({
// //             require: false, withRelated: [{
// //                 'pincode_id': function (query) {
// //                     query.select('id', 'pin_code');
// //                 },
// //                 'place_id': function (query) {
// //                     query.select('id', 'place_name');
// //                 },
// //             }]
// //         });

// //         if (!ship) {
// //             return res.serverError(400, 'invalid delivery point Details');
// //         }

// //         let shipsData = ship.toJSON();

// //         // **Fetch ShipInfo for the Ship**
// //         const info = await ShipInfo.query(qb => {
// //             qb.whereIn('active_status', [
// //                 constants.activeStatus.active,
// //                 constants.activeStatus.inactive
// //             ])
// //                 .andWhere({ ship_id: shipsData.id }) // ✅ Correct field
// //                 .orderBy('created_at', 'asc');
// //         }).fetchAll({
// //             require: false,
// //             withRelated: ['license_image'] // ✅ Fetch attachments
// //         });

// //         // **Convert Info to JSON & Process Attachments**
// //         const shipInfoData = info ? info.toJSON().map(info => ({
// //             ...info,
// //             license_image: Array.isArray(info.license_image)
// //                 ? info.license_image.map(att => att.photo_path)
// //                 : []
// //         })) : [];

// //         // ✅ **Return Processed Data**
// //         return res.success({
// //             delivery_point_Details: {
// //                 ...shipsData,
// //                 ship_info: shipInfoData
// //             }
// //         });

// //     } catch (error) {
// //         console.error(error);
// //         return res.serverError(500, { error: ErrorHandler(error) });
// //     }
// // };
// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Ship = require('../../../../../models/deliverypoint');
// const ShipInfo = require('../../../../../models/shiptopartyinfo');
// const Attachment = require('../../../../../models/attachments');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res, next) => {
//     try {
//         // **Fetch Single Ship**
//         const ship = await Ship.query(qb => {
//             qb.whereIn('active_status', [
//                 constants.activeStatus.active,
//                 constants.activeStatus.inactive
//             ])
//                 .andWhere({ id: req.params.id })
//                 .orderBy('created_at', 'asc');
//         }).fetch({
//             require: false,
//             withRelated: [{
//                 'pincode_id': function (query) {
//                     query.select('id', 'pin_code');
//                 },
//                 'place_id': function (query) {
//                     query.select('id', 'place_name');
//                 },
//             }]
//         });

//         if (!ship) {
//             return res.serverError(400, 'invalid delivery point Details');
//         }

//         let shipsData = ship.toJSON();

//         // **Fetch ShipInfo for the Ship**
//         const info = await ShipInfo.query(qb => {
//             qb.whereIn('active_status', [
//                 constants.activeStatus.active,
//                 constants.activeStatus.inactive
//             ])
//                 .andWhere({ ship_id: shipsData.id })
//                 .orderBy('created_at', 'asc');
//         }).fetchAll({ require: false });

//         //  Get all ShipInfo IDs
//         const shipInfoIds = info.toJSON().map(item => item.id);

//         //  Fetch related license image attachments
//         const licenseImages = await Attachment.query(qb => {
//             qb.whereIn('entity_id', shipInfoIds)
//                 .andWhere('entity_type', 'license_image')
//                 .andWhere('active_status', 'active');
//         }).fetchAll({ require: false });

//         //  Create a map of images per shipinfo ID
//         const imageMap = {};
//         licenseImages.toJSON().forEach(att => {
//             if (!imageMap[att.entity_id]) {
//                 imageMap[att.entity_id] = [];
//             }
//             imageMap[att.entity_id].push(att.photo_path);
//         });


//         const shipInfoData = info.toJSON().map(info => ({
//             ...info,
//             license_image: imageMap[info.id] || []
//         }));

//         return res.success({
//             delivery_point_Details: {
//                 ...shipsData,
//                 ship_info: shipInfoData
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         return res.serverError(500, { error: ErrorHandler(error) });
//     }
// };

'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Ship = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // **Fetch Single Ship**
        const ship = await Ship.query(qb => {
            qb.whereIn('active_status', [
                constants.activeStatus.active,
                constants.activeStatus.inactive
            ])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            withRelated: [{
                'pincode_id': function (query) {
                    query.select('id', 'pin_code');
                },
                'place_id': function (query) {
                    query.select('id', 'place_name');
                },
            }]
        });

        if (!ship) {
            return res.serverError(400, 'invalid delivery point Details');
        }

        let shipsData = ship.toJSON();

        // **Fetch ShipInfo for the Ship**
        const info = await ShipInfo.query(qb => {
            qb.whereIn('active_status', [
                constants.activeStatus.active
            ])
                .andWhere({ ship_id: shipsData.id })
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

        //  Get all ShipInfo IDs
        const shipInfoIds = info.toJSON().map(item => item.id);

        //  Fetch related license image attachments
        const licenseImages = await Attachment.query(qb => {
            qb.whereIn('entity_id', shipInfoIds)
                .andWhere('entity_type', 'license_image')
                .andWhere('active_status', 'active');
        }).fetchAll({ require: false });

        //  Create a map of images per shipinfo ID
        const imageMap = {};
        licenseImages.toJSON().forEach(att => {
            if (!imageMap[att.entity_id]) {
                imageMap[att.entity_id] = [];
            }
            imageMap[att.entity_id].push(att.photo_path);
        });

        // Map shipInfo and attach only first license image
        const shipInfoData = info.toJSON().map(info => ({
            ...info,
            license_image: (imageMap[info.id] && imageMap[info.id][0]) || ''
        }));

        return res.success({
            delivery_point_Details: {
                ...shipsData,
                ship_info: shipInfoData
            }
        });

    } catch (error) {
        console.error(error);
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};


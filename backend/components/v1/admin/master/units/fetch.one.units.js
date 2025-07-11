// 'use strict';
// const { ErrorHandler } = require('../../../../../lib/utils');
// const Units = require('../../../../../models/units');
// const Uqc = require('../../../../../models/uqc');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res, next) => {
//     try {
//         if (!req.params.id) {
//             return res.serverError(400, 'Missing unit ID');
//         }

//         // Fetch unit by ID
//         const unit = await Units.query((qb) => {
//             qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//                 .andWhere({ id: req.params.id })
//                 .orderBy('created_at', 'asc');
//         }).fetch({ require: false });

//         if (!unit) {
//             return res.serverError(400, 'Invalid unit');
//         }

//         let unitData = unit.toJSON();

//         // Fetch corresponding UQC details based on unit's uqc_id
//         if (unitData.uqc_id) {
//             const uqc = await Uqc.where({ id: unitData.uqc_id }).fetch({ require: false });
//             unitData.uqc_name = uqc ? uqc.get('name') : null; // Extract UQC name
//         } else {
//             unitData.uqc_name = null;
//         }

//         return res.success({ unit: unitData });

//     } catch (error) {
//         return res.serverError(500, ErrorHandler(error));
//     }
// };

'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Units = require('../../../../../models/units');
const Uqc = require('../../../../../models/uqc');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.serverError(400, 'Missing unit ID');
        }

        // Fetch unit details by ID
        const unit = await Units.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!unit) {
            return res.serverError(400, 'Invalid unit');
        }

        let unitData = unit.toJSON();

        // Fetch UQC details and format it properly
        let uqcDetails = null;
        if (unitData.uqc_id) {
            const uqc = await Uqc.where({ id: unitData.uqc_id }).fetch({ require: false });
            if (uqc) {
                uqcDetails = {
                    id: uqc.get('id'),
                    uqc_code: `${uqc.get('name')}-${uqc.get('quantity')}`
                };
            }
        }

        // Construct final response structure
        const response = {
            success: true,
            unit: {
                id: unitData.id,
                unit_name: unitData.unit_name,
                description: unitData.description || '',
                added_by: unitData.added_by,
                active_status: unitData.active_status,
                created_at: unitData.created_at,
                updated_at: unitData.updated_at,
                formal_name: unitData.formal_name,
                number_of_decimal: unitData.number_of_decimal,
                uqc_id: uqcDetails // Now properly formatted
            }
        };

        return res.success(response);

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

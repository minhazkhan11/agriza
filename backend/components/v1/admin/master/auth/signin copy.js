
// 'use strict';
// const { ErrorHandler } = require('../../../../../lib/utils');
// const passport = require('passport');
// const User = require('../../../../../models/users');
// const Assigned = require('../../../../../models/assigned_to');
// const Entitybasic = require('../../../../../models/be_information');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res, next) => {
//     try {
//         let user = await User.where({
//             phone: req.body.user.username,
//             active_status: constants.activeStatus.active
//         }).fetch({ require: false });

//         console.log("User Found:", user);

//         if (!user) {
//             return res.serverError(422, ErrorHandler(new Error(constants.error.auth.invalidCredentials)));
//         }

//         // Get assigned details (if exists)
//         const assignedTo = await Assigned.where({
//             user_id: user.get('id')
//         }).fetch({ require: false });

//         let entityDetails = null;

//         if (assignedTo) {
//             const beInformationId = assignedTo.get('be_information_id');


//             entityDetails = await Entitybasic.where({ id: beInformationId }).fetch({ require: false });

//         }

//         passport.authenticate('local', async (err, data, info) => {
//             if (err) {
//                 return res.serverError(400, ErrorHandler(err));
//             }

//             return res.success({
//                 ...data,
//                 assigned_to: assignedTo || null,
//                 entity_details: entityDetails || null,
//             });
//         })(req, res);
//     } catch (error) {
//         return res.serverError(500, ErrorHandler(error));
//     }
// };
'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const passport = require('passport');
const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const StaffAssigned = require('../../../../../models/assigned');
const Entitybasic = require('../../../../../models/be_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        let user = await User.where({
            phone: req.body.user.username,
            active_status: constants.activeStatus.active
        }).fetch({ require: false });

        console.log("User Found:", user);

        if (!user) {
            return res.serverError(402, ErrorHandler(new Error(constants.error.auth.invalidCredentials)));
        }

        // Get assigned details (if exists)
        const assignedTo = await Assigned.where({
            user_id: user.get('id')
        }).fetch({ require: false });

        let entityDetails = null;

        if (assignedTo) {
            const beInformationId = assignedTo.get('be_information_id');
            entityDetails = await Entitybasic.where({ id: beInformationId }).fetch({
                require: false, withRelated: [
                    {
                        'constitutions_id': function (query) {
                            query.select('id', 'name');
                        }
                    },]
            });
        }

        passport.authenticate('local', async (err, data, info) => {
            if (err) {
                return res.serverError(400, ErrorHandler(err));
            }
            const userRole = user.get('role');
            const addedBy = user.get('added_by');
            const excludeDetails = (userRole === 'superadmin') || (userRole === 'user' && addedBy === "1");

            const response = {
                ...data,
                ...(excludeDetails ? {} : { assigned_to: assignedTo || null, entity_details: entityDetails || null }),
            };

            return res.success(response);
        })(req, res);
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

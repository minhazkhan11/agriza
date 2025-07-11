// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Entitybasic = require('../../../../../models/be_information');
// const { constants } = require('../../../../../config');



// module.exports = async (req, res, next) => {
//   try {
//     //Get logged in user
//     let check = await Entitybasic.where({ id: req.params.id }).fetch({ require: false });
//     if (!check)
//       return res.serverError(400, ErrorHandler(new Error(' be_information not found')));
//     await new Entitybasic().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
//       .then(() => {
//         return res.success({ 'message': ' be_information deleted successfully' });
//       })
//       .catch(err => {
//         return res.serverError(400, ErrorHandler('Something went wrong'));
//       })
//   } catch (error) {
//     console.log('errorrr', error);
//     return res.serverError(500, ErrorHandler(error));
//   }
// };

'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Entitybasic = require('../../../../../models/be_information');
const Assigned = require('../../../../../models/assigned_to');
const User = require('../../../../../models/users'); // Import User Model
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    let check = await Entitybasic.where({ id: req.params.id }).fetch({ require: false });

    if (!check) {
      return res.serverError(400, ErrorHandler(new Error('be_information not found')));
    }
    await new Entitybasic().where({ id: req.params.id }).save(
      { active_status: constants.activeStatus.deleted },
      { method: 'update' }
    );
    const assignedRecords = await Assigned.where({ be_information_id: req.params.id }).fetchAll({ require: false });

    if (assignedRecords && assignedRecords.length > 0) {
      await Assigned.where({ be_information_id: req.params.id }).save(
        { active_status: constants.activeStatus.deleted },
        { method: 'update', patch: true }
      );

      const userIds = assignedRecords.map(record => record.get('user_id'));

      if (userIds.length > 0) {

        await User.where('id', 'IN', userIds).save(
          { active_status: constants.activeStatus.deleted },
          { method: 'update', patch: true }
        );
      }
    }

    return res.success({ message: 'be_information, assigned_to, and related users deleted successfully' });

  } catch (error) {
    console.log('Error:', error);
    return res.serverError(500, ErrorHandler(error));
  }
};

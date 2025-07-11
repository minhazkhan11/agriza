// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Entitybasic = require('../../../../../models/be_information');
// const { constants } = require('../../../../../config');


// module.exports = async (req, res, next) => {
//   try {

//     const id = req.body.be_information.id;
//     let Check = await Entitybasic.where({ id }).fetch({ require: false });
//     if (!Check)
//       return res.serverError(400, ErrorHandler('business entity basic not found'));

//     const body = req.body.be_information;
//     const be_information = await new Entitybasic().where({ id }).save(body, { method: 'update' });

//     return res.success({ be_information });
//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };

'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Entitybasic = require('../../../../../models/be_information');
const Assigned = require('../../../../../models/assigned_to');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const { id, active_status } = req.body.be_information;

    let check = await Entitybasic.where({ id }).fetch({ require: false });

    if (!check) {
      return res.serverError(400, ErrorHandler('business entity basic not found'));
    }

    await new Entitybasic().where({ id }).save({ active_status }, { method: 'update' });

    const assignedRecords = await Assigned.where({ be_information_id: id }).fetchAll({ require: false });

    if (assignedRecords && assignedRecords.length > 0) {
      await Assigned.where({ be_information_id: id }).save(
        { active_status },
        { method: 'update', patch: true }
      );

      const userIds = assignedRecords.map(record => record.get('user_id'));

      if (userIds.length > 0) {
        await User.where('id', 'IN', userIds).save(
          { active_status },
          { method: 'update', patch: true }
        );
      }
    }

    return res.success({ message: 'Status updated successfully' });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

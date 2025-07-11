// 'use strict';
// const User = require('../models/users'); // User model

// // Yeh function sirf upar ki taraf jaata hai — user → added_by → added_by
// const getUpwardUserHierarchy1 = async (userId, hierarchy = new Set()) => {
//   if (hierarchy.has(userId)) return hierarchy;

//   hierarchy.add(userId);

//   const userData = await User.where({ id: userId }).fetch({ require: false });

//   if (userData && userData.get('added_by')) {
//     const parentId = userData.get('added_by');
//     await getUpwardUserHierarchy1(parentId, hierarchy);
//   }

//   return hierarchy;
// };

// module.exports = getUpwardUserHierarchy1;

'use strict';
const User = require('../models/users'); // User model

// Downward-only: user → children → grandchildren → ...
const getDownwardUserHierarchy1 = async (userId, hierarchy = new Set()) => {
  if (hierarchy.has(userId)) return hierarchy;

  hierarchy.add(userId); // Include self

  const downlineUsers = await User.where({ added_by: userId }).fetchAll({ require: false });

  for (const user of downlineUsers.toJSON()) {
    if (!hierarchy.has(user.id)) {
      await getDownwardUserHierarchy1(user.id, hierarchy); // go downward only
    }
  }

  return hierarchy;
};

module.exports = getDownwardUserHierarchy1;

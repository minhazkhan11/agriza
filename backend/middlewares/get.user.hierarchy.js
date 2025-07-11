// 'use strict';
// const User = require('../models/users'); // User model

// const getUserHierarchy = async (userId, hierarchy = new Set(), checkedUsers = new Set()) => {
//   if (checkedUsers.has(userId)) return hierarchy; // Prevent infinite loops
//   checkedUsers.add(userId);

//   hierarchy.add(userId); // Include the user itself

//   // Fetch the user's data
//   const userData = await User.where({ id: userId }).fetch({ require: false });

//   if (userData && userData.get('added_by')) {
//     // Fetch the immediate parent
//     const parentUser = await User.where({ id: userData.get('added_by') }).fetch({ require: false });

//     if (parentUser) {
//       hierarchy.add(parentUser.id); // Include only the parent
//       await getUserHierarchy(parentUser.id, hierarchy, checkedUsers); // Continue upward
//     }
//   }

//   return hierarchy; // Return only upward lineage
// };

// module.exports = getUserHierarchy;
'use strict';
const User = require('../models/users'); // User model

const getFullUserHierarchy = async (userId, hierarchy = new Set(), checkedUsers = new Set()) => {
  if (checkedUsers.has(userId)) return hierarchy;
  checkedUsers.add(userId);
  hierarchy.add(userId);

  // ---- Upward Traversal ----
  const userData = await User.where({ id: userId }).fetch({ require: false });
  if (userData && userData.get('added_by')) {
    const parentUser = await User.where({ id: userData.get('added_by') }).fetch({ require: false });
    if (parentUser && !hierarchy.has(parentUser.id)) {
      await getFullUserHierarchy(parentUser.id, hierarchy, checkedUsers); // go upward
    }
  }

  // ---- Downward Traversal ----
  const downlineUsers = await User.where({ added_by: userId }).fetchAll({ require: false });
  for (const user of downlineUsers.toJSON()) {
    if (!hierarchy.has(user.id)) {
      await getFullUserHierarchy(user.id, hierarchy, checkedUsers); // go downward
    }
  }

  return hierarchy;
};

module.exports = getFullUserHierarchy;

// const bookshelf = require('../config/bookshelf');

// const userdetails = bookshelf.Model.extend({
//   tableName: 'staff_contacts',
//   hasTimestamps: true,
//   autoIncrement: true,

//   addedBy: function () {
//     return this.belongsTo("Users", "added_by");
//   },
// photo: function () {
//   return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "photo");
// }
// });

// module.exports = bookshelf.model('staff_contacts', userdetails);
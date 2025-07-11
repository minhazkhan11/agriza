// const bookshelf = require('../config/bookshelf');

// const invoice = bookshelf.Model.extend({
//   tableName: 'Order_invoices',
//   hasTimestamps: true,
//   autoIncrement: true,

//   order_id: function () {
//     return this.belongsTo("Order", "order_id");
//   },
//   addedBy: function () {
//     return this.belongsTo("Users", "added_by");
//   }
// });

// module.exports = bookshelf.model('Order_invoices', invoice);
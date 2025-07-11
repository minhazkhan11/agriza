const bookshelf = require('../config/bookshelf');
require("./users");

const Cart = bookshelf.Model.extend({
    tableName: 'Cart',
    hasTimestamps: true,
    autoIncrement: true,

    addedBy: function () {
        return this.belongsTo("Users", "added_by");
    },
});

module.exports = bookshelf.model('Cart', Cart);
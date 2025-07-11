const bookshelf = require('../config/bookshelf');
require("./users");

const Wishlist = bookshelf.Model.extend({
    tableName: 'Wishlist',
    hasTimestamps: true,
    autoIncrement: true,

    addedBy: function () {
        return this.belongsTo("Users", "added_by");
    },
});

module.exports = bookshelf.model('Wishlist', Wishlist);
const bookshelf = require('../config/bookshelf');

const sub_menu = bookshelf.Model.extend({
  tableName: 'Integrated_modules_sub_menu',
  hasTimestamps: true,
  autoIncrement: true,
  
  main_menu_id: function () {
    return this.belongsTo("Integrated_modules_main_menu", "main_menu_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Integrated_modules_sub_menu', sub_menu);
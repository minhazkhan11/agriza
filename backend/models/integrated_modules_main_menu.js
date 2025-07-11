const bookshelf = require('../config/bookshelf');

const main_menu = bookshelf.Model.extend({
  tableName: 'Integrated_modules_main_menu',
  hasTimestamps: true,
  autoIncrement: true,

  menu_plan_id: function () {
    return this.belongsTo("Menu_plan", "menu_plan_id");
  },
  
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Integrated_modules_main_menu', main_menu);
const bookshelf = require('../config/bookshelf');

const MenuPlan = bookshelf.Model.extend({
  tableName: 'Menu_plan',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Menu_plan', MenuPlan);
const bookshelf = require('../config/bookshelf');

const module_plans = bookshelf.Model.extend({
  tableName: 'Integrated_module_plans',
  hasTimestamps: true,
  autoIncrement: true,

 
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Integrated_module_plans', module_plans);
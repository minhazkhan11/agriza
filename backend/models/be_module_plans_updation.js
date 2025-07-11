


const bookshelf = require('../config/bookshelf');

const plans_updation = bookshelf.Model.extend({
  tableName: 'be_module_plans_updation',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('be_module_plans_updation', plans_updation);
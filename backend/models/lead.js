const bookshelf = require('../config/bookshelf');

const Leads = bookshelf.Model.extend({
  tableName: 'Leads',
  hasTimestamps: true,
  autoIncrement: true,



  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  r_office_pincode_id: function () {
    return this.belongsTo("Pin", "r_office_pincode_id");
  },
  r_office_place_id: function () {
    return this.belongsTo("Place", "r_office_place_id");
  },
  postal_office_pincode_id: function () {
    return this.belongsTo("Pin", "postal_office_pincode_id");
  },
  postal_office_place_id: function () {
    return this.belongsTo("Place", "postal_office_place_id");
  },

  lead_category_id: function () {
    return this.belongsTo("Lead_category", "lead_category_id");
  },
  lead_subcategory_id: function () {
    return this.belongsTo("Lead_sub_category", "lead_subcategory_id");
  },
  type_of_organization: function () {
    return this.belongsTo("Constitution", "type_of_organization");
  },
});

module.exports = bookshelf.model('Leads', Leads);
const bookshelf = require('../config/bookshelf');

const Brands = bookshelf.Model.extend({
  tableName: 'brands',
  hasTimestamps: true,
  autoIncrement: true,


  brand_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "brand_image");
  },
  marketers_id: function () {
    return this.belongsTo("marketers", "marketers_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('brands', Brands);

exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants_price', (t) => {
    t.string('item_delivery_type')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants_price', (t) => {
    t.dropColumn('item_delivery_type');
  });
};
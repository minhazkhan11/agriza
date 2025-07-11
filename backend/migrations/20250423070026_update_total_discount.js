exports.up = function (knex) {
  return knex.schema.alterTable('Total_discount', (t) => {
    t.text('item_order_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Total_discount', (t) => {
    t.dropColumn('item_order_id');
  });
};
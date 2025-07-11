exports.up = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.text('item_order_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.dropColumn('item_order_id');
  });
};
exports.up = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.decimal('dispatch_quantity', 10, 2);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.dropColumn('dispatch_quantity');
  });
};
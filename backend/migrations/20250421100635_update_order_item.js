exports.up = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.string('discount_type');
    t.decimal('discount', 10, 2);
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.dropColumn('discount_type');
    t.dropColumn('discount');
    t.dropColumn('active_status');
  });
};

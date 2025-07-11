exports.up = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.string('unit')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Order_item', (t) => {
    t.dropColumn('unit');
  });
};

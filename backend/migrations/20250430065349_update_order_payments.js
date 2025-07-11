exports.up = function (knex) {
  return knex.schema.alterTable('Order_Payments', (t) => {
    t.string('entity_type');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Order_Payments', (t) => {
    t.dropColumn('entity_type');

  });
};
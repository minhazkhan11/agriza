exports.up = function (knex) {
  return knex.schema.alterTable('Other_charges', (t) => {
    t.text('item_order_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Other_charges', (t) => {
    t.dropColumn('item_order_id');
  });
};


exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {
    t.boolean('ex').defaultTo(false);
    t.boolean('fro').defaultTo(false);
    t.dropColumn('item_delivery_type');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {
    t.dropColumn('ex');
    t.dropColumn('fro');
  });
};
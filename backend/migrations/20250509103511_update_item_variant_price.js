
exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants_price', (t) => {
    t.date('effective_date');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants_price', (t) => {
    t.dropColumn('effective_date');
  });
};

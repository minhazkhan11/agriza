exports.up = function (knex) {
  return knex.schema.alterTable('product_catalogue', (t) => {
    t.dropColumn('Product_ids');
    t.integer('Product_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('product_catalogue', (t) => {
    t.json('Product_ids');
    t.dropColumn('Product_id');
  });
};

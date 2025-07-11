
exports.up = function (knex) {
  return knex.schema.alterTable('product_catalogue', (t) => {
    t.dropColumn('Product_id');
    t.json('Product_ids')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('product_catalogue', (t) => {
    t.integer('Product_id').unsigned().references('id').inTable('Product')
    t.dropColumn('Product_ids')
  });
};

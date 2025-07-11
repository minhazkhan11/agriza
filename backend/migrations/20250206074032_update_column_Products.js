exports.up = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.integer('product_sub_category_id').unsigned().references('id').inTable('Product_sub_category')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.dropColumn('product_sub_category_id');
  });
};

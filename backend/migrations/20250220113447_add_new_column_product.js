exports.up = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.integer('product_child_category_id').unsigned().references('id').inTable('Product_child_category')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.dropColumn('product_child_category_id');
  });
};

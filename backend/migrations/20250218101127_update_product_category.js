exports.up = function (knex) {
  return knex.schema.table('Product_category', (t) => {
    t.dropColumn('product_class_id');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Product_category', (t) => {
    t.bigInteger('product_class_id').unsigned().references('id').inTable('Product_class');
  });
};

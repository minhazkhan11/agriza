
exports.up = function (knex) {
  return knex.schema.alterTable('master_product', function (t) {

    t.string('hsn_code');
    t.string('gst_applicable');

    t.integer('product_child_category_id').unsigned().references('id').inTable('Product_child_category')
    t.integer('gst_id').unsigned().references('id').inTable('GST_percent');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('master_product', function (t) {
    t.dropColumn('hsn_code');
    t.dropColumn('gst_applicable');
    t.dropColumn('product_child_category_id');
    t.dropColumn('gst_id');

  });
};


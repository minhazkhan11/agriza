exports.up = function (knex) {
  return knex.schema.table('Product', function (t) {
    t.dropColumn('gst_percent');
    t.integer('gst_percent_id').unsigned().references('id').inTable('GST_percent')

  });
};

exports.down = function (knex) {
  return knex.schema.table('Product', function (t) {
    t.dropColumn('gst_percent_id');
    t.decimal('gst_percent', 5, 2);
  });
};

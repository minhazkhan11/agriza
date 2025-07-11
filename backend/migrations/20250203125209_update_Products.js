exports.up = function (knex) {
  return knex.schema.table('Product', function (t) {
    t.decimal('gst_percent', 5, 2); // GST Percentage (e.g., 18.00)
    t.boolean('gst_applicable').defaultTo(false); // GST Applicable (Yes/No)
  });
};

exports.down = function (knex) {
  return knex.schema.table('Product', function (t) {
    t.dropColumn('gst_percent');
    t.dropColumn('gst_applicable').defaultTo(false);
  });
};

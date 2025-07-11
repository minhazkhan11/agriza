exports.up = function (knex) {
  return knex.schema.alterTable('GST_percent', (t) => {
    t.integer('gst_percent').alter();
    t.string('taxablity_type');
    t.string('gst_name');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('GST_percent', (t) => {
    t.decimal('gst_percent', 5, 2).alter();
    t.dropColumn('taxablity_type');
    t.dropColumn('gst_name');


  });
};

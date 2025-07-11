
exports.up = function (knex) {
  return knex.schema.alterTable('GST_percent', (t) => {
    t.string('gst_percent').alter();

  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('GST_percent', (t) => {
    t.integer('gst_percent').alter();
  });
};
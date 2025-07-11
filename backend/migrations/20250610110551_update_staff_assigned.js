exports.up = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.json('gst_id')
    t.json('vendor_id')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.dropColumn('gst_id')
    t.dropColumn('vendor_id')
  });
};

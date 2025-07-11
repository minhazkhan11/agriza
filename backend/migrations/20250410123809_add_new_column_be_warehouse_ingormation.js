exports.up = function (knex) {
  return knex.schema.alterTable('Be_warehouse_information', (t) => {
    t.integer('gst_id').unsigned().references('id').inTable('Be_gst_details');
  
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('Be_warehouse_information', (t) => {
    t.dropColumn('gst_id');
  });
};
exports.up = function (knex) {
  return knex.schema.alterTable('Delivery_Point', (t) => {

    t.integer('gst_id').unsigned().references('id').inTable('Be_gst_details');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Delivery_Point', (t) => {

    t.dropColumn('gst_id');
  });
};



exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.dropColumn('postal_pincode');
    t.dropColumn('gst_pincode')
    t.integer('postal_pincode_id').unsigned().references('id').inTable('Pin')
    t.integer('gst_pincode_id').unsigned().references('id').inTable('Pin')

  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.dropColumn('postal_pincode_id');
    t.dropColumn('gst_pincode_id')
    t.string('postal_pincode');
    t.string('gst_pincode');

  });
};
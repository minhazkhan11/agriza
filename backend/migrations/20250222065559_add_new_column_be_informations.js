
exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.string('postal_pincode');
    t.string('gst_pincode');
    t.string('email');


  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.dropColumn('postal_pincode');
    t.dropColumn('gst_pincode');
    t.dropColumn('email');
  });
};

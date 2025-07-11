exports.up = function (knex) {
  return knex.schema.alterTable('Be_warehouse_information', function (t) {

    t.dropColumn('pincode');

    t.integer('pincode_id').unsigned().references('id').inTable('Pin');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_warehouse_information', function (t) {
    t.dropColumn('pincode_id');
    t.string('pincode');
  });
};

exports.up = function (knex) {
  return knex.schema.alterTable('Be_warehouse_information', function (t) {

    t.string('ship_info');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_warehouse_information', function (t) {
    t.dropColumn('ship_info');

  });
};
exports.up = function (knex) {
  return knex.schema.alterTable('Users', (t) => {
    t.string('r_address');
    t.string('father_name');
    t.string('pincode');
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('Users', (t) => {
    t.dropColumn('r_address');
    t.dropColumn('father_name');
    t.dropColumn('pincode');
  });
};
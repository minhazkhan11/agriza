exports.up = function (knex) {
  return knex.schema.alterTable('Users', (t) => {
    t.integer('pincode_id').unsigned().references('id').inTable('Pin')
    t.dropColumn('pincode');
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('Users', (t) => {
    t.dropColumn('pincode_id');
    t.string('pincode');
  });
};
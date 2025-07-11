
exports.up = function (knex) {
  return knex.schema.alterTable('Be_bank_details', (t) => {
    t.string('benifashiyal_name');
    t.string('short_name');
  });

};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_bank_details', (t) => {
    t.dropColumn('benifashiyal_name');
    t.dropColumn('short_name');

  });
};
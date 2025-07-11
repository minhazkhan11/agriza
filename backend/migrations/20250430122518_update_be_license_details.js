exports.up = function (knex) {
  return knex.schema.alterTable('Be_license_details', (t) => {
    t.integer('be_information_id').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_license_details', (t) => {
    t.dropColumn('be_information_id');
  });
};

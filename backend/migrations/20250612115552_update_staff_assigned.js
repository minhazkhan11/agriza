exports.up = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.integer('be_information_id')

  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.dropColumn('be_information_id')

  });
};
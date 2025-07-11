exports.up = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.integer('user_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.dropColumn('user_id')
  });
};

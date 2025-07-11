exports.up = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.json('customer_id')

  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
    t.dropColumn('customer_id')

  });
};


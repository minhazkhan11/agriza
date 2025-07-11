
exports.up = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {

    t.renameColumn('vector_date_change', 'Effective_date_change');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {

    t.renameColumn('Effective_date_change', 'vector_date_change');
  });
};

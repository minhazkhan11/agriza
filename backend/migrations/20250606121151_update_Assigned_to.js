exports.up = function (knex) {
  return knex.schema.alterTable('Assigned_to', (t) => {
    t.string('is_admin');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Assigned_to', (t) => {
    t.dropColumn('is_admin');
  });
};

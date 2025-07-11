exports.up = function (knex) {
  return knex.schema.alterTable('marketers', (t) => {
    t.string('alias_name');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('marketers', (t) => {
    t.dropColumn('alias_name');
  });
};

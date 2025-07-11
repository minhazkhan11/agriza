

exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.renameColumn('cin/gumasta', 'cin_gumasta');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.renameColumn('cin_gumasta', 'cin/gumasta');
  });
};

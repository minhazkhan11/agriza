
exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.integer('constitutions_id').unsigned().references('id').inTable('Constitution')


    t.renameColumn('cin_number', 'cin/gumasta');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.dropColumn('constitutions_id');

    t.renameColumn('cin/gumasta', 'cin_number');
  });
};

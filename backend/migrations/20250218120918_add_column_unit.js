exports.up = function (knex) {
  return knex.schema.alterTable('Units', (t) => {
    t.string('formal_name');
    t.integer('number_of_decimal');
    t.integer('uqc_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Units', (t) => {
    t.dropColumn('formal_name');
    t.dropColumn('number_of_decimal');
    t.dropColumn('uqc_id');

  });
};

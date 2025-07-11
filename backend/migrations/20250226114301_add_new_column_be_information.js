
exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.string('user_type');


  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {

    t.dropColumn('user_type');

  });
};
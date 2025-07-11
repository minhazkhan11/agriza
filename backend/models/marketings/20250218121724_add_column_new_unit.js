
exports.up = function (knex) {
  return knex.schema.alterTable('Units', (t) => {

    t.integer('uqc_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Units', (t) => {
    t.integer('uqc_id');

  });
};

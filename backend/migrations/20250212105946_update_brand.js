exports.up = function (knex) {
  return knex.schema.alterTable('brands', (t) => {
    t.integer('marketers_id').unsigned().references('id').inTable('marketers')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('brands', (t) => {
    t.dropColumn('marketers_id');
  });
};
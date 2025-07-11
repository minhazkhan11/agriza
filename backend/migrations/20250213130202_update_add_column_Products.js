exports.up = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.string('remark');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.dropColumn('remark');
  });
};

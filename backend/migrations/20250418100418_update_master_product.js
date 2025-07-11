exports.up = function (knex) {
  return knex.schema.alterTable('master_product', (t) => {
    t.text('remark');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('master_product', (t) => {
    t.dropColumn('remark');
  });
};

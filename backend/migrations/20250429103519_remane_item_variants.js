
exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {

    t.renameColumn('fro', 'for');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {

    t.renameColumn('for', 'fro');
  });
};

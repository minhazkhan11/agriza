
exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {
    t.renameColumn('menu_id', 'module_id');

  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {
    t.renameColumn('module_id', 'menu_id');

  });
};
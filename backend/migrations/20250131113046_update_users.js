
exports.up = function (knex) {
  return knex.schema.alterTable('Users', (t) => {
    t.integer('menu_plan_id');
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('Users', (t) => {
    t.dropColumn('menu_plan_id');
  });
};
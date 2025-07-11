
exports.up = function (knex) {
  return knex.schema.createTable('be_module_plans_updation', (t) => {
    t.increments();
    t.integer('curent_module_plan_id');
    t.integer('new_module_plan_id');
    t.integer('updated_module_plan_id');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('be_module_plans_updation');
};
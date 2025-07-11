
exports.up = function (knex) {
  return knex.schema.createTable('Integrated_module_plans', (t) => {
    t.increments();
    t.string('plan_name').notNullable();
    t.integer('index_id');
    t.integer('cost').notNullable();
    t.integer('be_admin_menu_plan_id').unsigned().references('id').inTable('Menu_plan').nullable();
    t.integer('procurement_menu_plan_id').unsigned().references('id').inTable('Menu_plan').nullable();
    t.integer('salesman_menu_plan_id').unsigned().references('id').inTable('Menu_plan').nullable();
    t.integer('scm_menu_plan_id').unsigned().references('id').inTable('Menu_plan').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('Integrated_module_plans');
};
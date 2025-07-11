exports.up = function (knex) {
  return knex.schema.createTable('Integrated_modules_main_menu', (t) => {
    t.increments();
    t.integer('index_id');
    t.string('name').notNullable();
    t.string('type');
    t.string('icon');
    t.string('path');
    t.jsonb('actions').defaultTo('[]');
    t.bigInteger('menu_plan_id').unsigned().references('id').inTable('Menu_plan').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('Integrated_modules_main_menu');
};
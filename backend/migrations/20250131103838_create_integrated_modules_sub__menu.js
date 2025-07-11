exports.up = function (knex) {
  return knex.schema.createTable('Integrated_modules_sub_menu', (t) => {
    t.increments();
    t.integer('index_id');
    t.bigInteger('main_menu_id').unsigned().references('id').inTable('Integrated_modules_main_menu').notNullable();
    t.string('name').notNullable();
    t.string('type');
    t.string('icon');
    t.string('path');
    t.jsonb('actions').defaultTo('[]');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('Integrated_modules_sub_menu');
};
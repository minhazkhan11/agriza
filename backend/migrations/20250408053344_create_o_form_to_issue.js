
exports.up = function (knex) {
  return knex.schema.createTable('O_form_issue ', (t) => {
    t.increments();
    t.integer('o_form_id').unsigned().references('id').inTable('O_form_versioning')
    t.integer('customer_id').unsigned().references('id').inTable('Users')
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('O_form_issue ');
};
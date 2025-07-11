

exports.up = function (knex) {
  return knex.schema.createTable('Expense', (t) => {
    t.increments();

    t.string('expense_head');
    t.date('start_date');
    t.date('end_date');
    t.text('description');

    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'approved', 'submitted', 'rejected'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Expense');
};


exports.up = function (knex) {
  return knex.schema.createTable('Sub_Expense', (t) => {
    t.increments();

    t.string('title');
    t.date('expense_date');
    t.text('description');
    t.decimal('amount', 10, 2);
    t.integer('expense_id').unsigned().references('id').inTable('Expense');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'approved', 'submitted', 'rejected'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Sub_Expense');
};
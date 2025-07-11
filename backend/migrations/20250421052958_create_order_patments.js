
exports.up = function (knex) {
  return knex.schema.createTable('Order_Payments', (t) => {
    t.increments();
    t.string('name');
    t.string('mode_of_payment ');
    t.string('transaction_id');
    t.date('transaction_date');
    t.decimal('amount', 10, 2);
    t.text('Comments');
    t.integer('customer_be_id').unsigned().references('id').inTable('Be_information').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order_Payments');
};
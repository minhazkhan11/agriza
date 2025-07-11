

exports.up = function (knex) {
  return knex.schema.createTable('Order_invoices', (t) => {
    t.increments();

    t.string('invoice_number');
    t.date('invoice_date');
    t.integer('order_id').unsigned().references('id').inTable('Order');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order_invoices');
};
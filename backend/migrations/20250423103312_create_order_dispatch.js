exports.up = function (knex) {
  return knex.schema.createTable('Order_dispatch', (t) => {
    t.increments();

    t.string('item_order_id')
    t.string('bilty_number');
    t.string('order_invoice_number');

    t.string('transporter_name');
    t.string('transporter_contact_number');
    t.string('payment_type');
    t.string('driver_name');
    t.string('driver_contact_number');
    t.string('vehicle_number');
    t.string('broker_details');
    t.decimal('freight', 10, 2);

    t.text('note');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');

    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order_dispatch');
};
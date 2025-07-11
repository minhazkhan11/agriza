exports.up = function (knex) {
  return knex.schema.createTable('Order', (t) => {
    t.increments();
    t.string('order_type');
    t.string('ship_type');
    t.string('item_order_id')
    t.integer('customer_ship_to_party_id').unsigned().references('id').inTable('Delivery_Point');
    t.integer('vendor_warehouse_information_id').unsigned().references('id').inTable('Be_warehouse_information');
    // t.decimal('offer', 10, 2);
    // t.string('offer_type');
    t.decimal('total_amount', 10, 2);
    t.decimal('payment_amount', 10, 2);
    t.decimal('remaining_payment_after', 10, 2);
    t.string('payment_id');
    t.string('payment_mode');
    t.string('payment_type');
    t.date('date');



    t.text('admin_comment');
    t.text('general_comment');

    t.enu('order_status', ['pending', 'dispatch', 'approved', 'rejected', 'delivered', 'received'], { useNative: false }).defaultTo('pending');

    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');

    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order');
};
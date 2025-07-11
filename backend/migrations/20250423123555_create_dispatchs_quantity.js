
exports.up = function (knex) {
  return knex.schema.createTable('Dispatch_quantity', (t) => {
    t.increments();

    t.string('item_order_id')
    t.integer('order_item_id')

    t.decimal('dispatch_quantity', 10, 2);
    t.decimal('all_dispatch_quantity', 10, 2);


    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');

    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Dispatch_quantity');
};
exports.up = function (knex) {
  return knex.schema.createTable('Other_charges', (t) => {
    t.increments();

    
    t.integer('order_id').unsigned().references('id').inTable('Order').nullable();
    t.string('charges_name');

    t.decimal('charges', 10, 2);

    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');

    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Other_charges');
};
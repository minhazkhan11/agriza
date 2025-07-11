exports.up = function (knex) {
  return knex.schema.createTable('Total_discount', (t) => {
    t.increments();

    t.string('total_discount_type');
    t.string('total_discount_name');
    t.decimal('total_discount', 10, 2);
    t.integer('order_id').unsigned().references('id').inTable('Order').nullable();

    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Total_discount');
};
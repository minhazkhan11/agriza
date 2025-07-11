
exports.up = function (knex) {
  return knex.schema.createTable('Order_item', (t) => {
    t.increments();

    t.decimal('quantity', 10, 2);
    t.decimal('price', 10, 2);
    t.decimal('offer', 10, 2);
    t.string('offer_type');
    t.integer('order_id').unsigned().references('id').inTable('Order').nullable();
    t.integer('item_variants_id').unsigned().references('id').inTable('Item_Variants').nullable();
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order_item');
};
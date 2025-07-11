
exports.up = function (knex) {
  return knex.schema.createTable('Item_varint_assigned_price_and_logistic_area ', (t) => {
    t.increments();
    t.decimal('price', 10, 2);
    t.integer('Logistic_area_id').unsigned().references('id').inTable('Logistic_area')
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Item_varint_assigned_price_and_logistic_area ');
};
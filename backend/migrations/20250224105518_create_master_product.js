
exports.up = function (knex) {
  return knex.schema.createTable('master_product', (t) => {
    t.increments();
    t.string('product_name');
    t.string('is_license');

    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('master_product');
};
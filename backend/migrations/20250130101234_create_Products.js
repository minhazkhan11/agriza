exports.up = function (knex) {
  return knex.schema.createTable('Product', (t) => {
    t.increments();

    t.string('product_name');
    t.string('alias');
    t.string('hsn_code');
    t.integer('marketers_id').unsigned().references('id').inTable('marketers');
    t.integer('product_category_id').unsigned().references('id').inTable('Product_category');
    t.integer('product_class_id').unsigned().references('id').inTable('Product_class');
    t.integer('brands_id').unsigned().references('id').inTable('brands');
    t.string('primary_unit_id');
    t.string('primary_quantity');
    t.string('secondary_unit_id');
    t.string('secondary_quantity');
    t.string('length');
    t.string('with');
    t.string('thickness');
    t.string('minimum_order_quantity');
    t.bigInteger('covering_unit_id');
    t.string('covering_quantity');
    t.text('conversion');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Product');
};

exports.up = function (knex) {
  return knex.schema.createTable('Product_child_category', (t) => {
    t.increments();

    t.string('product_child_category_name');
    t.text('description');

    t.integer('Product_sub_category_id').unsigned().references('id').inTable('Product_sub_category');
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Product_child_category');

};

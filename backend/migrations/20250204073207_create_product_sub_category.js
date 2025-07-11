exports.up = function (knex) {
  return knex.schema.createTable('Product_sub_category', (t) => {
    t.increments();

    t.string('product_sub_category_name');
    t.text('description');

    t.bigInteger('Product_category_id').unsigned().references('id').inTable('Product_category');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Product_sub_category');

};


exports.up = function (knex) {
  return knex.schema.createTable('product_catalogue', (t) => {
    t.increments();


    t.bigInteger('be_information_id').unsigned().references('id').inTable('Be_information');
    t.integer('Product_id').unsigned().references('id').inTable('Product');


    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('product_catalogue');
};






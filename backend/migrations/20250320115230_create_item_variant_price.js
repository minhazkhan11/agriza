exports.up = function (knex) {
  return knex.schema.createTable('Item_Variants_price', (t) => {
    t.increments();

    t.integer('mrp');
    t.integer('item_variants_id').unsigned().references('id').inTable('Item_Variants');
    t.integer('selling_price');
    t.integer('selling_price_percent');
    t.integer('cross_price');
    t.integer('cross_price_percent');


    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Item_Variants_price');
};


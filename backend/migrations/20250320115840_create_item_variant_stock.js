exports.up = function (knex) {
  return knex.schema.createTable('Item_Variants_stock', (t) => {
    t.increments();

    t.string('sku_code');
    t.integer('item_variants_id').unsigned().references('id').inTable('Item_Variants');
    t.integer('stock');
    t.string('stock_status');


    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Item_Variants_stock');
};


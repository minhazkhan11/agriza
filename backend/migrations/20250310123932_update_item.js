exports.up = function (knex) {
    return knex.schema.alterTable('Product', (t) => {
      t.string('product_origin');
      t.string('item_category');
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('Product', (t) => {
      t.dropColumn('product_origin');
      t.dropColumn('item_category');
    })
  };
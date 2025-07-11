exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants_price', (t) => {
    t.decimal('mrp', 10, 2).alter();
    t.decimal('selling_price', 10, 2).alter();
    t.decimal('selling_price_percent', 5, 2).alter();
    t.decimal('cross_price', 10, 2).alter();
    t.decimal('cross_price_percent', 5, 2).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants_price', (t) => {
    t.integer('mrp').alter();
    t.integer('selling_price').alter();
    t.integer('selling_price_percent').alter();
    t.integer('cross_price').alter();
    t.integer('cross_price_percent').alter();
  });
};

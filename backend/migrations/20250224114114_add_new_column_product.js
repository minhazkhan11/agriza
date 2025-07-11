exports.up = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.integer('master_product_id').unsigned().references('id').inTable('master_product')
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Product', (t) => {
    t.dropColumn('master_product_id');
  });
};
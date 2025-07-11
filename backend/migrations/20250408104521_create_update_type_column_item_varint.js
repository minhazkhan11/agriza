

exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {

    t.json('logistic_area_and_price_ids')
    t.dropColumn('Logistic_area_and_price_id');

  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {
    t.integer('Logistic_area_and_price_id');
    t.dropColumn('logistic_area_and_price_ids');


  });
};
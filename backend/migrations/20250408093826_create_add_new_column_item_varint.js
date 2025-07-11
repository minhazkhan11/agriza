exports.up = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {
    t.string('varint_price');
    t.string('item_delivery_type');
    t.integer('Logistic_area_and_price_id').unsigned().references('id').inTable('Item_varint_assigned_price_and_logistic_area');
 
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Item_Variants', (t) => {
    t.dropColumn('Logistic_area_and_price_id');
    t.dropColumn('varint_price');
    t.dropColumn('item_delivery_type');
   
  });
};




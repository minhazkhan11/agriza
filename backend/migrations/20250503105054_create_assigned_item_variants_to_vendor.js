
exports.up = function (knex) {
  return knex.schema.createTable('Assigned_item_variants_to_vendor', (t) => {
    t.increments();

    t.integer('vendor_be_id').unsigned().references('id').inTable('Be_information').nullable();
    t.integer('item_variants_id').unsigned().references('id').inTable('Item_Variants');
  
    
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Assigned_item_variants_to_vendor');
};
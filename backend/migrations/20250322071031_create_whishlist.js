exports.up = function (knex) {
    return knex.schema.createTable('Wishlist', (t) => {
      t.increments();
      
      t.bigInteger('product_id').notNullable();
        
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Wishlist');
  };
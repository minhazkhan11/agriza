exports.up = function (knex) {
    return knex.schema.createTable('Rack_point', (t) => {
      t.increments();
  
      t.text('rack_point');
      t.integer('place_id').unsigned().references('id').inTable('Place');
      t.text('rack_point_distanse');
     

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Rack_point');
  };
  
  
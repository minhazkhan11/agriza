exports.up = function (knex) {
    return knex.schema.createTable('Staff_assigned', (t) => {
      t.increments(); 

      t.integer('business_area_zone')
      t.json('business_area_id')
      t.json('warehouse_id')
      t.date('vector_date_change')

      t.bigInteger('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Staff_assigned');
  };
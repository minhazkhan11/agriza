exports.up = function (knex) {
    return knex.schema.createTable('ShipTOParty', (t) => {
      t.increments();
  
      t.string('business_name');
      t.string('gst_no');

      t.string('warehouse_name');
      t.text('warehouse_address');
      t.integer('pincode_id');
      t.integer('place_id');
      t.string('latitude')
      t.string('longitude')
      t.string('scm_person_name')
      t.string('mobile_no')
      t.string('email')

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('ShipToParty');
  };
  
  
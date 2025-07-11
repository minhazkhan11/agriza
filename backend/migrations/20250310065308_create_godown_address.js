exports.up = function (knex) {
    return knex.schema.createTable('GodownAddress', (t) => {
      t.increments();
  
      t.text('godown_address');
      t.integer('pincode_id').unsigned().references('id').inTable('Pin');
      t.integer('place_id').unsigned().references('id').inTable('Place')
      t.integer('license_id').unsigned().references('id').inTable('Be_license_details')

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('GodownAddress');
  };
  
  
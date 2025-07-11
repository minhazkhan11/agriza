exports.up = function (knex) {
    return knex.schema.createTable('ShipInfo', (t) => {
      t.increments();
  
      t.integer('ship_id');
      t.string('license_type');
      t.string('license_no');
      t.string('fms_no')

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('ShipInfo');
  };
  
  
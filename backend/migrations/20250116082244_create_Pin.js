exports.up = function (knex) {
    return knex.schema.createTable('Pin', (t) => {
      t.increments(); 

      t.bigInteger('pin_code');
      t.integer('tehsil_id').unsigned().references('id').inTable('Tehsil');
      t.bigInteger('added_by').unsigned().references('id').inTable('Users');

      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Pin');
  };
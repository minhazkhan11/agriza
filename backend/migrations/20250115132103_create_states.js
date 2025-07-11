exports.up = function (knex) {
    return knex.schema.createTable('State', (t) => {
      t.increments(); 

      t.string('state_name');
      t.integer('country_id').unsigned().references('id').inTable('Country');
      t.bigInteger('added_by').unsigned().references('id').inTable('Users');

      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('State');
  };
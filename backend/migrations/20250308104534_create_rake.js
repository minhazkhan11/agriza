exports.up = function (knex) {
    return knex.schema.createTable('Rake', (t) => {
      t.increments();
  
      t.string('name')
      t.integer('warehouse_id').unsigned().references('id').inTable('Be_warehouse_information');

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Rake');
  };
  
  
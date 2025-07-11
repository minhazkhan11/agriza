exports.up = function (knex) {
    return knex.schema.createTable('Logistic_area', (t) => {
      t.increments();
  
      t.string('name');
      t.text('demographic_include');
      t.json('demographic_includes_id');
     
      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Logistic_area');
  };
  
  
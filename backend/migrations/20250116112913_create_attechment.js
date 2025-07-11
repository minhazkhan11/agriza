exports.up = function (knex) {
    return knex.schema.createTable('Attachments', (t) => {
      t.increments();      
      t.text('photo_path').notNullable();
      t.bigInteger('entity_id').notNullable();
      t.string('entity_type').notNullable();
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Attachments');
  };
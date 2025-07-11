
exports.up = function (knex) {
    return knex.schema.createTable('Business_area', (t) => {
      t.increments();
      
      t.string('name');
      t.string('short_name');
      t.integer('code');
      t.integer('teritari_id').unsigned().references('id').inTable('Business_area_teritary');
      
      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Business_area');
  };
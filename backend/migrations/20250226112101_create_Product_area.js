
exports.up = function (knex) {
    return knex.schema.createTable('product_area', (t) => {
      t.increments();
      t.string('name');
      t.string('short_name');
      t.integer('code');
      t.integer('marketer_id').unsigned().references('id').inTable('marketers');
      t.text('demographic_include');
      t.integer('demographic_include_id');
      t.text('demographic_exclude');
      t.integer('demographic_exclude_id');
      
      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('product_area');
  };
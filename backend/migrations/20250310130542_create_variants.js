exports.up = function (knex) {
    return knex.schema.createTable('Variants', (t) => {
      t.increments();
  
      t.text('variant');
      t.integer('attribute_id').unsigned().references('id').inTable('Attributes');

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Variants');
  };
  
  
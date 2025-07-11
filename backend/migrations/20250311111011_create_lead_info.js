exports.up = function (knex) {
    return knex.schema.createTable('Leads_info', (t) => {
      t.increments();
  
    
      t.integer('lead_id').unsigned().references('id').inTable('Leads');
      t.integer('product_master_id').unsigned().references('id').inTable('Product');
      t.text('total_sale');
     

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Leads_info');
  };
  
  
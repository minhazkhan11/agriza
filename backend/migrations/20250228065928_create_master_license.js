exports.up = function (knex) {
    return knex.schema.createTable('Licenses', (t) => {
      t.increments(); 

      t.string('license_name');
      t.string('beneficiary_name');
      t.text('license_status');
      t.text('license_no');
      t.integer('license_category_id').unsigned().references('id').inTable('License_category');
      t.text('license_territory');
      t.integer('license_territory_id');
      t.text('office_address');
      t.integer('pin_code');
      t.json('godown_address');
      t.json('pincode');
      t.date('date_of_issue');
      t.date('date_of_expiry');
      t.string('author_by_issue');
      t.string('authority_name');
    
      t.bigInteger('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Licenses');
  };
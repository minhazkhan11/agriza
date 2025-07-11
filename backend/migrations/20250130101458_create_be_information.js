exports.up = function (knex) {
  return knex.schema.createTable('Be_information', (t) => {
    t.increments();

    t.string('gst_number')
    t.string('gst_address');
    t.string('postal_address');
    t.string('registerd_type')
    t.string('pan_number')
    t.string('business_name');
    t.string('short_name');
    t.string('phone');
    t.string('website');
    t.string('cin_number');
    t.string('msme_number');
    t.integer('menu_id')
    t.json('supplier_ids'); 
    t.json('business_category_ids'); 
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_information');
};

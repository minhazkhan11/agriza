exports.up = function (knex) {
  return knex.schema.createTable('Be_gst_details', (t) => {
    t.increments();

    t.string('gst_number')
    t.string('legal_name')
    t.string('trade_name')
    t.string('address_of_principal_place')

    t.integer('pin_id').unsigned().references('id').inTable('Pin');
    t.integer('place_id').unsigned().references('id').inTable('Place');
    t.integer('be_information_id').unsigned().references('id').inTable('Be_information');
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_gst_details');
};


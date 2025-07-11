exports.up = function (knex) {
  return knex.schema.createTable('License_Product', (t) => {
    t.increments();

    t.string('name_of_product')
    t.string('brand_name')
    t.string('source_of_supply')
    t.integer('be_license_id').unsigned().references('id').inTable('Be_license_details');
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('License_Product');
};


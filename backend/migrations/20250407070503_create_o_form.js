exports.up = function (knex) {
  return knex.schema.createTable('O_form_versioning ', (t) => {
    t.increments();
    t.string('o_form_versioning_name ');
    t.integer('license_id').unsigned().references('id').inTable('Be_license_details')
    t.json('license_product_id'),
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('O_form_versioning ');
};
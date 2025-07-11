
exports.up = function (knex) {
  return knex.schema.createTable('License_category', (t) => {
    t.increments();

    t.string('license_category_name');
    t.text('description');

    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('License_category');

};


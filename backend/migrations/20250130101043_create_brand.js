exports.up = function (knex) {
  return knex.schema.createTable('brands', (t) => {
    t.increments();

    t.string('brand_name');
    t.string('description');
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('brands');
};
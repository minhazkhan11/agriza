

exports.up = function (knex) {
  return knex.schema.createTable('UQc_data', (t) => {
    t.increments();
    t.string('name');
    t.text('description');

    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('UQc_data');
};
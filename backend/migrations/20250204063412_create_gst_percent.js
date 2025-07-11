exports.up = function (knex) {
  return knex.schema.createTable('GST_percent', (t) => {
    t.increments();

    t.decimal('gst_percent', 5, 2);
    t.string('description');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');

    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('GST_percent');
};
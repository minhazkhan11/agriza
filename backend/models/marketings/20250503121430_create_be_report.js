
exports.up = function (knex) {
  return knex.schema.createTable('information_id', (t) => {
    t.increments();

    t.text('report');
    t.string('entity_type');
    t.integer('be_information_id').unsigned().references('id').inTable('Be_information');

    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('information_id');
};
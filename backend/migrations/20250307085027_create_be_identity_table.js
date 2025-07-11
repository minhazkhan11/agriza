
exports.up = function (knex) {

  return knex.schema.createTable('Be_identity_table', (t) => {
    t.increments();

    t.string('entity_type');
    t.integer('be_id')
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_identity_table');
};

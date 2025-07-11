
exports.up = function (knex) {

  return knex.schema.createTable('Assigned_to', (t) => {
    t.increments();



    t.integer('be_information_id').unsigned().references('id').inTable('Be_information');

    t.integer('user_id').unsigned().references('id').inTable('Users');

    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Assigned_to');
};

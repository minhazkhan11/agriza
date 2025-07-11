
exports.up = function (knex) {
  return knex.schema.createTable('Constitution', (t) => {
    t.increments();
    t.string('name');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Constitution');

};

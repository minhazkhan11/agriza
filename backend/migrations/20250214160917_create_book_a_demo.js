
exports.up = function (knex) {
  return knex.schema.createTable('book_a_demo', (t) => {
    t.increments();
    t.string('full_name');
    t.string('email');
    t.string('phone');
    t.string('company');
    t.string('city');
    t.string('invite_guest');
    t.string('time');
    t.date('date');
    
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('book_a_demo');
};

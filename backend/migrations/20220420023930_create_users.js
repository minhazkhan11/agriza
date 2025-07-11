exports.up = function (knex) {
  return knex.schema.createTable('Users', (t) => {
    t.increments();
    t.string('first_name');
    t.string('last_name');
    t.string('full_name');
    t.string('email');
    t.string('phone');
    t.string('password');
    t.string('pan');
    t.string('aadhaar');
    t.string('alternative_phone'),
      t.enu('role', ['superadmin', 'admin', 'user'], { useNative: false }).defaultTo('user');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};

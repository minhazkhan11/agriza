exports.up = function (knex) {
  return knex.schema.createTable('Be_persons', (t) => {
    t.increments();
    t.string('first_name');
    t.string('last_name');
    t.string('full_name');
    t.string('email');
    t.string('phone');
    t.string('pan');
    t.string('aadhaar');
    t.string('alternative_phone'),
      t.string('r_address');
    t.string('father_name');
    t.integer('place_id').unsigned().references('id').inTable('Place')
    t.integer('pincode_id').unsigned().references('id').inTable('Pin')
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_persons');
};

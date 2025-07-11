exports.up = function (knex) {
  return knex.schema.createTable('Be_warehouse_information', (t) => {
    t.increments();

    t.string('name')
    t.text('description')
    t.string('email')
    t.string('phone')


    t.string('person_name')
    t.string('person_mobile')


    t.string('latitude')
    t.string('longitude')
    t.string('tehsil')
    t.string('pincode')
    t.string('address')

    t.bigInteger('be_information_id').unsigned().references('id').inTable('Be_information');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_warehouse_information');
};

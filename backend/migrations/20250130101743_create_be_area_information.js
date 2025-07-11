exports.up = function (knex) {
  return knex.schema.createTable('Be_area_information', (t) => {
    t.increments();

    t.string('area_name');
    t.string('short_name');
    t.string('area_code');
    t.text('description');

    t.string('person_name');
    t.string('person_phone');

    t.integer('state_id').unsigned().references('id').inTable('State');
    t.integer('district_id').unsigned().references('id').inTable('District');
    t.integer('tehsil_id').unsigned().references('id').inTable('Tehsil');
    t.integer('pin_id').unsigned().references('id').inTable('Pin');
    t.integer('place_id').unsigned().references('id').inTable('Place');


    t.bigInteger('be_information_id').unsigned().references('id').inTable('Be_information');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_area_information');
};

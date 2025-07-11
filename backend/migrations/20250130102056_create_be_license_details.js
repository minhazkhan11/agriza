exports.up = function (knex) {
  return knex.schema.createTable('Be_license_details', (t) => {
    t.increments();

    t.string('category')
    t.string('license_type')
    t.string('license_territory')
    t.date('date_of_issue')
    t.date('date_of_expiry')

    t.string('authority')
    t.string('form_o_generated')


    t.bigInteger('be_information_id').unsigned().references('id').inTable('Be_information');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_license_details');
};


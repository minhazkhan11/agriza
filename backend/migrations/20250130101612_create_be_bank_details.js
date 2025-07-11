exports.up = function (knex) {
  return knex.schema.createTable('Be_bank_details', (t) => {
    t.increments();

    t.string('bank_name')
    t.string('branch')
    t.string('bank_account_number')
    t.string('ifsc_code')


    t.bigInteger('be_information_id').unsigned().references('id').inTable('Be_information');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Be_bank_details');
};


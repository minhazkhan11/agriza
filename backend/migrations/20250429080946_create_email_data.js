exports.up = function (knex) {
  return knex.schema.createTable('O_Form_email_data', (t) => {
    t.increments();


    t.text('license_file_path')
    t.text('o_form_file_path')
  
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');

    t.integer('receiver_id')
    t.integer('o_form_issue_id').unsigned().references('id').inTable('O_form_issue').nullable();
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('O_Form_email_data');
};
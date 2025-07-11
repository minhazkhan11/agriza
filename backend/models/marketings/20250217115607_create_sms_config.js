exports.up = function (knex) {
  return knex.schema.createTable('Sms_config', (t) => {
    t.increments();

    t.string('username ');
    t.string('password');
    t.string('sender_id');
    t.string('client_sms_id');
    t.string('entity_id');
    t.string('temp_id');


    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Sms_config');
};

exports.up = function (knex) {
  return knex.schema.createTable('Text_sms_users', (t) => {
    t.increments();

    t.bigInteger('text_sms_id').unsigned().references('id').inTable('Text_sms').nullable();

    t.string('sender_name ');
    t.string('phone');
    t.string('email');
    t.timestamp('date');
    t.time('time');
    t.enu('status', ['delivered', 'pending'], { useNative: false }).defaultTo('pending');

    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Text_sms_users');
};
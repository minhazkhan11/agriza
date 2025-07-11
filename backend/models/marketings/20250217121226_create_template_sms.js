exports.up = function (knex) {
  return knex.schema.createTable('Template_sms', (t) => {
    t.increments();

    t.string('name ');
    t.text('message');
    t.string('template_id');
    t.text('remark');
    t.enu('status', ['approve', 'reject', 'pending'], { useNative: false }).defaultTo('pending');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('Template_sms');
};

exports.up = function (knex) {
  return knex.schema.createTable('Order_follow_up', (t) => {
    t.increments();
    t.string('type');
    t.date('follow_up_date');
    t.time('afollow_up_date');
    t.text('Comments');
    t.integer('customer_be_id').unsigned().references('id').inTable('Be_information').nullable();
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order_follow_up');
};

exports.up = function (knex) {
  return knex.schema.createTable('Customer_lead', (t) => {
    t.increments();
    t.string('name');
    t.string('email');
    t.string('phone');
    t.string('remark');
    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Customer_lead');
};
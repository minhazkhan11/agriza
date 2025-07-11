
exports.up = function (knex) {
  return knex.schema.createTable('Business_sub_category', (t) => {
    t.increments();

    t.string('sub_category_name');
    t.string('description');
    t.bigInteger('business_category_id').unsigned().references('id').inTable('Business_category');
    t.bigInteger('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Business_sub_category');
};

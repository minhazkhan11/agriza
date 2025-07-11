exports.up = function (knex) {
  return knex.schema.alterTable('Be_gst_person_assigned', (t) => {
    t.string('is_admin');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_gst_person_assigned', (t) => {
    t.dropColumn('is_admin')
  });
};

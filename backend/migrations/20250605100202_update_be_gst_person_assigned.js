exports.up = function (knex) {
  return knex.schema.alterTable('Be_gst_person_assigned', (t) => {
    t.boolean('is_owner_person').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_gst_person_assigned', (t) => {
    t.dropColumn('is_owner_person');
  });
};

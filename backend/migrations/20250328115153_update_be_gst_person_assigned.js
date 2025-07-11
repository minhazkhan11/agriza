exports.up = function (knex) {
  return knex.schema.alterTable('Be_gst_person_assigned', (t) => {
    t.integer('user_id').unsigned().references('id').inTable('Users');
    t.dropColumn('person_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_gst_person_assigned', (t) => {
    t.dropColumn('user_id');
    t.integer('person_id').unsigned().references('id').inTable('Be_persons');
  });
};




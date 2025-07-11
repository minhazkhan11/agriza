exports.up = function (knex) {
  return knex.schema.createTable('Be_person_assigned', (t) => {
    t.increments();
 
    t.integer('be_information_id').unsigned().references('id').inTable('Be_information');
    t.integer('person_id').unsigned().references('id').inTable('Be_persons');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.integer('added_by').unsigned().references('id').inTable('Users').nullable();
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('Be_person_assigned');
};

exports.up = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
      t.string('business_area_zone').alter(); 
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Staff_assigned', (t) => {
      t.integer('business_area_zone').alter(); 
  });
};

exports.up = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.integer('place_id').unsigned().references('id').inTable('Place')
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.dropColumn('place_id');
    });
  };
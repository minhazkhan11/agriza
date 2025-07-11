exports.up = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.json('place_ids');
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.dropColumn('place_ids');
    })
  };
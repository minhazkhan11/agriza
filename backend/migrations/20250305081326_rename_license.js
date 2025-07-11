exports.up = function(knex) {
    return knex.schema.dropTableIfExists('Be_license_details');
    return knex.schema.renameTable('Licenses', 'Be_license_details');
  };
  
  exports.down = function(knex) {
    return knex.schema.renameTable('Be_license_details', 'Licenses'); // Rollback ke liye
  };
  
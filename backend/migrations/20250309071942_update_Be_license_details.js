exports.up = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.integer('license_territory_id'); 
      t.renameColumn('place_ids', 'godown_place_id');
      t.renameColumn('pincode', 'godown_pincode'); 
      t.dropColumn('license_territory_ids');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.dropColumn('license_territory_id'); 
      t.renameColumn('godown_place_id', 'place_ids');
      t.renameColumn('godown_pincode', 'pincode'); 
    });
  };
  
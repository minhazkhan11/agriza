exports.up = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.integer('state').unsigned().references('id').inTable('State')
      t.integer('district').unsigned().references('id').inTable('District')
      t.integer('tehsil').unsigned().references('id').inTable('Tehsil')
      t.dropColumn('license_territory_id');
      t.json('license_territory_ids');
      t.json('warehouse');
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('Be_license_details', (t) => {
      t.dropColumn('state');
      t.dropColumn('district');
      t.dropColumn('tehsil');
      t.dropColumn('license_territory_ids');
      t.dropColumn('warehouse');
    });
  };
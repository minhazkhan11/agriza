exports.up = function (knex) {
    return knex.schema.alterTable('Be_warehouse_information', (t) => {
      t.integer('place_id').unsigned().references('id').inTable('Place')
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('Be_warehouse_information', (t) => {
      t.dropColumn('place_id');
    });
  };
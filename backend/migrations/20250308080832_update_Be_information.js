exports.up = function (knex) {
    return knex.schema.alterTable('Be_information', (t) => {
      t.integer('postal_place_id').unsigned().references('id').inTable('Place')
      t.integer('gst_place_id').unsigned().references('id').inTable('Place')
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('Be_information', (t) => {
      t.dropColumn('postal_place_id');
      t.dropColumn('gst_place_id');
    });
  };



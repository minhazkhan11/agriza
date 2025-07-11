exports.up = function (knex) {
  return knex.schema.alterTable('UQc_data', (t) => {
    t.string('quantity');
    t.string('quantity_type');
  });

};

exports.down = function (knex) {
  return knex.schema.alterTable('UQc_data', (t) => {
    t.dropColumn('quantity');
    t.dropColumn('quantity_type');

  });
};

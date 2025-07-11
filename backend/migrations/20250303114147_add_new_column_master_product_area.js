

exports.up = function (knex) {
  return knex.schema.alterTable('product_area', (t) => {
    t.json('demographic_exclude_2_id');
    t.text('demographic_exclude_2');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('product_area', (t) => {
    t.dropColumn('demographic_exclude_2_id');
    t.dropColumn('demographic_exclude_2');

  });
};


exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {
    t.json('business_sub_categorys_ids');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {
    t.dropColumn('business_sub_categorys_ids');
  });
};


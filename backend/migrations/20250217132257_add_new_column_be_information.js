
exports.up = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {
    t.string('msme_registered');
    t.string('business_incorporated');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_information', (t) => {
    t.dropColumn('msme_registered');
    t.dropColumn('business_incorporated');
  });
};


exports.up = function (knex) {
  return knex.schema.alterTable('Be_bank_details', (t) => {

    t.renameColumn('benifashiyal_name', 'benificiary_name');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_bank_details', (t) => {

    t.renameColumn('benificiary_name', 'benifashiyal_name');
  });
};

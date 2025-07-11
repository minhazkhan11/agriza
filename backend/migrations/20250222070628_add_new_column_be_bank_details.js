


exports.up = function (knex) {
  return knex.schema.alterTable('Be_bank_details', (t) => {

    t.string('confirm_bank_account_number');

  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Be_bank_details', (t) => {

    t.dropColumn('confirm_bank_account_number');

  });
};
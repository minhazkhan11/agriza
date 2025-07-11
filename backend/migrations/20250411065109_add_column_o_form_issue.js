exports.up = function (knex) {
  return knex.schema.alterTable('O_form_issue', (t) => {
    t.string('issue_type');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('O_form_issue', (t) => {
    t.dropColumn('issue_type');
  });
};

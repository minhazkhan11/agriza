exports.up = function (knex) {
  return knex.schema.alterTable('O_form_issue', (t) => {
    t.string('entity_type');
    t.integer('lead_id').unsigned().references('id').inTable('Leads');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('O_form_issue', (t) => {
    t.dropColumn('entity_type');
    t.dropColumn('lead_id');
  });
};

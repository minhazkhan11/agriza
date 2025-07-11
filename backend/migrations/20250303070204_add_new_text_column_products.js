exports.up = function (knex) {
  return knex.schema.alterTable('Product', (t) => {

    t.text('discription');
    t.text('specification');
    t.text('benifits');
    t.text('how_to_use');
    t.text('country_of_origin');
    t.text('disclaimar');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Product', (t) => {

    t.dropColumn('discription');
    t.dropColumn('specification');
    t.dropColumn('benifits');
    t.dropColumn('how_to_use');
    t.dropColumn('country_of_origin');
    t.dropColumn('disclaimar');
  });
};



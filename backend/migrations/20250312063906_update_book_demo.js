exports.up = function (knex) {
    return knex.schema.alterTable('book_a_demo', (t) => {
      t.string('business');
      t.dropColumn('company');
      t.dropColumn('city');
      t.dropColumn('invite_guest');
    });
  };
  exports.down = function (knex) {
    return knex.schema.alterTable('book_a_demo', (t) => {
      t.dropColumn('business');
      t.string('company');
      t.string('city');
      t.string('invite_guest');
    })
  };
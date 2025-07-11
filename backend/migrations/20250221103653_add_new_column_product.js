exports.up = function (knex) {
  return knex.schema.alterTable('Product', (t) => {

    t.string('covering_length');
    t.string('covering_width');
    t.string('covering_thickness');
    t.string('covering_weight');
    t.string('piece_weight');


    t.renameColumn('length', 'piece_length');
    t.renameColumn('with', 'piece_width');
    t.renameColumn('thickness', 'piece_thickness');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Product', (t) => {

    t.dropColumn('covering_length');
    t.dropColumn('covering_width');
    t.dropColumn('covering_thickness');
    t.dropColumn('covering_weight');
    t.dropColumn('piece_weight');


    t.renameColumn('piece_length', 'length');
    t.renameColumn('piece_width', 'with');
    t.renameColumn('piece_thickness', 'thickness');
  });
};

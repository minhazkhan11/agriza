exports.up = function (knex) {
  return knex.schema.createTable('Item_Variants', (t) => {
    t.increments();

    t.string('variant_name');
    t.integer('item_id').unsigned().references('id').inTable('Product');
    t.string('moq');
    t.json('attribute_ids');
    t.json('variants_ids');

    t.integer('primary_unit_id').unsigned().references('id').inTable('Units');
    t.string('primary_quantity');
    t.integer('secondary_unit_id').unsigned().references('id').inTable('Units');
    t.string('secondary_quantity');
    t.integer('covering_unit_id').unsigned().references('id').inTable('Units');
    t.string('covering_quantity');

    t.string('covering_length');
    t.string('covering_width');
    t.string('covering_thickness');
    t.string('covering_weight');

    t.string('piece_weight');
    t.string('piece_length');
    t.string('piece_width');
    t.string('piece_thickness');

    t.integer('added_by').unsigned().references('id').inTable('Users');
    t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
    t.dateTime('created_at');
    t.dateTime('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Item_Variants');
};




exports.up = function (knex) {
    return knex.schema.alterTable('product_area', (t) => {
        t.dropColumn('demographic_include_id');
        t.dropColumn('demographic_exclude_id');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('product_area', (t) => {
        t.integer('demographic_include_id');
        t.integer('demographic_exclude_id');
    });
};


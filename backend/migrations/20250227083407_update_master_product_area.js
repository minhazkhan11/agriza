

exports.up = function (knex) {
    return knex.schema.alterTable('product_area', (t) => {
        t.json('demographic_includes_id');
        t.json('demographic_excludes_id');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('product_area', (t) => {
        t.dropColumn('demographic_include_id');
        t.dropColumn('demographic_exclude_id');
        
    });
};


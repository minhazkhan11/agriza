
exports.up = function (knex) {
    return knex.schema.alterTable('Business_area_teritary', (t) => {
        t.dropColumn('demographic');
        t.dropColumn('demographic__id');
        t.json('demographic_include_id');
        t.text('demographic_include');
        t.json('demographic_exclude_id');
        t.text('demographic_exclude');
        
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('Business_area_teritary', (t) => {
        t.integer('demographic');
        t.integer('demographic__id');
        t.dropColumn('demographic_include_id');
        t.dropColumn('demographic_include');
        t.dropColumn('demographic_exclude_id');
        t.dropColumn('demographic_exclude');
    
    });
};
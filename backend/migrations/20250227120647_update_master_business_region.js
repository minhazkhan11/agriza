
exports.up = function (knex) {
    return knex.schema.alterTable('Business_area_region', (t) => {
        t.dropColumn('area_id'); 
        t.json('area_ids'); 
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('Business_area_region', (t) => {
        t.integer('area_id');
        t.dropColumn('area_ids');
    });
};
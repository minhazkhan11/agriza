
exports.up = function (knex) {
    return knex.schema.alterTable('Business_area_zone', (t) => {
        t.dropColumn('region_id'); 
        t.json('region_ids'); 
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('Business_area_zone', (t) => {
        t.integer('region_id');
        t.dropColumn('region_ids');
    });
};
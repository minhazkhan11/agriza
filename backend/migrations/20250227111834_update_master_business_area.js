
exports.up = function (knex) {
    return knex.schema.alterTable('Business_area', (t) => {
        t.dropColumn('teritari_id'); 
        t.json('teritari_ids'); 
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('Business_area', (t) => {
        t.integer('teritari_id');
        t.dropColumn('teritari_ids');
    });
};
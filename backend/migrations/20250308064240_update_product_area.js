exports.up = function (knex) {
    return knex.schema.alterTable('product_area', function (t) {
  
      t.dropColumn('name');
      t.dropColumn('short_name');
      t.dropColumn('code');
      
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('product_area', function (t) {
        t.string('name');
        t.string('short_name');
        t.integer('code');
    });
  };
  
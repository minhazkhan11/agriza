exports.up = function(knex) {
  return knex.schema.renameTable('ShipTOParty', 'Delivery_Point');
};

exports.down = function(knex) {
  return knex.schema.renameTable('Delivery_Point', 'ShipTOParty'); 
};

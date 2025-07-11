exports.up = async function (knex) {
  await knex.schema.renameTable('Order_follow_up', 'Activity');
  await knex.schema.alterTable('Activity', (table) => {
    table.string('entity_type');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('Activity', (table) => {
    table.dropColumn('entity_type');
  });
  await knex.schema.renameTable('Activity', 'Order_follow_up');
};

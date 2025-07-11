exports.up = async function (knex) {
  await knex.raw(`
      ALTER TABLE "brands" DROP CONSTRAINT IF EXISTS "brands_active_status_check";
      ALTER TABLE "brands" ADD CONSTRAINT "brands_active_status_check"
      CHECK ("active_status" IN ('active', 'inactive', 'deleted', 'hidden', 'pending', 'cancelled'));
  `);
  await knex.schema.alterTable("brands", function (table) {
    table.text("remark").nullable(); 
  });
};

exports.down = async function (knex) {
  await knex.raw(`
      ALTER TABLE "brands" DROP CONSTRAINT IF EXISTS "brands_active_status_check";
      ALTER TABLE "brands" ADD CONSTRAINT "brands_active_status_check"
      CHECK ("active_status" IN ('active', 'inactive', 'deleted', 'hidden', 'pending'));
  `);
  await knex.schema.alterTable("brands", function (table) {
    table.dropColumn("remark");
  });
};




exports.up = async function (knex) {
    await knex.raw(`
        ALTER TABLE "marketers" DROP CONSTRAINT IF EXISTS "marketers_active_status_check";
        ALTER TABLE "marketers" ADD CONSTRAINT "marketers_active_status_check"
        CHECK ("active_status" IN ('active', 'inactive', 'deleted', 'hidden', 'pending'));
    `);
};

exports.down = async function (knex) {
    await knex.raw(`
        ALTER TABLE "marketers" DROP CONSTRAINT IF EXISTS "marketers_active_status_check";
        ALTER TABLE "marketers" ADD CONSTRAINT "marketers_active_status_check"
        CHECK ("active_status" IN ('active', 'inactive', 'deleted', 'hidden'));
    `);
};

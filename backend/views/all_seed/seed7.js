const moment = require('moment');
exports.seed = async function (knex) {
  console.log('Seeding be_module_plans_updation table...');
  const IntegratedModulePlansRecords = [
    {
      id: 1,
      curent_module_plan_id: 1,
      new_module_plan_id: 2,
      updated_module_plan_id: 1,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 2,
      curent_module_plan_id: 3,
      new_module_plan_id: 2,
      updated_module_plan_id: 1,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 3,
      curent_module_plan_id: 4,
      new_module_plan_id: 2,
      updated_module_plan_id: 7,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },

  ];
  try {
    // :one: **Option 1: Truncate & Reset IDs (Best for Fresh Start)**
    await knex.raw('TRUNCATE TABLE "be_module_plans_updation" RESTART IDENTITY CASCADE');
    // :two: **Insert New Records**
    console.log('Inserting be_module_plans_updation records...');
    await knex('be_module_plans_updation').insert(IntegratedModulePlansRecords);
    // :three: **Fix ID Sequence to Start from MAX(id)**
    await knex.raw(`
      SELECT SETVAL('public."be_module_plans_updation_id_seq"',
      COALESCE((SELECT MAX(id) FROM "be_module_plans_updation"), 1), false);
    `);
    console.log('be_module_plans_updation seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding be_module_plans_updation table:', error);
  }
};
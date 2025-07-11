const moment = require('moment');
exports.seed = async function (knex) {
  console.log('Seeding Integrated_module_plans table...');
  const IntegratedModulePlansRecords = [
    {
      id: 1,
      plan_name: 'Agriza Both Paid',
      index_id: 1,
      cost: 1000,
      be_admin_menu_plan_id: 2,
      procurement_menu_plan_id: 10,
      salesman_menu_plan_id: 18,
      scm_menu_plan_id: 26,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 2,
      plan_name: 'Agriza Seller Paid',
      index_id: 2,
      cost: 1000,
      be_admin_menu_plan_id: 3,
      procurement_menu_plan_id: 11,
      salesman_menu_plan_id: 19,
      scm_menu_plan_id: 27,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 3,
      plan_name: 'Agriza Buyer Paid',
      index_id: 3,
      cost: 1000,
      be_admin_menu_plan_id: 4,
      procurement_menu_plan_id: 12,
      salesman_menu_plan_id: 20,
      scm_menu_plan_id: 28,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 4,
      plan_name: 'Ariza Both Unpaid',
      index_id: 1,
      cost: 1000,
      be_admin_menu_plan_id: 5,
      procurement_menu_plan_id: 13,
      salesman_menu_plan_id: 21,
      scm_menu_plan_id: 29,
      active_status: 'inactive',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 5,
      plan_name: 'Agriza Seller Unpaid',
      index_id: 1,
      cost: 1000,
      be_admin_menu_plan_id: 6,
      procurement_menu_plan_id: 14,
      salesman_menu_plan_id: 22,
      scm_menu_plan_id: 30,
      active_status: 'inactive',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 6,
      plan_name: 'Agriza Buyer Unpaid',
      index_id: 1,
      cost: 1000,
      be_admin_menu_plan_id: 7,
      procurement_menu_plan_id: 15,
      salesman_menu_plan_id: 23,
      scm_menu_plan_id: 31,
      active_status: 'inactive',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 7,
      plan_name: 'Agriza Seller Paid - Buyer Unpaid',
      index_id: 1,
      cost: 1000,
      be_admin_menu_plan_id: 8,
      procurement_menu_plan_id: 16,
      salesman_menu_plan_id: 24,
      scm_menu_plan_id: 32,
      active_status: 'inactive',
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 8,
      plan_name: 'Agriza Buyer Paid - Seller Unpaid',
      index_id: 1,
      cost: 1000,
      be_admin_menu_plan_id: 9,
      procurement_menu_plan_id: 17,
      salesman_menu_plan_id: 25,
      scm_menu_plan_id: 33,
      active_status: 'inactive',

      created_at: moment(),
      updated_at: moment(),
    },
  ];
  try {
    // :one: **Option 1: Truncate & Reset IDs (Best for Fresh Start)**
    await knex.raw('TRUNCATE TABLE "Integrated_module_plans" RESTART IDENTITY CASCADE');
    // :two: **Insert New Records**
    console.log('Inserting Integrated_module_plans records...');
    await knex('Integrated_module_plans').insert(IntegratedModulePlansRecords);
    // :three: **Fix ID Sequence to Start from MAX(id)**
    await knex.raw(`
      SELECT SETVAL('public."Integrated_module_plans_id_seq"',
      COALESCE((SELECT MAX(id) FROM "Integrated_module_plans"), 1), true);
    `);
    console.log('Integrated_module_plans seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Integrated_module_plans table:', error);
  }
};
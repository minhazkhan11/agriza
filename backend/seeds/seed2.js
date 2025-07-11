const moment = require('moment');
exports.seed = async function (knex) {
  console.log('Seeding Menu Plan table...');
  const MenuplanRecords = [
    {
      id: 1,
      menu_name: 'Agriza_superadmin',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 2,
      menu_name: 'Ariza_be_admin_Both_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 3,
      menu_name: 'Ariza_be_admin_Seller_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 4,
      menu_name: 'Ariza_be_admin_Buyer_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 5,
      menu_name: 'Ariza_be_admin_Both_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 6,
      menu_name: 'Ariza_be_admin_Seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 7,
      menu_name: 'Ariza_be_admin_Buyer_updaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 8,
      menu_name: 'Ariza_be_admin_Seller_paid_buyer_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 9,
      menu_name: 'Ariza_be_admin_Buyer_paid_seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 10,
      menu_name: 'Ariza_procurement_Both_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 11,
      menu_name: 'Ariza_procurement_Seller_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 12,
      menu_name: 'Ariza_procurement_Buyer_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 13,
      menu_name: 'Ariza_procurement_Both_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 14,
      menu_name: 'Ariza_procurement_Seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 15,
      menu_name: 'Ariza_procurement_Buyer_updaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 16,
      menu_name: 'Ariza_procurement_Seller_paid_buyer_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 17,
      menu_name: 'Ariza_procurement_Buyer_paid_seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 18,
      menu_name: 'Ariza_salesman_Both_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 19,
      menu_name: 'Ariza_salesman_Seller_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 20,
      menu_name: 'Ariza_salesman_Buyer_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 21,
      menu_name: 'Ariza_salesman_Both_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 22,
      menu_name: 'Ariza_salesman_Seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 23,
      menu_name: 'Ariza_salesman_Buyer_updaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 24,
      menu_name: 'Ariza_salesman_Seller_paid_buyer_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 25,
      menu_name: 'Ariza_salesman_Buyer_paid_seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 26,
      menu_name: 'Ariza_SCM_Both_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 27,
      menu_name: 'Ariza_SCM_Seller_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 28,
      menu_name: 'Ariza_SCM_Buyer_paid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 29,
      menu_name: 'Ariza_SCM_Both_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 30,
      menu_name: 'Ariza_SCM_Seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 31,
      menu_name: 'Ariza_SCM_Buyer_updaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 32,
      menu_name: 'Ariza_SCM_Seller_paid_buyer_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 33,
      menu_name: 'Ariza_SCM_Buyer_paid_seller_unpaid',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 34,
      menu_name: 'Ariza_Finance',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 35,
      menu_name: 'Ariza_Logistics',
      active_status: 'deleted',
      added_by: 1,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 36,
      menu_name: 'Admin',
      active_status: 'active',
      added_by: null,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 37,
      menu_name: 'Manager',
      active_status: 'active',
      added_by: null,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 38,
      menu_name: 'Sales',
      active_status: 'active',
      added_by: null,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 39,
      menu_name: 'Procurement',
      active_status: 'active',
      added_by: null,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 40,
      menu_name: 'Dispatch',
      active_status: 'active',
      added_by: null,
      created_at: moment(),
      updated_at: moment()
    },
    {
      id: 41,
      menu_name: 'Agent',
      active_status: 'active',
      added_by: null,
      created_at: moment(),
      updated_at: moment()
    },
  ];
  try {
    // :one: **Option 1: Truncate & Reset IDs (Best for Fresh Start)**
    await knex.raw('TRUNCATE TABLE "Menu_plan" RESTART IDENTITY CASCADE');
    // :two: **Insert New Records**
    console.log('Inserting Menu Plan records...');
    await knex('Menu_plan').insert(MenuplanRecords);
    // :three: **Fix ID Sequence to Start from MAX(id)**
    await knex.raw(`SELECT SETVAL('public."Menu_plan_id_seq"', COALESCE((SELECT MAX(id) FROM "Menu_plan"), 1), true);`);
    console.log('Menu Plan seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Menu Plan table:', error);
  }
};
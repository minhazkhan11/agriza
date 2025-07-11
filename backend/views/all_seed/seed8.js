const moment = require('moment');
exports.seed = async function (knex) {
  console.log('Seeding Constitution table...');
  const ConstitutionRecords = [
    {
      id: 1,
      name: 'Sole Proprietorship Firm',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 2,
      name: 'Partnership Firm',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 3,
      name: 'Limited Liability Partnership (LLP)',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 4,
      name: 'Private Limited Company',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 5,
      name: 'Public Limited Company',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 6,
      name: 'One Person Company',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 7,
      name: 'Coperative Society (MSCS)',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 8,
      name: 'Coperative Society (State)',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
    {
      id: 9,
      name: 'FPO',
      active_status: 'active',
      added_by: 1,
      created_at: moment(),
      updated_at: moment(),
    },
  ];
  try {
    // :one: **Option 1: Truncate & Reset IDs (Best for Fresh Start)**
    await knex.raw('TRUNCATE TABLE "Constitution" RESTART IDENTITY CASCADE');
    // :two: **Insert New Records**
    console.log('Inserting Constitution records...');
    await knex('Constitution').insert(ConstitutionRecords);
    // :three: **Fix ID Sequence to Start from MAX(id)**
    await knex.raw(`
      SELECT SETVAL('public."Constitution_id_seq"',
      COALESCE((SELECT MAX(id) FROM "Constitution"), 1), false);
    `);
    console.log('Constitution seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Constitution table:', error);
  }
};
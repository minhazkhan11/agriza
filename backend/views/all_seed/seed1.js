const moment = require('moment');
const bcrypt = require('bcrypt');
const { bcryptConfig } = require('../../config');
exports.seed = async function (knex) {
  console.log('Seeding users table...');
  // Hash Password
  const password = bcrypt.hashSync('123456', bcryptConfig.hashRound);
  // Create users records
  const userRecords = [
    {
      id: 1,
      first_name: 'Admin',
      last_name: '',
      full_name: 'Agriza',
      phone: '9234567890',
      email: 'agriza.code@gmail.com',
      password,
      role: 'superadmin',
      menu_plan_id: 1,
      active_status: 'active',
      created_at: moment(),
      updated_at: moment(),
    },
  ];
  try {
    // :one: **Option 1: Truncate & Reset IDs (Best for Fresh Start)**
    await knex.raw('TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE');
    // :two: **Insert New Records**
    console.log('Inserting users records...');
    await knex('Users').insert(userRecords);
    // :three: **Fix ID Sequence to Start from MAX(id)**
    await knex.raw(`SELECT SETVAL('public."Users_id_seq"', COALESCE((SELECT MAX(id) FROM "Users"), 1), false);`);
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding users table:', error);
  }
};
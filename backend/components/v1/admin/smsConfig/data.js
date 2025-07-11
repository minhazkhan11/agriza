














 exports.up = function (knex) {
  return knex.schema.createTable('Template_whatsapp', (t) => {
      t.increments();

      t.string('name ');
      t.text('message');
     
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
      t.timestamp('created_at');
      t.timestamp('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Template_whatsapp');
};

















 exports.up = function (knex) {
  return knex.schema.createTable('Mail_inbox', (t) => {
      t.increments();

      t.integer('seqno');
      t.string('name');
      t.string('from');
      t.string('to');
      t.string('subject');
      t.timestamp('date');
      t.text('message');

      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.bigInteger('added_by').unsigned().references('id').inTable('Users').nullable();
      t.timestamp('created_at');
      t.timestamp('updated_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Mail_inbox');
};










 exports.up = function (knex) {
  return knex.schema.alterTable('Mail_inbox', (t) => {
      t.enu('status', ['unread', 'read'], { useNative: false }).defaultTo('unread'); 
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Mail_inbox', (t) => {
      t.dropColumn('status');
  });
};
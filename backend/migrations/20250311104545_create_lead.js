exports.up = function (knex) {
    return knex.schema.createTable('Leads', (t) => {
      t.increments();
  
      t.integer('lead_category_id').unsigned().references('id').inTable('Lead_category');
      t.integer('lead_subcategory_id').unsigned().references('id').inTable('Lead_sub_category');
      t.text('is_bussiness');
      t.text('gst_number');
      t.text('pan_number');
      t.text('type_of_organization');
      t.text('business_name');
      t.text('r_office_address');
      t.integer('r_office_pincode_id');
      t.integer('r_office_place_id');
      t.text('postal_office_address');
      t.integer('postal_office_pincode_id');
      t.integer('postal_office_place_id');
      t.text('year_of_establishment');
      t.json('nearest_rack_point_id');
      t.integer('product_category_id');
      t.json('discreet_marketer_id');
      t.text('name_of_dealing_person');
      t.string('mobile_number');
      t.string('whatsapp_number');
      t.string('email');
      t.string('alternative_number');
      t.text('fertilizer_license_number');
      t.text('pesticide_license_number');
      t.text('seed_license_number');
      t.text('msme_udyam_registration_number');

      t.integer('added_by').unsigned().references('id').inTable('Users');
      t.enu('active_status', ['active', 'inactive', 'deleted', 'hidden'], { useNative: false }).defaultTo('active');
      t.dateTime('created_at');
      t.dateTime('updated_at');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('Leads');
  };
  
  
exports.up = function (knex) {
  return knex.schema.alterTable('Leads', (t) => {
    t.string('business_license_type');
    t.string('wholesaler_fertilizer_license_number');
    t.string('wholesaler_fms_id');
    t.string('retailer_fertilizer_license_number');
    t.string('retailer_fms_id');
    t.json('product_category_ids');
    t.json('product_sub_category_ids');
    t.json('product_child_category_ids');
    t.dropColumn('fertilizer_license_number');
    t.dropColumn('product_category_id');

  });
};
exports.down = function (knex) {
  return knex.schema.alterTable('Leads', (t) => {
    t.dropColumn('business_license_type');
    t.dropColumn('wholesaler_fertilizer_license_number');
    t.dropColumn('wholesaler_fms_id');
    t.dropColumn('retailer_fertilizer_license_number');
    t.dropColumn('retailer_fms_id');
    t.dropColumn('product_category_ids');
    t.dropColumn('product_sub_category_ids');
    t.dropColumn('product_child_category_ids');
    t.string('fertilizer_license_number');
    t.integer('product_category_id');
  });
};
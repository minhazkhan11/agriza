const moment = require('moment');
exports.seed = async function (knex) {
  console.log('Seeding Integrated_modules_clid_menu table...');
  const IntegratedModuleschildMenuRecords = [
    {
      id: 1,
      index_id: 1,
      sub_menu_id: 1, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Buisness Segment',
      type: 'link',
      icon: 'Buisness Segment',
      path: '/business-segment-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 2,
      index_id: 2,
      sub_menu_id: 1, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Buisness SubCategory',
      type: 'link',
      icon: 'Buisness SubCategory',
      path: '/business-sub-category-list',
      active_status: 'inactive',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 3,
      index_id: 3,
      sub_menu_id: 1, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Supplier Type',
      type: 'link',
      icon: 'Supplier Type',
      path: '/supplier-type-list',
      active_status: 'inactive',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 4,
      index_id: 1,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Product Class',
      type: 'link',
      icon: 'Product Class',
      path: '/product-class-list',
      active_status: 'inactive',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 5,
      index_id: 2,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Product Category',
      type: 'link',
      icon: 'Product Category',
      path: '/product-category-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },

    {
      id: 6,
      index_id: 3,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Product Sub Category',
      type: 'link',
      icon: 'Product Sub Category',
      path: '/product-sub-category-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 7,
      index_id: 8,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Brands',
      type: 'link',
      icon: 'Brands',
      path: '/brand-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 8,
      index_id: 7,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Marketers',
      type: 'link',
      icon: 'Marketers',
      path: '/marketer-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 9,
      index_id: 9,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'GST Classification',
      type: 'link',
      icon: 'GST',
      path: '/gst-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 10,
      index_id: 10,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Units',
      type: 'link',
      icon: 'Units',
      path: '/unit-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 11,
      index_id: 11,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Items',
      type: 'link',
      icon: 'itmes',
      path: '/item-list',
      active_status: 'inactive',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },

    {
      id: 13,
      index_id: 1,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Country',
      type: 'link',
      icon: 'Country',
      path: '/country-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 14,
      index_id: 2,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'State',
      type: 'link',
      icon: 'State',
      path: '/state-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 15,
      index_id: 3,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'District',
      type: 'link',
      icon: 'District',
      path: '/district-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 16,
      index_id: 4,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Tehsil',
      type: 'link',
      icon: 'Tehsil',
      path: '/tehsil-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 17,
      index_id: 6,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Place',
      type: 'link',
      icon: 'Place',
      path: '/Place-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 18,
      index_id: 5,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Pin Code',
      type: 'link',
      icon: 'Pin Code',
      path: '/pin-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 19,
      index_id: 4,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Product Child Category',
      type: 'link',
      icon: 'Product Child Category',
      path: '/product-child-category-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 20,
      index_id: 2,
      sub_menu_id: 1, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'License Category',
      type: 'link',
      icon: 'License Category',
      path: '/license-category-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 21,
      index_id: 5,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Product (Technical)',
      type: 'link',
      icon: 'product',
      path: '/product-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 12,
      index_id: 6,
      sub_menu_id: 2, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Products Approval',
      type: 'link',
      icon: 'Products Approval',
      path: '/product-approval-list',
      active_status: 'inactive',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 22,
      index_id: 1,
      sub_menu_id: 33, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Territory',
      type: 'link',
      icon: 'Territory',
      path: '/territory-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 23,
      index_id: 2,
      sub_menu_id: 33, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Area',
      type: 'link',
      icon: 'area',
      path: '/area-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 24,
      index_id: 3,
      sub_menu_id: 33, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Region',
      type: 'link',
      icon: 'Region',
      path: '/region-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 25,
      index_id: 4,
      sub_menu_id: 33, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Zone',
      type: 'link',
      icon: 'Zone',
      path: '/zone-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 26,
      index_id: 1,
      sub_menu_id: 39, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Lead Category',
      type: 'link',
      icon: 'lead Category',
      path: '/lead-category-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 27,
      index_id: 2,
      sub_menu_id: 39, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Lead SubCategory',
      type: 'link',
      icon: 'lead SubCategory',
      path: '/lead-subcategory-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 28,
      index_id: 1,
      sub_menu_id: 34, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Add Warehouse',
      type: 'link',
      icon: 'Add Warehouse',
      path: '/warehouse-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 29,
      index_id: 2,
      sub_menu_id: 34, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Warehouse Rack',
      type: 'link',
      icon: 'Warehouse Rack',
      path: '/rack-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    }, {
      id: 30,
      index_id: 3,
      sub_menu_id: 46, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Add Items',
      type: 'link',
      icon: 'Add Items',
      path: '/item-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    }, {
      id: 31,
      index_id: 2,
      sub_menu_id: 46, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Item Attributes',
      type: 'link',
      icon: 'Item Attributes ',
      path: '/item-attribute-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    }, {
      id: 32,
      index_id: 5,
      sub_menu_id: 46, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Item Service Area',
      type: 'link',
      icon: 'Item Area',
      path: '/product-area-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 33,
      index_id: 4,
      sub_menu_id: 46, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Add Item Variants(SKU)',
      type: 'link',
      icon: 'Add Item Variants',
      path: '/variant-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 34,
      index_id: 7,
      sub_menu_id: 3, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Rack point',
      type: 'link',
      icon: 'Rack Point',
      path: '/rack-point-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },

    {
      id: 36,
      index_id: 1,
      sub_menu_id: 46, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Item Class',
      type: 'link',
      icon: 'Item Class',
      path: '/product-class-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 37,
      index_id: 4,
      sub_menu_id: 34, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Ship to Party',
      type: 'link',
      icon: 'Ship to Party',
      path: '/ship-to-party-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 38,
      index_id: 3,
      sub_menu_id: 34, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Delivery Point',
      type: 'link',
      icon: 'Delivery Point',
      path: '/delivery-point-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 39,
      index_id: 1,
      sub_menu_id: 35, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'Add License',
      type: 'link',
      icon: 'Add License',
      path: '/license-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
    {
      id: 40,
      index_id: 2,
      sub_menu_id: 35, // Ensure this exists in `Integrated_modules_main_menu`
      name: 'O-form Versioning',
      type: 'link',
      icon: 'O-form Versioning',
      path: '/oform-versioning-list',
      active_status: 'active',
      actions: {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      },
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },


  ];
  try {
    await knex.raw('TRUNCATE TABLE "Integrated_modules_child_menu" RESTART IDENTITY CASCADE');
    console.log('Inserting Integrated_modules_child_menu records...');
    await knex('Integrated_modules_child_menu').insert(IntegratedModuleschildMenuRecords);
    await knex.raw(`
      SELECT SETVAL('public."Integrated_modules_child_menu_id_seq"',
      COALESCE((SELECT MAX(id) FROM "Integrated_modules_child_menu"), 1), true);
    `);
    console.log(' Integrated_modules_child_menu seeding completed successfully!');
  } catch (error) {
    console.error(' Error seeding Integrated_modules_child_menu table:', error);
  }
};
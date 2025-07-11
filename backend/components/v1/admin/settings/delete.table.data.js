require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const env = process.env.NODE_ENV || 'development';
console.log(`Current NODE_ENV: ${env}`);

const knexConfig = require('../../../../knexfile')[env];
if (!knexConfig) {
    console.error(`No knex configuration found for environment: ${env}`);
}
const knex = require('knex')(knexConfig);
module.exports = async (req, res, next) => {
    const { tables_to_delete } = req.body;
    const allowedTables = [
        "Assigned_item_variants_to_vendor",
        "Assigned_to",
        "Be_area_information",
        "Be_bank_details",
        "Be_gst_details",
        "Be_gst_person_assigned",
        "Be_identity_table",
        "Be_information",
        "Be_license_details",
        "Be_person_assigned",
        "Be_persons",
        "Be_warehouse_information",
        "Customer_category",
        "Customer_lead",
        "Delivery_Point",
        "Dispatch_quantity",
        "GodownAddress",
        "Item_Variants",
        "Item_Variants_price",
        "Item_Variants_stock",
        "Item_varint_assigned_price_and_logistic_area",
        "Lead_category",
        "Lead_sub_category",
        "Leads",
        "Leads_info",
        "License_Product",
        "Logistic_area",
        "O_Form_email_data",
        "O_form_issue",
        "O_form_versioning",
        "Order",
        "Order_Payments",
        "Order_dispatch",
        "Order_item",
        "Other_charges",
        "Product",
        "Product_price",
        "ShipInfo",
        "Staff_assigned",
        "Total_discount",
        "Variants",
        "Vender_category",
        "Vender_lead",
        "Wishlist",
        "product_area",
        "product_catalogue",
        "book_a_demo",
        "contact_us",
        "Attributes",
        "Business_area",
        "Business_area_region",
        "Business_area_teritary",

        "Menu_plan",
        "Integrated_module_plans",
        "Integrated_modules_child_menu",
        "Integrated_modules_main_menu",
        "Integrated_modules_sub_menu",
        "be_module_plans_updation",
        // "marketers",
        // "brands",
        // "master_product",
        // "UQc_data",
        // "Units",
        // "Users",
        // "State",
        // "Suppliers",
        // "Tehsil",
        // "Product_sub_category",
        // "Rack_point",
        // "Rake",
        // "Product_category",
        // "Product_child_category",
        // "Product_class" 
        //  "Pin",
        // "Place",



        // "Business_area_zone",
        // "Business_category",
        // "Business_sub_category",
        // "Cart",
        // "Constitution",
        // "Country",
        // "District",
        // "GST_percent",
        // "Attachments",

        // "Activity",
        // "AdvisorEmail",
        // "AdvisorPhone",
        //  "License_category",
    ];

    const truncatedTables = [];
    const skippedTables = [];

    try {
        for (const table of tables_to_delete) {
            if (allowedTables.includes(table)) {
                console.log(`Truncating table: ${table}`);
                await knex.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
                truncatedTables.push(table);
            } else {
                console.warn(`Table not allowed or does not exist in allowed list: ${table}`);
                skippedTables.push(table);
            }
        }

        res.json({
            success: true,
            message: 'Tables wipe process completed.',
            truncated: truncatedTables,
            skipped: skippedTables
        });
    } catch (err) {
        console.error('Error wiping tables:', err);
        res.status(500).json({
            success: false,
            message: 'Error wiping tables or resetting identity.',
            error: err.message
        });
    }
};



// DELETE FROM "Attachments" WHERE added_by <> 1;
// DELETE FROM public."Users" WHERE id <> 1;
// SELECT setval(pg_get_serial_sequence('"Users"', 'id'), COALESCE((SELECT MAX(id) FROM "Users"), 0), true);
// SELECT setval(pg_get_serial_sequence('"Attachments"', 'id'), COALESCE((SELECT MAX(id) FROM "Attachments"), 0), true);

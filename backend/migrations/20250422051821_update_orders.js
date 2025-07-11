exports.up = async function (knex) {
  await knex.raw(`
      ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_order_status_check";
      ALTER TABLE "Order" ADD CONSTRAINT "Order_order_status_check"
      CHECK ("order_status" IN ('pending', 'dispatch', 'approved', 'rejected', 'delivered', 'received','ready_to_dispatch', 'processing'));
  `);
  await knex.schema.alterTable("Order", function (t) {
    t.text("remark").nullable();
    t.string('so_po_order_id')
    t.integer('warehouse_information_id').unsigned().references('id').inTable('Be_warehouse_information')
    t.integer('customer_be_id').unsigned().references('id').inTable('Be_information').nullable();
    t.integer('vendor_be_id').unsigned().references('id').inTable('Be_information').nullable();
  });
};

exports.down = async function (knex) {
  await knex.raw(`
      ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_order_status_check";
      ALTER TABLE "Order" ADD CONSTRAINT "Order_order_status_check"
      CHECK ("order_status" IN ('pending', 'dispatch', 'approved', 'rejected', 'delivered', 'received'));
  `);
  await knex.schema.alterTable("Order", function (t) {
    t.dropColumn("remark");
    t.dropColumn("warehouse_information_id");
    t.dropColumn("so_po_order_id");
    t.dropColumn("vendor_be_id");
    t.dropColumn("customer_be_id");
  });
};

exports.up = async function (knex) {
  await knex.raw(`
      ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_order_status_check";
      ALTER TABLE "Order" ADD CONSTRAINT "Order_order_status_check"
      CHECK ("order_status" IN ('pending', 'dispatch', 'approved', 'rejected', 'delivered', 'received','ready_to_dispatch', 'processing','partial_dispatch'));
  `);
}
exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_order_status_check";
    ALTER TABLE "Order" ADD CONSTRAINT "Order_order_status_check"
    CHECK ("order_status" IN ('pending', 'dispatch', 'approved', 'rejected', 'delivered', 'received','ready_to_dispatch', 'processing')); 
  `);
}

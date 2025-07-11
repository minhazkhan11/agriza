const { ErrorHandler } = require('../../../../../lib/utils');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { warehouse_information } = req.body;
    const userId = req.user.id;
    const processedWarehouses = [];

    // OPTIONAL: Set default_be_information_id if needed


    if (!Array.isArray(warehouse_information) || warehouse_information.length === 0) {
      return res.badRequest({ message: 'warehouse_information is required and must be an array.' });
    }

    for (const warehouse of warehouse_information) {
      const warehouseData = {
        name: warehouse.name,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        pincode_id: warehouse.pincode_id,
        place_id: warehouse.place_id,
        address: warehouse.address,
        be_information_id: warehouse.be_information_id,
        ship_info: warehouse.ship_info,
        gst_id: warehouse.gst_id || null,
        added_by: userId
      };

      let warehouseRecord = await Warehouseinformation.query((qb) => {
        qb.where('name', warehouse.name)
          .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
      }).fetch({ require: false });

      if (warehouseRecord) {
        warehouseRecord = await warehouseRecord.save(warehouseData, { patch: true });
      } else {
        warehouseRecord = await new Warehouseinformation(warehouseData).save();
      }

      processedWarehouses.push(warehouseRecord);
    }

    return res.success({
      message: 'Warehouse information processed successfully.',
      warehouse_information: processedWarehouses
    });

  } catch (error) {
    return res.serverError(500, { message: 'Internal server error.', error: ErrorHandler(error) });
  }
};

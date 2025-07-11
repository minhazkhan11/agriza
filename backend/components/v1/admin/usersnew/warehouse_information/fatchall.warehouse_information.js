'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const Assigned = require('../../../../../models/assigned');
const { constants } = require('../../../../../config');
const getUserDetailsFromRequest = require('../../../../../middlewares/fetch.be_id_by.user_id');
module.exports = async (req, res) => {
  try {
    const { be_information_id, role, menu_plan_id } = await getUserDetailsFromRequest(req?.user?.id);
    const userId = req?.user?.id;
    let filterCondition;
    if (menu_plan_id === 36 || menu_plan_id === 37) {
      // Get gst_ids from Assigned table for this user
      const assignedGstRecords = await Assigned.query((qb) => {
        qb.where({ user_id: userId, active_status: constants.activeStatus.active })
          .whereNotNull('gst_id');
      }).fetchAll({ require: false });
      const gstIdArray = assignedGstRecords
        ?.toJSON()
        ?.map((item) => item.gst_id)
        .filter(Boolean)
        .flat();
      if (!gstIdArray || gstIdArray.length === 0) {
        return res.success({ warehouse_information: [] }); // No GSTs assigned
      }
      filterCondition = (qb) => {
        qb.whereIn('gst_id', gstIdArray)
          .andWhere(q => {
            q.whereIn('active_status', [
              constants.activeStatus.active,
              constants.activeStatus.inactive
            ]);
          })
          .orderBy('created_at', 'asc');
      };
    } else if (menu_plan_id === 40) {
      // Get gst_ids from Assigned table for this user
      const assignedWarehouseRecords = await Assigned.query((qb) => {
        qb.where({
          user_id: userId,
          active_status: constants.activeStatus.active,
        }).whereNotNull("warehouse_id");
      }).fetchAll({ require: false });
      const warehouseIdArray = assignedWarehouseRecords
        ?.toJSON()
        ?.map((item) => item.warehouse_id)
        .filter(Boolean)
        .flat();
      console.log("gstIdArray", warehouseIdArray);
      if (!warehouseIdArray || warehouseIdArray.length === 0) {
        return res.success({ warehouse_information: [] }); // No GSTs assigned
      }
      filterCondition = (qb) => {
        qb.whereIn("id", warehouseIdArray)
          .andWhere((q) => {
            q.whereIn("active_status", [
              constants.activeStatus.active,
              constants.activeStatus.inactive,
            ]);
          })
          .orderBy("created_at", "asc");
      };
    } else {
      // Default logic: filter using be_information_id
      filterCondition = (qb) => {
        qb.where({ be_information_id })
          .andWhere(q => {
            q.whereIn('active_status', [
              constants.activeStatus.active,
              constants.activeStatus.inactive
            ]);
          })
          .orderBy('created_at', 'asc');
      };
    }
    // Fetch warehouses
    const warehouse_information = await Warehouseinformation.query(filterCondition).fetchAll({
      require: false,
      withRelated: [
        {
          'pincode_id': (qb) => qb.select('id', 'pin_code')
        },
        {
          'place_id': (qb) => qb.select('id', 'place_name')
        },
        {
          'gst_id': (qb) => qb.select('id', 'gst_number')
        },
        {
          'be_information_id': (qb) => qb.select('id', 'business_name')
        }
      ],
      columns: [
        'id', 'name', 'address', 'latitude', 'pincode_id', 'place_id',
        'gst_id', 'be_information_id', 'longitude', 'ship_info', 'active_status'
      ]
    });
    return res.success({ warehouse_information });
  } catch (error) {
    console.error("Error in fetching warehouse information:", error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
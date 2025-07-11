'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Rake = require('../../../../../models/rake');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {  

    const { rakes, warehouse_id } = req.body;
       const added_by = req.user.id;
   
       // **Prepare Data for Bulk Insert**
       const rakePointData = rakes.map(point => ({
        name: point.name,
         warehouse_id: warehouse_id, 
         added_by,
       }));
   
       // **Bulk Insert (Bookshelf.js)**
       const insertedRake = await Rake.collection(rakePointData).invokeThen('save');

  
    return res.success({ rake : insertedRake });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
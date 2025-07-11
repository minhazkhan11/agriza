'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Rakepoint = require('../../../../../models/rakepoint');

module.exports = async (req, res) => {
  try {
    const { rakepoints, place_id } = req.body;
    const added_by = req.user.id;

    // **Validate Input**
    if (!Array.isArray(rakepoints) || rakepoints.length === 0 || !place_id) {
      return res.status(400).json({ error: 'Invalid input data format' });
    }

    // **Prepare Data for Bulk Insert**
    const rakePointData = rakepoints.map(point => ({
      rack_point: point.rack_point,
      place_id: place_id, 
      rack_point_distanse: point.rack_point_distanse,
      added_by,
    }));

    // **Bulk Insert (Bookshelf.js)**
    const insertedRakePoints = await Rakepoint.collection(rakePointData).invokeThen('save');

    return res.success({
    
      rakepoints: insertedRakePoints
    });
  } catch (error) {
    console.error('Error adding rake points:', error);
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};

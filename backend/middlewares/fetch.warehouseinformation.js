
const Businessarea = require('../models/business_area');
const Businessarearegion = require('../models/business_area_region');
const Businessareateritary = require('../models/business_area_teritari');
const Businessareazone = require('../models/business_area_zone');

const getZoneIdsFromBusinessArea = async (type, ...business_area_ids) => {
  const zoneIds = [];

  for (const id of business_area_ids) {
    let zoneId = null;

    if (type === 'territory') {
      const territory = await Businessareateritary.where({ id }).fetch({ require: false });
      if (!territory) continue;

      const area = await Businessarea.where({ id: territory.get('business_area_id') }).fetch({ require: false });
      if (!area) continue;

      const region = await Businessarearegion.where({ id: area.get('teritari_id') }).fetch({ require: false });
      if (!region) continue;

      const zone = await Businessareazone.where({ id: region.get('area_id') }).fetch({ require: false });
      if (!zone) continue;

      zoneId = zone.get('id');

    } else if (type === 'area') {
      const area = await Businessarea.where({ id }).fetch({ require: false });
      if (!area) continue;

      const region = await Businessarearegion.where({ id: area.get('teritari_id') }).fetch({ require: false });
      if (!region) continue;

      const zone = await Businessareazone.where({ id: region.get('area_id') }).fetch({ require: false });
      if (!zone) continue;

      zoneId = zone.get('id');

    } else if (type === 'region') {
      const region = await Businessarearegion.where({ id }).fetch({ require: false });
      if (!region) continue;

      const zone = await Businessareazone.where({ id: region.get('area_id') }).fetch({ require: false });
      if (!zone) continue;

      zoneId = zone.get('id');

    } else if (type === 'zone') {
      const zone = await Businessareazone.where({ id }).fetch({ require: false });
      if (!zone) continue;

      zoneId = zone.get('id');
    }

    if (zoneId) {
      zoneIds.push(zoneId);
    }
  }

  return zoneIds;
};

module.exports = getZoneIdsFromBusinessArea;

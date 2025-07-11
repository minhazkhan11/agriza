'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Units = require('../../../../../models/units');
const Uqc = require('../../../../../models/uqc');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const units = await Units.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

        if (!units || units.length === 0) {
            return res.success({ units: [], count: 0 });
        }

        const uqcIds = [...new Set(units.map(unit => unit.get('uqc_id')).filter(id => id))];

        const uqcs = await Uqc.query((qb) => {
            qb.whereIn('id', uqcIds);
        }).fetchAll({ require: false });

        const uqcMap = uqcs.reduce((acc, uqc) => {
            acc[uqc.get('id')] = uqc.get('name');
            return acc;
        }, {});


        const unitsWithUqcName = units.map(unit => ({
            ...unit.toJSON(),
            uqc_name: uqcMap[unit.get('uqc_id')] || null
        }));

        return res.success({
            units: unitsWithUqcName,
            count: unitsWithUqcName.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Logistic = require('../../../../../models/logistic_area');
const State = require('../../../../../models/state');
const District = require('../../../../../models/district');
const Tehsil = require('../../../../../models/tehsil');
const Pincode = require('../../../../../models/pin');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');
const Country = require('../../../../../models/country');

module.exports = async (req, res, next) => {
    try {
        const logistic_area = await Logistic.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            // columns:['id','name','short_name','demographic_includes_id','marketer_id','demographic_include']
        });

        if (!logistic_area) {
            return res.serverError(400, 'Invalid logistic_area');
        }

        let responseData = {
            success: true,
            logistic_area: logistic_area.toJSON()
        };

        /**
         * Convert IDs (comma-separated string / stringified array) into integer array
         */
        const parseIds = (idString) => {
            if (!idString) return [];
            if (typeof idString === "string") {
                return idString.replace(/[{}]/g, '').split(',').map(num => parseInt(num.trim(), 10));
            }
            return Array.isArray(idString) ? idString.map(num => parseInt(num, 10)) : [parseInt(idString, 10)];
        };

        const demographicType = logistic_area.get('demographic_include');
        const demographicIds = parseIds(logistic_area.get('demographic_includes_id'));

        /**
         * Fetch demographic data dynamically
         */
        const fetchDemographics = async (model, ids) => {
            if (!ids.length) return null;
            return await model.where('id', 'IN', ids).fetchAll({ require: false });
        };

        if (demographicType === 'State') {
            responseData.include_State = await fetchDemographics(State, demographicIds);
        } else if (demographicType === 'District') {
            responseData.include_District = await fetchDemographics(District, demographicIds);
        } else if (demographicType === 'Pincode') {
            responseData.include_Pincode = await fetchDemographics(Pincode, demographicIds);
        } else if (demographicType === 'Tehsil') {
            responseData.include_Tehsil = await fetchDemographics(Tehsil, demographicIds);
        } else if (demographicType === 'Place') {
            responseData.include_Place = await fetchDemographics(Place, demographicIds);
        }
        else if (demographicType === 'Country') {
            responseData.include_Country = await fetchDemographics(Country, demographicIds);
        }

        return res.success(responseData);
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

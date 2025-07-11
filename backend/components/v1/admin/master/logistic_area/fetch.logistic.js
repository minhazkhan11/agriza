'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Logistic = require('../../../../../models/logistic_area');
const State = require('../../../../../models/state');
const District = require('../../../../../models/district');
const Tehsil = require('../../../../../models/tehsil');
const Pincode = require('../../../../../models/pin');
const Place = require('../../../../../models/place');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // **Fetch all logistic_areas records**
        const logistic_areas = await Logistic.query(qb => {
            qb.whereIn('active_status', [
                constants.activeStatus.active,
                constants.activeStatus.inactive
            ])
            .andWhere({ added_by: req.user.id })
            .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            columns: ['id', 'name', 'demographic_includes_id', 'demographic_include', 'active_status']
        });

        if (!logistic_areas || logistic_areas.length === 0) {
            return res.success({ logistic_areas: [] });
        }

        let responseData = {
            success: true,
            logistic_areas: []
        };

        // **Fix for whereIn() issue**
        async function fetchDemographics(model, id) {
            if (!id) return null; // Return null if id is null or undefined

            let parsedIds;
            try {
                if (typeof id === "string") {
                    // Convert comma-separated string to an integer array
                    parsedIds = id.split(',').map(num => {
                        let parsed = parseInt(num.trim(), 10);
                        return isNaN(parsed) ? null : parsed;
                    }).filter(num => num !== null); // Remove invalid values
                } else if (Array.isArray(id)) {
                    parsedIds = id.map(num => parseInt(num, 10)).filter(num => !isNaN(num));
                } else {
                    let parsed = parseInt(id, 10);
                    parsedIds = isNaN(parsed) ? [] : [parsed];
                }
            } catch (e) {
                console.error("Invalid ID format in demographic_includes_id:", id);
                return null;
            }

            if (parsedIds.length === 0) return null; // No valid IDs

            return await model.query(qb => qb.whereIn('id', parsedIds)).fetchAll({ require: false });
        }

        // **Loop through each logistic_area**
        for (const logistic_area of logistic_areas.toJSON()) {
            let productData = { ...logistic_area };

            const includeType = logistic_area.demographic_include; // ✅ Fixed reference
            const includeId = logistic_area.demographic_includes_id;

            // **Fetch Include Data**
            if (includeType === 'State') {
                productData.include_State = await fetchDemographics(State, includeId);
            } else if (includeType === 'District') {
                productData.include_District = await fetchDemographics(District, includeId);
            } else if (includeType === 'Pincode') {
                productData.include_Pincode = await fetchDemographics(Pincode, includeId);
            } else if (includeType === 'Tehsil') {
                productData.include_Tehsil = await fetchDemographics(Tehsil, includeId);
            } else if (includeType === 'Place') {
                productData.include_Place = await fetchDemographics(Place, includeId);
            } else if (includeType === 'Country') {
                productData.include_Country = await fetchDemographics(Country, includeId);
            }

            responseData.logistic_areas.push(productData);
        }

        return res.success(responseData);

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};

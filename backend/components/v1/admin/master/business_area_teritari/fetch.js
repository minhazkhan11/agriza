'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessareateritary = require('../../../../../models/business_area_teritari');
const { constants } = require('../../../../../config');
const District = require('../../../../../models/district');
const State = require('../../../../../models/state');
const Tehsil = require('../../../../../models/tehsil');
const Pincode = require('../../../../../models/pin');
const Place = require('../../../../../models/place');
const Country = require('../../../../../models/country');

module.exports = async (req, res, next) => {
    try {
        const product_areas = await Businessareateritary.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            columns: ['id', 'name', 'short_name', 'demographic_include_id', 'demographic_include', 'active_status']
        });

        if (!product_areas || product_areas.length === 0) {
            return res.serverError(400, 'No product_area records found');
        }

        let responseData = {
            success: true,
            product_areas: []
        };

        // **Fix for whereIn() issue**
        async function fetchDemographics(model, id) {
            if (!id) return null; // Agar id null ho to return null

            let parsedId;
            try {
                if (typeof id === "string") {
                    // Agar string hai, toh comma-separated values ko integer array me convert karo
                    parsedId = id.includes(',') ? id.split(',').map(num => parseInt(num.trim(), 10)) : [parseInt(id, 10)];
                } else {
                    parsedId = Array.isArray(id) ? id.map(num => parseInt(num, 10)) : [parseInt(id, 10)];
                }
            } catch (e) {
                console.error("Invalid ID format in demographic_includes_id / demographic_excludes_id:", id);
                return null;
            }

            return await model.query(qb => qb.whereIn('id', parsedId)).fetchAll({ require: false });
        }

        // **Loop through each product_area**
        for (const product_area of product_areas.toJSON()) {
            let productData = { ...product_area };

            const includeType = product_area.demographic_include;
            const includeId = product_area.demographic_include_id;
            
            const excludeType = product_area.demographic_exclude;
            const excludeId = product_area.demographic_exclude_id;

            const excludeId2 = product_area.demographic_exclude_2_id;
            const excludeType2 = product_area.demographic_exclude_2;

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
            }
              else if (includeType === 'Country') {
            productData.include_Country = await fetchDemographics(Country, includeId);
          }

            // **Fetch Exclude Data**
            if (excludeType === 'State') {
                productData.exclude_State = await fetchDemographics(State, excludeId);
            } else if (excludeType === 'District') {
                productData.exclude_District = await fetchDemographics(District, excludeId);
            } else if (excludeType === 'Pincode') {
                productData.exclude_Pincode = await fetchDemographics(Pincode, excludeId);
            } else if (excludeType === 'Tehsil') {
                productData.exclude_Tehsil = await fetchDemographics(Tehsil, excludeId);
            } else if (excludeType === 'Place') {
                productData.exclude_Place = await fetchDemographics(Place, excludeId);
            }
            else if (excludeType === 'Country') {
                productData.exclude_Country = await fetchDemographics(Country, excludeId);
            }



            if (excludeType2 === 'State') {
                productData.exclude_State = await fetchDemographics(State, excludeId2);
            } else if (excludeType2 === 'District') {
                productData.exclude_District = await fetchDemographics(District, excludeId2);
            } else if (excludeType2 === 'Pincode') {
                productData.exclude_Pincode = await fetchDemographics(Pincode, excludeId2);
            } else if (excludeType2 === 'Tehsil') {
                productData.exclude_Tehsil = await fetchDemographics(Tehsil, excludeId2);
            } else if (excludeType2 === 'Place') {
                productData.exclude_Place = await fetchDemographics(Place, excludeId2);
            }
            else if (excludeType2 === 'Country') {
                productData.exclude_Country = await fetchDemographics(Country, excludeId2);
            }


            responseData.product_areas.push(productData);
        }

        return res.success(responseData);

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

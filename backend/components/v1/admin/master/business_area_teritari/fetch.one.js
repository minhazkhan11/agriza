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
        const business_area_teritari = await Businessareateritary.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            // columns:['id','name','short_name','demographic_include_id','demographic_include']
        });

        if (!business_area_teritari)
            return res.serverError(400, 'invalid business_area_teritari ');

        let responseData = {
            success: true,
            product_area: business_area_teritari.toJSON()
        };

        const parseIds = (idString) => {
            if (!idString) return [];
            if (typeof idString === "string") {
                return idString.replace(/[{}]/g, '').split(',').map(num => parseInt(num.trim(), 10));
            }
            return Array.isArray(idString) ? idString.map(num => parseInt(num, 10)) : [parseInt(idString, 10)];
        };

        const demographicType = business_area_teritari.get('demographic_include');
        const demographicIds = parseIds(business_area_teritari.get('demographic_include_id'));

        const demographicType1 = business_area_teritari.get('demographic_exclude');
        const demographicIds1 = parseIds(business_area_teritari.get('demographic_exclude_id'));


        const demographicType2 = business_area_teritari.get('demographic_exclude_2');
        const demographicIds2 = parseIds(business_area_teritari.get('demographic_exclude_2_id'));

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

        if (demographicType1 === 'State') {
            responseData.exclude_State = await fetchDemographics(State, demographicIds1);
        } else if (demographicType1 === 'District') {
            responseData.exclude_District = await fetchDemographics(District, demographicIds1);
        } else if (demographicType1 === 'Pincode') {
            responseData.exclude_Pincode = await fetchDemographics(Pincode, demographicIds1);
        } else if (demographicType1 === 'Tehsil') {
            responseData.exclude_Tehsil = await fetchDemographics(Tehsil, demographicIds1);
        } else if (demographicType1 === 'Place') {
            responseData.exclude_Place = await fetchDemographics(Place, demographicIds1);
        }
        else if (demographicType1 === 'Country') {
            responseData.exclude_Country = await fetchDemographics(Country, demographicIds1);
        }
        



        if (demographicType2 === 'State') {
            responseData.exclude_State = await fetchDemographics(State, demographicIds2);
        } else if (demographicType2 === 'District') {
            responseData.exclude_District = await fetchDemographics(District, demographicIds2);
        } else if (demographicType2 === 'Pincode') {
            responseData.exclude_Pincode = await fetchDemographics(Pincode, demographicIds2);
        } else if (demographicType2 === 'Tehsil') {
            responseData.exclude_Tehsil = await fetchDemographics(Tehsil, demographicIds2);
        } else if (demographicType2 === 'Place') {
            responseData.exclude_Place = await fetchDemographics(Place, demographicIds2);
        }
        else if (demographicType2 === 'Country') {
            responseData.exclude_Country = await fetchDemographics(Country, demographicIds2);
        }

        return res.success(responseData);


    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

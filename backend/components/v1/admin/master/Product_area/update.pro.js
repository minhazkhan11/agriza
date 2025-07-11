'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const ProArea = require('../../../../../models/product_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.product_area.id;
        let Check = await ProArea.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('data not found'));

        const body = req.body.product_area;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (error) {
                return res.serverError(400, ErrorHandler('Invalid JSON format in request body'));
            }
        }

        // Ensure the demographic fields are always stored as JSON strings
        if (body.demographic_excludes_id) {
            body.demographic_excludes_id = JSON.stringify(body.demographic_excludes_id);
        }
        if (body.demographic_includes_id) {
            body.demographic_includes_id = JSON.stringify(body.demographic_includes_id);
        }
        if (body.demographic_exclude_2_id) {
            body.demographic_exclude_2_id = JSON.stringify(body.demographic_exclude_2_id);
        }
        const proiduct_area = await new ProArea().where({ id }).save(body, { method: 'update' });

        const newProArea = await ProArea.where({ id }).fetch({ require: false });

        return res.success({ product_area: newProArea });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let body = req.body.attributesdetails;
        let added_by = req.user.id;

        if (!body.id) {
            return res.serverError(400, { error: "Missing attribute ID" });
        }

        // **Check if Attribute Exists**
        let existingAttribute = await Attributes.where({ id: body.id }).fetch({ require: false });
        if (!existingAttribute) {
            return res.serverError(404, { error: "Attribute not found" });
        }

        // **Update Attribute Details**
        await existingAttribute.save({
            attribute_name: body.attribute_name,
            added_by: added_by
        }, { patch: true });

        // **Fetch Existing Variants**
        const existingVariants = await Variants.where({ attribute_id: body.id }).fetchAll({ require: false });
        let existingVariantMap = new Map(
            existingVariants ? existingVariants.toJSON().map(v => [v.id, v]) : [] 
        );

        // **Insert or Update Variants One by One**
        for (const variant of body.variantsDetails || []) {
            if (variant.id && existingVariantMap.has(variant.id)) {
                await Variants.where({ id: variant.id }).save({
                    variant: variant.variant,
                    added_by: added_by
                }, { patch: true });
            } else {
                // **Insert New Variant**
                await new Variants({
                    attribute_id: body.id,
                    variant: variant.variant,
                    added_by: added_by
                }).save();
            }
        }

        // **Fetch Updated Data**
        const updatedAttribute = await Attributes.where({ id: body.id }).fetch({
            require: false ,
        });

          const attriData = updatedAttribute.toJSON();
        
           // **Fetch License Products**
               const variants = await Variants.query(qb => {
                 qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                   .andWhere('attribute_id', attriData.id)
                   .orderBy('created_at', 'asc');
               }).fetchAll({ require: false });
               
            attriData.variant_details = variants ? variants.toJSON() : [];

        return res.success({ attribute: attriData});

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};

'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.product.id;
        let Check = await Product.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler(' product_name not found'));

        const body = req.body.product;
        const product = await new Product().where({ id }).save(body, { method: 'update' });

        return res.success({ product });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
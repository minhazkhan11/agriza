'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const constants = require('../../../../../config/constants');
const Wishlist = require('../../../../../models/whishlist');


module.exports = async (req, res, next) => {
    try {
        let check = await Wishlist.where({ id: req.params.id, added_by: req.user.id  }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error('Product not found')));   

        await new Wishlist().where({ id: req.params.id, added_by: req.user.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': 'Product successfully deleted to the wishlist'});
        })
        .catch(err => {
            return res.serverError(400, ErrorHandler('Something went wrong'));
        })
    } catch (error) {
        console.log('error',error);
        return res.serverError(500, ErrorHandler(error));
    }
};

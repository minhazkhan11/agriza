'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Versionings = require('../../../../../models/o_form_versioning');
const LicenseProduct = require('../../../../../models/license_product');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const o_form_versioning = await Versionings.query((qb) => {
      qb.whereIn('active_status', [
        constants.activeStatus.active,
        constants.activeStatus.inactive
      ]).orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        {
          'license_id': (qb) => {
            qb.select(
              'id',
              'license_name',
              'beneficiary_name',
              'license_status',
              'license_no',
              'license_territory',
              'office_address',
              'date_of_issue',
              'date_of_expiry',
              'author_by_issue',
              'authority_name',
              'pin_code',
              'state',
              'district',
              'tehsil',
              'place_id',
              'added_by'
            );
          },
          'license_id.pin_code': (qb) => qb.select('id', 'pin_code'),
          'license_id.place_id': (qb) => qb.select('id', 'place_name'),
          'license_id.state': (qb) => qb.select('id', 'state_name'),
          'license_id.district': (qb) => qb.select('id', 'district_name'),
          'license_id.tehsil': (qb) => qb.select('id', 'tehsil_name'),
          'license_id.signatureandseal': (qb) => qb.select('id', 'photo_path', 'entity_id'),
          'license_id.seal': (qb) => qb.select('id', 'photo_path', 'entity_id'),
          'license_id.license': (qb) => qb.select('id', 'photo_path', 'entity_id'),
        }
      ]
    });

    const versioningData = o_form_versioning.toJSON();

    // Extract all license_product_ids from all versioning entries and flatten the array
    const licenseProductIds = [
      ...new Set(
        versioningData
          .flatMap(item => Array.isArray(item.license_product_id) ? item.license_product_id : [])
          .filter(Boolean)
      )
    ];

    // Fetch all related license products
    const licenseProducts = await LicenseProduct.query((qb) => {
      qb.whereIn('id', licenseProductIds);
    }).fetchAll({ require: false });

    const productMap = {};
    licenseProducts.toJSON().forEach(product => {
      productMap[product.id] = {
        id: product.id,
        name_of_product: product.name_of_product,
        brand_name: product.brand_name,
        source_of_supply: product.source_of_supply,
      };
    });

    // Attach product info array to each versioning record (remove license_product_id)
    const enhancedVersioning = versioningData.map(({ license_product_id, ...rest }) => {
      const matchedProducts = (license_product_id || [])
        .map(id => productMap[id])
        .filter(Boolean);

      return {
        ...rest,
        license_products: matchedProducts,
      };
    });

    return res.success({
      o_form_versioning: enhancedVersioning,
      count: enhancedVersioning.length,
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Telecaller = require('../../../../../models/telecallers');
const telecallersLists = require('../../../../../models/telecallersLists');
const { constants } = require('../../../../../config');
const fs = require('fs');
const csv = require('csv-parser');
const attachments = require('../../../../../models/attachments');


module.exports = async (req, res, next) => {
    try {
      let telecallers = await Telecaller.where(function () {
        this.whereIn('active_status', ['active', 'inactive'])
          .andWhere({ added_by: req.user.id });
      })
        .orderBy('created_at', 'asc')
        .fetchAll({
          require: false,
          withRelated: ['attachment']
        });
      const count = telecallers.length;
  
      let telecallerArray = [];
      for (const telecaller of telecallers) {
        let telecallerJson = telecaller.toJSON();
  
        telecallerJson.excel_file = processAttachment(telecallerJson.attachment);
        delete telecallerJson.attachment;
        telecallerArray.push(telecallerJson);
      }
  
      return res.success({
        telecaller: telecallerArray, count
      });
  
    } catch (error) {
      return res.serverError(500, ErrorHandler(error));
    }
  };
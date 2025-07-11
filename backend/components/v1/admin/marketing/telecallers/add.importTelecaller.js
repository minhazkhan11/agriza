'use strict';

const fs = require('fs');
const path = require('path');
const { ErrorHandler } = require('../../../../../../lib/utils');
const constants = require('../../../../../../config/constants');
const { stringify } = require('csv-stringify/sync');
const Telecaller = require('../../../../../models/telecallers');
const TelecallersLists = require('../../../../../models/telecallersLists');
const moment = require('moment');
const csv = require('csv-parser');

function formatDate(milliseconds) {
    const date = moment(milliseconds);
    return date.format('YYYY-MM-DD');
}

module.exports = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.serverError(400, ErrorHandler('No file uploaded'));
        }

        const telecallerArray = [];

        fs.createReadStream(file.path)
            .on('error', (err) => {
                console.error('Error reading file:', err);
                return res.serverError(500, ErrorHandler('Error reading uploaded file'));
            })
            .pipe(csv())
            .on('data', (data) => {
                telecallerArray.push(data);
            })
            .on('end', async () => {
                const savedUserArray = [];
                const validationErrors = [];

                for (const telecaller of telecallerArray) {
                    try {
                        const telecallersLists = {
                            name: telecaller.name,
                            email: telecaller.email,
                            phone: telecaller.phone,
                            remark: telecaller.remark,
                            // status: telecaller.status,
                            telecaller_id: req.params.id, // Assuming req.params.id contains the telecaller_id
                            added_by: req.user.id,
                        };

                        const savedUser = await new TelecallersLists(telecallersLists).save();
                        const userJson = savedUser.toJSON();
                        savedUserArray.push(userJson);
                    } catch (error) {
                        console.error('Error processing telecaller:', error.message);
                        validationErrors.push(ErrorHandler(error));
                    }
                }

                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }

                if (validationErrors.length > 0) {
                    return res.status(400).json(validationErrors);
                } else {
                    return res.success({ message: 'Telecaller imported successfully', count: telecallerArray.length });
                }
            });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.serverError(500, ErrorHandler(error));
    }
};

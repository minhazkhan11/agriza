'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../../lib/utils');
const Telecaller = require('../../../../../models/telecallers');
const telecallersLists = require('../../../../../models/telecallersLists');
const { constants } = require('../../../../../../config');
const fs = require('fs');
const csv = require('csv-parser');

module.exports = async (req, res) => {
    try {
        // Save the telecaller information from request body
        let body = req.body.telecaller;
        body = JSON.parse(body);
        body.added_by = req.user.id;

        const telecaller = await new Telecaller(body).save();

        // Upload attachment file if exists
        const imageFile = req.file;
        if (imageFile) {
            const entityId = telecaller.id;
            const entityType = 'Telecallers';
            const folderName = 'telecallers';
            const imagePrefix = 'telecallers';
            const uploadedImagePath = await uploadImage(imageFile, folderName, imagePrefix, entityId, entityType, req.user.id);
        }

        // Fetch the newly saved telecaller with attachment
        const newTelecaller = await Telecaller.where({ id: telecaller.id, active_status: constants.activeStatus.active }).fetch({
            require: false,
            withRelated: ['attachment']
        });
        let telecallerData = newTelecaller.toJSON();
        telecallerData.excel_file = processAttachment(telecallerData.attachment);
        delete telecallerData.attachment;

        // Process the CSV file if exists
        const file = req.file;
        if (!file) {
            return res.serverError(400, ErrorHandler('No file uploaded'));
        }

        const savedTelecallerArray = [];
        const validationErrors = [];

        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', async (data) => {
                try {
                    // Save each telecaller from CSV
                    let newTelecaller = {
                        telecaller_id: telecaller.id, // Assuming telecaller_id from CSV should be saved as id
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        remark: null,
                        added_by: req.user.id,
                    };
                    const savedTelecaller = await new telecallersLists(newTelecaller).save();
                    savedTelecallerArray.push(savedTelecaller);
                } catch (error) {
                    validationErrors.push(error.message);
                    console.error('Error processing telecaller:', error.message);
                }
            })
            .on('end', () => {
                // Clean up the temporary file
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }

                // Respond with success or errors
                if (validationErrors.length > 0) {
                    return res.status(400).json(validationErrors);
                } else {
                    // Return the telecaller data as response
                    return res.success({ message: 'Telecallers imported successfully', telecallerData });
                }
            });
    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};

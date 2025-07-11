'use strict';

const fs = require('fs');
const path = require('path');
const { ErrorHandler } = require('../../../../../lib/utils');
const constants = require('../../../../../config/constants');
const { stringify } = require('csv-stringify/sync');
const Telecaller = require('../../../../../models/telecallers');
const telecallersLists = require('../../../../../models/telecallersLists');
const moment = require('moment');

// Function to format milliseconds into a readable date format
function formatDate(milliseconds) {
    const date = moment(milliseconds);
    return date.format('DD-MM-YYYY');
}

// Exporting the function as a middleware
module.exports = async (req, res, next) => {
    try {
        // Fetch telecallers data from the database based on certain conditions
        let telecallers = await telecallersLists.where(function () {
            this.whereIn('active_status', ['active', 'inactive'])
                .andWhere({ telecaller_id: req.params.id });
        }).fetchAll({ require: false });

        let telecallerArray = [];
        
        // Iterate over telecallers data and format it
        telecallers.forEach((telecaller, index) => {
            let userData = telecaller.toJSON();
            userData.created_at = formatDate(userData.created_at);

            // Add serial number to the user data
            userData.serial_number = index + 1;

            telecallerArray.push(userData);
        });

        // Convert formatted data to CSV format
        const csvData = stringify(telecallerArray, {
            header: true,
            columns: {
                serial_number: 'serial_number',
                name: 'name',
                email: 'email',
                phone: 'phone',
                remark: 'remark',
                status: 'status',
                active_status: 'active_status'
            }
        });

        // Create directory path for saving the CSV file
        const directoryPath = path.join(__dirname, '../../../../../public/uploads/exports');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Write CSV data to a file
        const filePath = path.join(directoryPath, 'telecaller.csv');
        fs.writeFileSync(filePath, csvData);

        // Set up response for file download
        res.setHeader('Content-Disposition', 'attachment; filename=telecaller.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.sendFile(filePath, (err) => {
            if (err) {
                next(err);
            } else {
                // Optionally delete the file after sending it
                fs.unlinkSync(filePath);
            }
        });

        // Construct file URL and count of records
        const newUrl = filePath.split('public');
        const file_url = process.env.BASE_URL + newUrl[1];
        const count = telecallerArray.length;

        // Return success response with file URL and message
        return res.success({
            message: 'Telecaller export successful',
            file_url
        });

    } catch (error) {
        console.error('Error in telecaller export:', error);
        // Return server error response
        return res.serverError(500);
    }
};

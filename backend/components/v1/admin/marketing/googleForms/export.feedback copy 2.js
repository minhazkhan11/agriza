'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { ErrorHandler } = require('../../../../../lib/utils');
const Feedback = require('../../../../../models/feedback');
const FeedbackFields = require('../../../../../models/feedbackFields');
const FeedbackResponse = require('../../../../../models/feedbackResponse');
const constants = require('../../../../../config/constants');
const Learners = require('../../../../../models/learners');
const LearnerInformations = require('../../../../../models/learnerInformations');
const User = require('../../../../../models/user');
const { stringify } = require('csv-stringify/sync');
const { convert } = require('html-to-text');

function formatDate(milliseconds) {
    return moment(milliseconds).format('DD-MM-YYYY');
}

module.exports = async (req, res, next) => {
    try {
        const feedback = await Feedback.where({
            id: req.params.id,
            added_by: req.user.id
        }).fetch({
            require: false, withRelated: [{
                'addedBy': function (query) {
                    query.select('id', 'full_name');
                },
                course: function (query) {
                    query.select('id', 'course_name')
                },
                batch: function (query) {
                    query.select('id', 'batch_name')
                },
                subject: function (query) {
                    query.select('id', 'subject_name')
                },
                teacher: function (query) {
                    query.select('id', 'full_name')
                },
            }]
        });

        if (!feedback) {
            return res.status(400).send({ error: 'Feedback not found' });
        }

        let feedbackJson = feedback.toJSON();

        const learners = await Learners.where({
            assigned_to: req.user.id,
        }).fetchAll({ require: false });

        let learnerArray = [];
        for (const learner of learners) {
            let learnerJson = {};

            const learnerInfo = await LearnerInformations.where({
                course_id: feedbackJson.course_id,
                batch_id: feedbackJson.batch_id,
                learner_id: learner.get('student_id'),
            }).fetch({ require: false });

            const user = await User.where({ id: learner.get('student_id'), active_status: 'active' }).fetch({ require: false, columns: ['id', 'full_name'] });

            if (learnerInfo && user) {
                learnerJson['student name'] = user.get('full_name');
                learnerJson['feedback name'] = feedbackJson.title;
                learnerJson.status = 'not_given';

                const fields = await FeedbackFields.where({
                    feedback_id: feedbackJson.id,
                    added_by: req.user.id,
                    active_status: constants.activeStatus.active,
                }).fetchAll({ require: false, columns: ['id', 'feedback_id', 'label', 'type'] });

                for (const field of fields) {
                    const response = await FeedbackResponse.where({
                        field_id: field.get('id'),
                        added_by: learner.get('student_id')
                    }).fetch({
                        require: false,
                        columns: ['id', 'field_id', 'response', 'added_by'],
                        withRelated: [{
                            'addedBy': function (query) {
                                query.select('id', 'full_name', 'phone', 'email');
                            },
                        }]
                    });

                    let responseText = '';
                    if (response) {
                        responseText = convert(response.get('response')); // Convert HTML response to plain text
                        learnerJson[convert(field.get('label'))] = responseText;
                        learnerJson.status = 'given';
                    }
                }

                learnerArray.push(learnerJson);
            }

        }

        // Convert learnersArray to CSV
        const csvData = stringify(learnerArray, {
            header: true
        });

        const directoryPath = path.join(__dirname, '../../../../public/uploads/exports');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        const filePath = path.join(directoryPath, 'feedback.csv');
        fs.writeFileSync(filePath, csvData);
        res.setHeader('Content-Disposition', 'attachment; filename=feedback.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.sendFile(filePath, (err) => {
            if (err) {
                next(err);
            } else {
                fs.unlinkSync(filePath);
            }
        });

        return res.success({
            message: 'Feedback exported successfully',
            file_url: `${process.env.BASE_URL}/${filePath.split('public')[1]}`
        });
    } catch (error) {
        console.error('Error in learner export:', error);
        return res.status(500).send({ error: 'Server error during learner export' });
    }
};

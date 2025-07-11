const bookshelf = require('../config/bookshelf');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { bcryptConfig } = require('../config');

const User = bookshelf.Model.extend({
    tableName: 'Users',
    hasTimestamps: true,
    autoIncrement: true,
    initialize: function () {
        // this.on('saving', function (model, attributes, options) {

        //     if (attributes.password && this.hasChanged()) {
        //         attributes.password = bcrypt.hashSync(attributes.password, bcryptConfig.hashRound);
        //     }
        // });
        this.on('saving', function (model, attributes, options) {
            if (model.hasChanged('password')) {
                model.set('password', bcrypt.hashSync(model.get('password'), bcryptConfig.hashRound));
            }
        });

        this.on('fetched', async function (model, attributes, options) {

            //Relations helper
            if (model.relations) {
                const obj = model.relations;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        model.attributes[key] = model.related(key).toJSON();
                    }
                }
            }

        });
        this.on('fetched:collection', async function (model, attributes, options) {

        });
    },
    pincode_id: function () {
        return this.belongsTo("Pin", "pincode_id");
    },
    place_id: function () {
        return this.belongsTo("Place", "place_id");
    },
    photo: function () {
        return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "user_photo");
    },
    aadhar_upload: function () {
        return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "aadhaar");
    },
    pan_upload: function () {
        return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "pan");
    },// Define relationships with attachments
    menu_plan: function () {
        return this.belongsTo("Menu_plan", "menu_plan_id");
    },
    staff_photo: function () {
        return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "staff_photo");
    },

});

User.prototype.toJSON = function () {
    const that = this.attributes;
    return _.omit(that, ['password']);
};


module.exports = bookshelf.model('User', User);
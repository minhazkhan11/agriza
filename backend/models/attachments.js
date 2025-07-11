const bookshelf = require('./../config/bookshelf');
require('./users')
const _ = require('lodash');

const Attachment = {
    tableName: 'Attachments',
    hasTimestamps: true,
    autoIncrement: true,
    attachment() {
        return this.morphTo('attachment', ['entity_type', 'entity_id'], 'Users' ,'license_details');
    },
    addedBy: function () {
        return this.belongsTo("Users", "added_by");
      },
    
};

Attachment.prototype = function () {
    const that = this.attributes;
    return _.omit(that, [ 'created_at', 'updated_at', 'entity_type', 'entity_id']);
};


module.exports = bookshelf.model('Attachments', Attachment);
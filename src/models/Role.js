const mongoose = require('mongoose');
const UserRole = require('../enums/UserRole');

const roleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        enum: Object.values(UserRole),
        default: UserRole.PUBLIC
    },
    description: { type: String }
}, { timestamps: true });

roleSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Role', roleSchema);
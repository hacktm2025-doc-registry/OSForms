const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const workflowProcessSchemaEntity = new mongoose.Schema({
    step_name: {
        type: String,
        required: true,
        unique: true,
    },
    step_type: {
        type: String,
        required: false,// Example types, adjust as needed
    },
    next_steps: {
        type: [Object],
        required: false,
        default: '', // Default to an empty string if no next step is provided
    },
    proceed_to_next_step_event: {
        type: String,
        required: false,
        default: '', // Default to an empty string if no event is provided
    },
    previous_step: {
        type: ObjectId,
        required: false,
        default: '', // Default to an empty string if no previous step is provided
    },
    roles: {
        type: [String], // Ensure roles is an array
        required: false,
        default: [], // Default to an empty array if no roles are provided
    },
    description: {
        type: String,
        required: false,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    }); 
// Export the model
module.exports = mongoose.model('workflowProcess', workflowProcessSchemaEntity);
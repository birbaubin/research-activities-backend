const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LaboratorySchema = new Schema({
    name: {
        type: String,
        required: [true]
    },
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true]
    }
});

const Laboratory = mongoose.model('laboratory', LaboratorySchema);
module.exports = Laboratory;
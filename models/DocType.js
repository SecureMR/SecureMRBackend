const mongoose = require("mongoose");

const docTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: 'Document Type is required!'
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('DocType', docTypeSchema);
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    docDate: {
        type: Date,
    },
    ipfsHash: {
        type: String,
    },
    title: {
        type: String
    },
    docType: {
        type: String
    },
    pss: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PSS",
    },
    ars: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ARS",
    },
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Affiliate",
    },
    permittedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials"
    }]
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Document', documentSchema);
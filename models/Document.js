const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    docDate: {
        type: Date,
        required: 'Doc Date is required!'
    },
    ipfsHash: {
        type: String,
        required: "IPFS Hash is required!"
    },
    docType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocType",
        required: "Doc Type is required!"
    },
    pss: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PSS",
        required: "PSS is required!"
    },
    ars: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ARS",
        required: "ARS is required!"
    },
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Affiliate",
        required: "Affiliate is required!"
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Document', documentSchema);
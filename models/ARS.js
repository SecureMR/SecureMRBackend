const mongoose = require("mongoose");

const arsSchema = new mongoose.Schema({
    company: {
        type: String,
        required: "Company name is required!"
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: "Profile is required!"
    },
    credentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials",
        required: "Credentials is required!"
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }],
    affiliates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Affiliate"
    }]
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('ARS', arsSchema);
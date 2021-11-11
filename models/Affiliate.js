const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        required: "ID Number is required!"
    },
    ssn: {
        type: String,
        required: "ID Number is required!"
    },
    dependents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dependent"
    }],
    credentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials",
        required: "Credentials is required!"
    },
    ars: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ARS",
        required: "ARS is required!"
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: "Profile is required!"
    },
    medicalProfessionals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalProfessional"
    }],
    trustedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials"
    }],
    documentRequests: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true,
        },
        message: {
            type: String
        },
        petitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Credentials"
        },
        state: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Approved", "Denied"]
        }
    }]
    // documentHistory: [{
    //     action: {
    //         type: String
    //     },
    //     date: {
    //         type: Date
    //     },
    //     affectedObject: {
    //         type: String,
    //         enum: ["trustedUser", "documentShare"]
    //     },
    //     objectId: {
    //         type: mongoose.Schema.Types.ObjectId
    //     }
    // }]
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Affiliate', affiliateSchema);
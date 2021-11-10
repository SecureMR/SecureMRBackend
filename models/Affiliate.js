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
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
    }],
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
        idUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Credentials"
        },
        expDate : {
            type: Date
        }
    }],
    documentHistory: [{
        action: {
            type: String
        },
        date: {
            type: Date
        },
        affectedObject: {
            type: String,
            enum: ["trustedUser", "documentShare"]
        },
        objectId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Affiliate', affiliateSchema);
const mongoose = require("mongoose");

const credentialsSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: "Username is required!"
    },
    password:{
        type: String,
        required: "Password is required!"
    },
    ipfsAddress:[{
        type: String,
    }],
    fingerprintHash:{
        type: String,
    },
    role: {
        type: String,
        default: "affiliate",
        enum: ["pss", "ars", "affiliate", "dependent", "medicalProfessional", "admin"]
    },
    accessToken: {
        type: String
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Credentials', credentialsSchema);
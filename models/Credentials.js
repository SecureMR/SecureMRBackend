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
    ipfsAddress:{
        type: String,
        required: "IPFS Address is required!"
    },
    fingerprintHash:{
        type: String,
        required: "Fingerprint Hash is required!"
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Credentials', credentialsSchema);
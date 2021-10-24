const mongoose = require("mongoose");

const medicalProfessionalSchema = new mongoose.Schema({
    specialty: {
        type: String,
        required: 'Specialty is required!'
    },
    medicalLicense: {
        type: String,
        required: 'Medical License is required!'
    },
    pss: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PSS",
        required: 'PSS is required!'
    },
    credentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials",
        required: 'Credentials is required!'
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: 'Profile is required!'
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('MedicalProfessional', medicalProfessionalSchema);
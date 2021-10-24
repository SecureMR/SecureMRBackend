const mongoose = require("mongoose");

const affiliateTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: "Affiliate type is required!"
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('AffiliateType', affiliateTypeSchema);